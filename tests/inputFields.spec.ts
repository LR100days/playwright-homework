import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test.beforeEach( async({page}) => {
  await page.goto('/');
  const pm = new PageManager(page)
  await pm.navigateTo().petTypesPage()
})

test.describe("Interacting with Input Fields practice", async () => {
    test('Update pet type', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onPetTypePage().petTypeToBeEdited('cat')
        await pm.onPetTypePage().clearNameFieldAndEnterNewPetTypeName('rabbit')
        await page.getByRole('button', {name:"Update"}).click(); 
        const firstPetInTheList = page.locator('[id="0"]');
        await expect(firstPetInTheList).toHaveValue('rabbit');

        // Change the pet type name back from "rabbit" to "cat"
        await pm.onPetTypePage().petTypeToBeEdited('rabbit')
        await pm.onPetTypePage().clearNameFieldAndEnterNewPetTypeName('cat')
        await page.getByRole('button', {name:"Update"}).click();
        await expect(firstPetInTheList).toHaveValue("cat")
    });

    test('Cancel pet type update', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onPetTypePage().petTypeToBeEdited('dog')
        await pm.onPetTypePage().clearNameFieldAndEnterNewPetTypeName('mouse')
        await page.getByRole('button', {name:"Cancel"}).click()
        await expect(page.locator('[id="1"]')).toHaveValue('dog');
    });

    test('Pet type name is required validation', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onPetTypePage().petTypeToBeEdited('lizard')

        // On the Edit Pet Type page, verify validation message when Name field is empty
        await pm.onPetTypePage().clearNameField()
        await expect(page.locator('.help-block')).toHaveText('Name is required');

        // Verify that "Edit Pet Type" page is still displayed after submitting empty value
        await page.getByRole('button', {name:"Update"}).click()
        await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
        await page.getByRole('button', {name:"Cancel"}).click()

        // Verify that "Pet Types" page is displayed when changes are cancelled
        await expect(page.getByRole('heading')).toHaveText('Pet Types')
    });

})