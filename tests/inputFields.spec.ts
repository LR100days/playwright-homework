import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/');
  await page.getByRole('link', {name:"Pet Types"}).click();
  await expect(page.getByRole('heading')).toHaveText('Pet Types');
})

test.describe("Interacting with Input Fields practice", async () => {
    test('Update pet type', async ({page}) => {
        // Change the pet type name from "cat" to "rabbit" and click "Update" button
        await page.getByRole('row', { name: 'cat' }).getByRole('button', {name: 'Edit'}).click();

        await expect(page.getByRole('heading')).toHaveText('Edit Pet Type');
        const nameField = page.getByRole('textbox');
        await nameField.click();
        await nameField.clear();
        await nameField.fill('rabbit');
        await page.getByRole('button', {name:"Update"}).click();
        

        //Add the assertion that the first pet type in the list of types has an edited value "rabbit" 
        const firstPetInTheList = page.locator('[id="0"]');
        await expect(firstPetInTheList).toHaveValue("rabbit");
        
        //Click on "Edit" button for the same "rabbit" pet type
        await page.getByRole('row', { name: 'rabbit' }).getByRole('button', {name: 'Edit'}).click();

        // Change the pet type name back from "rabbit" to "cat" and click "Update" button
        await nameField.click();
        await nameField.clear();
        await nameField.fill('cat');
        await page.getByRole('button', {name:"Update"}).click();

        //Add the assertion that the first pet type in the list of names has a value "cat" 
        await expect(firstPetInTheList).toHaveValue("cat")
    });

    test('Cancel pet type update', async ({page}) => {
        // Click on "Edit" button for the "dog" pet type
        await page.getByRole('row', { name: 'dog' }).getByRole('button', {name: 'Edit'}).click()

        // Type the new pet type name "moose"
        const nameField = page.getByRole('textbox')
        await nameField.click()
        await nameField.clear()
        await nameField.fill('moose')

        // Add assertion the value "moose" is displayed in the input field of the "Edit Pet Type" page
        const nameFieldValue = await nameField.inputValue();
        expect(nameFieldValue).toEqual('moose');

        // Cancel the changes and verify that the "dog" value is still displayed in the list of pet types
        await page.getByRole('button', {name:"Cancel"}).click()
        await expect(page.locator('[id="1"]')).toHaveValue("dog");
    });

    test('Pet type name is required validation', async ({page}) => {
        // Click on "Edit" button for the "lizard" pet type
        await page.getByRole('row', { name: 'lizard' }).getByRole('button', {name: 'Edit'}).click()

        // On the Edit Pet Type page, verify validation message when Name field is empty
        const nameField = page.getByRole('textbox')
        await nameField.click()
        await nameField.clear()
        await expect(page.locator('.help-block')).toHaveText('Name is required');
        await page.getByRole('button', {name:"Update"}).click()

        // Verify that "Edit Pet Type" page is still displayed after submitting empty value
        await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
        await page.getByRole('button', {name:"Cancel"}).click()

        // Verify that "Pet Types" page is displayed when changes are cancelled
        await expect(page.getByRole('heading')).toHaveText('Pet Types')
    });

})