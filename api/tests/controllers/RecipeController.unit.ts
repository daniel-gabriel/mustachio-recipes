import {RecipeController} from "../../src/controllers/RecipeController";
import {It, Mock} from "typemoq";
import {IRecipeRepository} from "../../src/infra/IRecipeRepository";
import {IRecipe} from "../../src/infra/IRecipe";
import {IMock} from "typemoq/Api/IMock";
import {UnitsEnum} from "../../src/infra/UnitsEnum";
import {LocalesEnum} from "../../src/infra/LocalesEnum";
import {IRecipeToJsonConverter} from "../../src/services/IRecipeToJsonConverter";
import {IUserRepository} from "../../src/infra/IUserRepository";
import {IGroupRepository} from "../../src/infra/IGroupRepository";
import {IPagedList} from "../../src/infra/IPagedList";
import {IPrincipal} from "../../src/startup/auth/IPrincipal";

describe("RecipeController", () => {
    let controller: RecipeController;
    let recipeRepositoryMock: IMock<IRecipeRepository>;
    let recipeToJsonConverterMock: IMock<IRecipeToJsonConverter>;
    let groupRepositoryMock: IMock<IGroupRepository>;
    let userRepositoryMock: IMock<IUserRepository>;

    const mockRecipe: IRecipe = {
        id: "1",
        locale: LocalesEnum["en-US"],
        createdBy: "a user",
        createdOn: new Date(),
        lastUpdatedOn: new Date(),
        name: "Test Recipe",
        description: "Delicious",
        ingredients: [{item: "Salt", quantity: 1, unit: UnitsEnum.Tsp}],
        steps: [{
            instructions: "Cook"
        }],
        mediaUrls: [{type: "image", url: "https://example.com/image.jpg"}],
    };
    const requestWithMatchingPrincipal = {
        user: <IPrincipal>{
            subId: mockRecipe.createdBy
        }
    };

    beforeEach(() => {
        recipeRepositoryMock = Mock.ofType<IRecipeRepository>();
        recipeToJsonConverterMock = Mock.ofType<IRecipeToJsonConverter>();
        groupRepositoryMock = Mock.ofType<IGroupRepository>();
        userRepositoryMock = Mock.ofType<IUserRepository>();
        controller = new RecipeController(
            recipeRepositoryMock.object,
            recipeToJsonConverterMock.object,
            groupRepositoryMock.object,
            userRepositoryMock.object
        );
    });

    it("getRecipes_withNoFilter_returnsAllRecipes", async () => {
        // arrange
        const pageIndex = 0;
        const pageSize = 2;

        recipeRepositoryMock
            .setup(m => m.getAll(requestWithMatchingPrincipal.user.subId, pageIndex, pageSize))
            .returns(async () => (<IPagedList<IRecipe>> {
                pageIndex,
                pageSize,
                totalItems: 1,
                totalPages: 1,
                data: [mockRecipe]
            }));

        // act
        const result = await controller.getRecipes(requestWithMatchingPrincipal, pageIndex, pageSize);

        // assert
        expect(result.data.length).toBe(1);
        expectMatches(result.data[0], mockRecipe);
    });

    it("getRecipe_withValidId_returnsRecipe", async () => {
        // arrange
        const expectedId = "some_id";
        recipeRepositoryMock.setup(m => m.getById(expectedId)).returns(async () => mockRecipe);

        // act
        const result = await controller.getRecipe(requestWithMatchingPrincipal, expectedId);

        // assert
        expectMatches(result, mockRecipe);
    });

    it("createRecipe_withValidRecipe_createsRecipe", async () => {
        // arrange
        recipeRepositoryMock
            .setup(m => m.create(mockRecipe.createdBy, It.isAny()))
            .returns(async () => mockRecipe);

        // act
        const result = await controller.createRecipe(requestWithMatchingPrincipal, mockRecipe);

        // assert
        expectMatches(result, mockRecipe);
    });

    it("update_withValidData_updatesRecipe", async () => {
        // arrange
        const updatedRecipe: IRecipe = {
            ...mockRecipe,
            name: "Updated Recipe",
            description: "Updated Description",
            ingredients: [...mockRecipe.ingredients, {item: "Pepper", quantity: 1, unit: UnitsEnum.Tsp}],
            steps: [...mockRecipe.steps, {instructions: "Serve"}],
            mediaUrls: [...mockRecipe.mediaUrls, {type: "video", url: "https://example.com/video.mp4"}]
        };
        recipeRepositoryMock
            .setup(m => m.getById(updatedRecipe.id))
            .returns(async () => updatedRecipe);
        recipeRepositoryMock
            .setup(m => m.update(mockRecipe.createdBy, updatedRecipe.id, updatedRecipe))
            .returns(async () => updatedRecipe);

        // act
        const result = await controller.updateRecipe(
            requestWithMatchingPrincipal,
            updatedRecipe.id,
            updatedRecipe);

        // assert
        expectMatches(result, updatedRecipe);
    });

    it("deleteRecipe_withValidId_deletesRecipe", async () => {
        // arrange
        recipeRepositoryMock
            .setup(m => m.getById(mockRecipe.id))
            .returns(async () => mockRecipe);
        recipeRepositoryMock
            .setup(m => m.delete(mockRecipe.id))
            .returns(async () => true);

        // act
        const result =
            await controller.deleteRecipe(requestWithMatchingPrincipal, mockRecipe.id);

        // assert
        expect(result).toBe(true);
    });

    afterEach(() => {
        recipeRepositoryMock.verifyAll();
    });

    function expectMatches(result: IRecipe | null, expected: IRecipe) {
        expect(result).not.toBeNull();
        expect(result!.id).toBe(expected.id);
        expect(result!.name).toBe(expected.name);
        expect(result!.description).toBe(expected.description);

        // Validate ingredients
        expect(result!.ingredients.length).toBe(expected.ingredients.length);
        result!.ingredients.forEach((ingredient, index) => {
            expect(ingredient.item).toBe(expected.ingredients[index].item);
            expect(ingredient.quantity).toBe(expected.ingredients[index].quantity);
            expect(ingredient.unit).toBe(expected.ingredients[index].unit);
        });

        // Validate steps
        expect(result!.steps.length).toBe(expected.steps.length);
        result!.steps.forEach((step, index) => {
            expect(step).toBe(expected.steps[index]);
        });

        // Validate mediaUrls
        expect(result!.mediaUrls.length).toBe(expected.mediaUrls.length);
        result!.mediaUrls.forEach((mediaUrl, index) => {
            expect(mediaUrl.type).toBe(expected.mediaUrls[index].type);
            expect(mediaUrl.url).toBe(expected.mediaUrls[index].url);
        });
    }
});
