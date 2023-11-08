import {MongoRecipeRepository} from "../../src/infra/MongoRecipeRepository";
import {IRecipe} from "../../src/infra/IRecipe";
import {MongoTestHelper} from "../_utils/MongoTestHelper";
import {GroupModel} from "../../src/infra/GroupModel";

const mongoTestHelper = new MongoTestHelper();

describe("MongoRecipeRepository", () => {
    let repo: MongoRecipeRepository;

    const mockUser = "mockSubId";
    const mockRecipe: IRecipe = {
        id: "1",
        name: "Test Recipe",
        description: "Delicious",
        ingredients: [{item: "Salt", quantity: 1, unit: "tsp"}],
        steps: [{
            instructions: "Cook"
        }],
        mediaUrls: [{type: "image", url: "http://example.com/image.jpg"}],
        createdBy: mockUser,
        createdOn: new Date(),
        lastUpdatedOn: new Date()
    } as IRecipe;

    beforeAll(async () => {
        await mongoTestHelper.startInMemoryMongo();
        repo = new MongoRecipeRepository();
    });

    afterAll(async () => {
        await mongoTestHelper.stopInMemoryMongo();
    });

    it("create_withValidRecipe_createsRecipe", async () => {
        // act
        const createdRecipe = await repo.create(mockUser, mockRecipe);

        // assert
        expectMatches(createdRecipe, mockRecipe);
    });

    it("getAll_withMembersInDefaultGroup_returnsAllOwnedAndMemberRecipes", async () => {
        // arrange
        const memberUser = "memberMockSubId";
        const expectedRecipe = await repo.create(mockUser, mockRecipe);
        const expectedMemberRecipe = await repo.create(memberUser, {
            ...mockRecipe,
            name: "Yet Another Test Recipe"
        });
        // make memberUser a member of mockUser's default group
        const group = new GroupModel({
            name: "default",
            owner: mockUser,
            members: [{subId: memberUser}]
        });
        await group.save();

        // act
        const recipes = await repo.getAll(mockUser);

        // assert
        expect(recipes.totalItems).toBeGreaterThanOrEqual(2);
        expect(recipes.data.length).toBeGreaterThanOrEqual(2);
        expect(recipes.data.find(r => r.id === expectedRecipe.id)).not.toBeUndefined();
        expect(recipes.data.find(r => r.id === expectedMemberRecipe.id)).not.toBeUndefined();
    });

    it("getAll_withNoParameters_returnsAllOwnedAndMemberRecipes", async () => {
        // arrange
        const expectedRecipe1 = await repo.create(mockUser, mockRecipe);
        const expectedRecipe2 = await repo.create(mockUser, {
            ...mockRecipe,
            name: "Another Test Recipe"
        });
        const unexpectedRecipe = await repo.create("another subId", {
            ...mockRecipe,
            name: "Someone else's recipe"
        });

        // act
        const recipes = await repo.getAll(mockUser);

        // assert
        expect(recipes.totalItems).toBeGreaterThanOrEqual(2);
        expect(recipes.data.length).toBeGreaterThanOrEqual(2);
        expectMatches(recipes.data.find(r => r.id === expectedRecipe1.id), expectedRecipe1, true);
        expectMatches(recipes.data.find(r => r.id === expectedRecipe2.id), expectedRecipe2, true);
        expect(recipes.data.find(r => r.id === unexpectedRecipe.id)).toBeUndefined();
    });

    it("getById_withValidOwnedId_returnsRecipe", async () => {
        // arrange
        const createdRecipe = await repo.create(mockUser, mockRecipe);

        // act
        const retrievedRecipe = await repo.getById(createdRecipe.id!);

        // assert
        expect(retrievedRecipe).not.toBeNull();
        expect(retrievedRecipe?.id).toBe(createdRecipe.id);
        expect(retrievedRecipe?.name).toBe(createdRecipe.name);
    });

    it("update_withValidUpdateData_updatesRecipe", async () => {
        // arrange
        const createdRecipe = await repo.create(mockUser, mockRecipe);
        const updatedRecipeData: IRecipe = {
            ...createdRecipe,
            name: "Updated Recipe Name"
        };

        // act
        const updatedRecipe = await repo.update(mockUser, createdRecipe.id!, updatedRecipeData);

        // assert
        expect(updatedRecipe).not.toBeNull();
        expect(updatedRecipe?.name).toBe(updatedRecipeData.name);
    });

    it("delete_withValidId_deletesRecipe", async () => {
        // arrange
        const createdRecipe = await repo.create(mockUser, mockRecipe);

        // act
        const isDeleted = await repo.delete(createdRecipe.id!);

        // assert
        expect(isDeleted).toBe(true);
        // Try retrieving it again, should be null
        const retrievedRecipe = await repo.getById(createdRecipe.id!);
        expect(retrievedRecipe).toBeNull();
    });

    function expectMatches(recipe1?: IRecipe, recipe2?: IRecipe, compareId: boolean = false) {
        if (!recipe1 && !recipe2) {
            return;
        }
        if (compareId) {
            expect(recipe1?.id).toBe(recipe2?.id);
        }
        expect(recipe1?.name).toBe(recipe2?.name);
        expect(recipe1?.description).toBe(recipe2?.description);
        expect(recipe1?.ingredients.length).toBe(recipe2?.ingredients.length);
        recipe1?.ingredients?.forEach((ingredient, index) => {
            expect(ingredient.item).toBe(recipe2?.ingredients[index].item);
            expect(ingredient.quantity).toBe(recipe2?.ingredients[index].quantity);
            expect(ingredient.unit).toBe(recipe2?.ingredients[index].unit);
        });
        expect(recipe1?.steps.length).toBe(recipe2?.steps.length);
        recipe1?.steps.forEach((step, index) => {
            expect(step?.instructions).toBe(recipe2?.steps[index]?.instructions);
        });
        expect(recipe1?.mediaUrls.length).toBe(recipe2?.mediaUrls.length);
        recipe1?.mediaUrls.forEach((mediaUrl, index) => {
            expect(mediaUrl.type).toBe(recipe2?.mediaUrls[index].type);
            expect(mediaUrl.url).toBe(recipe2?.mediaUrls[index].url);
        });
    }
});