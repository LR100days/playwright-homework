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
        await pm.onPetTypePage().clickEditbuttonForPetType('cat')
        await pm.onPetTypePage().enterNewPetTypeName('rabbit')
        await pm.onPetTypePage().confirmPetTypeNameUpdating()
        await pm.onPetTypePage().validatePetTypeValueByRowIndex('0','rabbit')

        // Change the pet type name back from "rabbit" to "cat"
        await pm.onPetTypePage().clickEditbuttonForPetType('rabbit')
        await pm.onPetTypePage().enterNewPetTypeName('cat')
        await pm.onPetTypePage().confirmPetTypeNameUpdating()
        await pm.onPetTypePage().validatePetTypeValueByRowIndex('0','cat')
    });

    test('Cancel pet type update', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onPetTypePage().clickEditbuttonForPetType('dog')
        await pm.onPetTypePage().enterNewPetTypeName('mouse')
        await pm.onPetTypePage().clickCancelButtonForPetTypeUpdating()
        await pm.onPetTypePage().validatePetTypeValueByRowIndex('1','dog')
    });

    test('Pet type name is required validation', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onPetTypePage().clickEditbuttonForPetType('lizard')

        // On the Edit Pet Type page, verify validation message when Name field is empty
        await pm.onPetTypePage().clearNameField()
        await pm.onPetTypePage().verifyValidationMessageForEmptyPetTypeNameFieldIs('Name is required')

        // Verify that "Edit Pet Type" page is still displayed after submitting empty value
        await pm.onPetTypePage().confirmPetTypeNameUpdating()
        await pm.onPetTypePage().verifyPageHeadingIs('Edit Pet Type')
        await pm.onPetTypePage().clickCancelButtonForPetTypeUpdating()

        // Verify that "Pet Types" page is displayed when changes are cancelled
        await pm.onPetTypePage().verifyPageHeadingIs('Pet Types')
    });

})