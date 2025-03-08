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
        await pm.onEditPetTypePage().enterNewPetTypeName('rabbit')
        await pm.onEditPetTypePage().confirmPetTypeNameUpdating()
        await pm.onPetTypePage().validatePetTypeValueByRowIndex('0','rabbit')

        // Change the pet type name back from "rabbit" to "cat"
        await pm.onPetTypePage().clickEditbuttonForPetType('rabbit')
        await pm.onEditPetTypePage().enterNewPetTypeName('cat')
        await pm.onEditPetTypePage().confirmPetTypeNameUpdating()
        await pm.onPetTypePage().validatePetTypeValueByRowIndex('0','cat')
    });

    test('Cancel pet type update', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onPetTypePage().clickEditbuttonForPetType('dog')
        await pm.onEditPetTypePage().enterNewPetTypeName('mouse')
        await pm.onEditPetTypePage().clickCancelButtonForPetTypeUpdating()
        await pm.onPetTypePage().validatePetTypeValueByRowIndex('1','dog')
    });

    test('Pet type name is required validation', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onPetTypePage().clickEditbuttonForPetType('lizard')

        // On the Edit Pet Type page, verify validation message when Name field is empty
        await pm.onEditPetTypePage().clearNameField()
        await pm.onEditPetTypePage().verifyValidationMessageForEmptyPetTypeNameFieldIs('Name is required')

        // Verify that "Edit Pet Type" page is still displayed after submitting empty value
        await pm.onEditPetTypePage().confirmPetTypeNameUpdating()
        await pm.onEditPetTypePage().verifyPageHeadingIs('Edit Pet Type')
        await pm.onEditPetTypePage().clickCancelButtonForPetTypeUpdating()

        // Verify that "Pet Types" page is displayed when changes are cancelled
        await pm.onEditPetTypePage().verifyPageHeadingIs('Pet Types')
    });

})