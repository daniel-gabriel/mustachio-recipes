import {expect, test} from "@playwright/test";

test.describe("Recipes List", () => {
    test.beforeEach(async ({page}, testInfo) => {
        // page = await browser.newPage();
        console.log(`Running ${testInfo.title}`);
        await page.goto('http://localhost:5173/recipes');
    });

    test.afterEach(async ({page}) => {
        await page.close();
    });

    test('should display the "Recipes" title', async ({page}) => {
        const title = await page.$('text=Recipes');
        expect(title).toBeTruthy();
    });

    test('should display a "Create New Recipe" button', async ({page}) => {
        const createButton = await page.getByText("Create New Recipe"); //page.$('text=Create New Recipe');
        expect(createButton).toBeTruthy();
    });

    test('should go to create recipe page when "Create New Recipe" is clicked', async ({page}) => {
        await page.click('text=Create New Recipe');
        // Check if it has navigated to the create recipe page
        const createPageTitle = await page.$('text=Create New Recipe');
        expect(createPageTitle).toBeTruthy();
    });

    test('should go to view recipe page when "View" is clicked', async ({page}) => {
        const recipe = await createTestRecipe();
        await page.reload();
        await page.click('text=View');
        // Check if it has navigated to the view recipe page
        const viewPageTitle = await page.getByText("Recipe Details"); //page.$('text=Recipe Details');
        expect(viewPageTitle).toBeTruthy();

        // clean-up
        await deleteTestRecipe(recipe);
    });

    test('should go to edit recipe page when "Edit" is clicked', async ({page}) => {
        const recipe = await createTestRecipe();
        await page.click('text=Edit');
        // Check if it has navigated to the edit recipe page
        const editPageTitle = await page.getByText("Update Recipe"); //page.$('text=Update Recipe'); // Replace 'Edit Recipe' with the actual title on the edit page.
        expect(editPageTitle).toBeTruthy();

        // clean-up
        await deleteTestRecipe(recipe);
    });

    test('should display a confirmation when "Delete" is clicked', async ({page}) => {
        const recipe = await createTestRecipe();

        page.on('dialog', async dialog => {
            console.log(dialog.message());
            expect(dialog.message()).toMatch(/Are you sure you want to delete recipe/);
            // click OK
            await dialog.accept();
            //TODO: intercept the "delete" api call and verify right parameters
            //TODO: add same test but "cancel" instead of "ok". use `dialog.dismiss()`
        });

        await page.click('text=Delete');
        // expect(page.locator("")
    });


    const apiBaseUrl = "http://localhost:3000";
    async function createTestRecipe(): Promise<{id}> {
        const response = await fetch(`${apiBaseUrl}/recipes/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: "",
                name: "Test Recipe",
                description: "Test Description",
                ingredients: [
                    {item: "ing1", quantity: "2", unit: "each"},
                    {item: "ing2", quantity: "3", unit: "lbs"},
                ],
                steps: [
                    {instructions: "Cut"},
                    {instructions: "Cook"},
                ],
                mediaUrls: [
                    {type: 'image', url: "https://someimage.com/img1.jpg"},
                    {type: 'video', url: "https://someimage.com/video.jpg"},
                ]
            })
        });
        console.log("--------------------------------------");
        return await response.json();
    }
    async function deleteTestRecipe(recipe: {id: string}) {
        await fetch(`${apiBaseUrl}/recipes/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "Test Recipe",
                description: "Test Description",
                ingredients: [
                    {item: "ing1", quantity: 2, unit: "each"},
                    {item: "ing2", quantity: 3, unit: "lbs"},
                ],
                steps: [
                    {instructions: "Cut"},
                    {instructions: "Cook"},
                ],
                mediaUrls: [
                    {type: 'image', url: "https://someimage.com/img1.jpg"},
                    {type: 'video', url: "https://someimage.com/video.jpg"},
                ]
            })
        });
    }
});
