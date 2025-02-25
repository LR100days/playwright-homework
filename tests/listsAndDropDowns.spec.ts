import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test.beforeEach( async({page}) => {
  await page.goto('/')
  const pm = new PageManager(page)
  await pm.navigateTo().ownersPage()
})

test.describe("Lists and dropdowns assignment", async () => {
    test('Validate selected pet types from the list', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onOwnersPage().selectOwnerFromOwnersTable('George Franklin')
        await page.locator("app-pet-list", { hasText: "Leo" }).getByRole('button', { name: 'Edit Pet' }).click()
        await pm.onPetDetailsPage().validatePetOwnerAndTypeOnEditPetPageToBe('George Franklin', 'cat')
        await pm.onPetDetailsPage().selectSequentiallyAllOptionsFromDropdownAndVerifyOptionDisplayInTypeField()
    });

    test('Validate the pet type update', async ({page}) => {
        const pm = new PageManager(page)
        await pm.onOwnersPage().selectOwnerFromOwnersTable('Eduardo Rodriquez')
        await pm.onPetDetailsPage().editPetWithName('Rosy')

    // Verify that initial value "dog" is displayed in the "Type" field for pet Rosy
        await pm.onPetDetailsPage().validatePetOwnerAndTypeOnEditPetPageToBe('Eduardo Rodriquez', 'dog')

    // Update pet type 
        await pm.onPetDetailsPage().changePetTypeDropdownOptionTo('bird')

        await page.getByRole('button', {name:"Update Pet"}).click()

        await pm.onPetDetailsPage().validateRosyPetTypeOnOwnerInfoPageToBe('bird')
   
    // Revert the selection of the pet type "bird" for Rosy pet to its initial value "dog" and verify pet type
        await pm.onPetDetailsPage().editPetWithName('Rosy')
        await pm.onPetDetailsPage().validatePetOwnerAndTypeOnEditPetPageToBe('Eduardo Rodriquez', 'bird')
        await pm.onPetDetailsPage().changePetTypeDropdownOptionTo('dog')
        
        await page.getByRole('button', {name:"Update Pet"}).click();

        await pm.onPetDetailsPage().validateRosyPetTypeOnOwnerInfoPageToBe('dog')
    });
})