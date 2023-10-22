import { RecipeController } from '../../src/controllers/RecipeController';
import {It, Mock} from "typemoq";
import { IRecipeRepository } from '../../src/infra/IRecipeRepository';
import { IRecipe } from '../../src/infra/IRecipe';
import {IMock} from "typemoq/Api/IMock";

describe('RecipeController', () => {
    let controller: RecipeController;
    let mockRepo: IMock<IRecipeRepository>;

    const mockRecipe: IRecipe = {
        id: '1',
        name: 'Test Recipe',
        description: 'Delicious',
        ingredients: [{ item: 'Salt', quantity: 1, unit: 'tsp' }],
        steps: [{
            instructions: 'Cook'
        }],
        mediaUrls: [{ type: 'image', url: 'https://example.com/image.jpg' }],
    };

    beforeEach(() => {
        mockRepo = Mock.ofType<IRecipeRepository>();
        controller = new RecipeController(mockRepo.object);
    });

    it('getRecipes_withNoFilter_returnsAllRecipes', async () => {
        // arrange
        mockRepo.setup(m => m.getAll()).returns(async () => [mockRecipe]);

        // act
        const result = await controller.getRecipes();

        // assert
        expect(result.length).toBe(1);
        expectMatches(result[0], mockRecipe);
    });

    it('getRecipe_withValidId_returnsRecipe', async () => {
        // arrange
        const expectedId = "some_id";
        mockRepo.setup(m => m.getById(expectedId)).returns(async () => mockRecipe);

        // act
        const result = await controller.getRecipe(expectedId);

        // assert
        expectMatches(result, mockRecipe);
    });

    it('createRecipe_withValidRecipe_createsRecipe', async () => {
        // arrange
        mockRepo.setup(m => m.create(It.isAny())).returns(async () => mockRecipe);

        // act
        const result = await controller.createRecipe(mockRecipe);

        // assert
        expectMatches(result, mockRecipe);
    });

    it('update_withValidData_updatesRecipe', async () => {
        // arrange
        const expectedId = "some_id";
        const updatedRecipe: IRecipe = {
            ...mockRecipe,
            name: 'Updated Recipe',
            description: 'Updated Description',
            ingredients: [...mockRecipe.ingredients, { item: 'Pepper', quantity: 1, unit: 'tsp' }],
            steps: [...mockRecipe.steps, {instructions: 'Serve'}],
            mediaUrls: [...mockRecipe.mediaUrls, { type: 'video', url: 'https://example.com/video.mp4' }]
        };
        mockRepo.setup(m => m.update(expectedId, updatedRecipe)).returns(async () => updatedRecipe);

        // act
        const result = await controller.updateRecipe(expectedId, updatedRecipe);

        // assert
        expectMatches(result, updatedRecipe);
    });

    it('deleteRecipe_withValidId_deletesRecipe', async () => {
        // arrange
        const expectedId = "some_id";
        mockRepo.setup(m => m.delete(expectedId)).returns(async () => true);

        // act
        const result = await controller.deleteRecipe(expectedId);

        // assert
        expect(result).toBe(true);
    });

    afterEach(() => {
        mockRepo.verifyAll();
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
