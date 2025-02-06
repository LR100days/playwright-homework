import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
  await page.getByRole('button', {name:" Owners"}).click();
  await page.getByText(' Search').click()
  await expect(page.locator('h2')).toHaveText('Owners')
})

test.describe("Lists and dropdowns assignment", async () => {
    test('Validate selected pet types from the list', async ({page}) => {
    // Check the default pet selection of "George Franklin" owner
        await page.getByRole('link', {name: 'George Franklin'}).click();
        await expect(page.locator(".ownerFullName")).toHaveText("George Franklin");
        await page.getByRole('button', {name: 'Edit Pet'}).click()
        await expect(page.locator('h2')).toHaveText('Pet')
        await expect(page.locator('#owner_name')).toHaveValue('George Franklin')

        const petTypeField = page.locator('#type1');
        await expect(petTypeField).toHaveValue('cat')

    // Select pet option from the dropdown one by one  and verify that selected value is displayed in Type field
        const petTypeDropdownMenu = page.locator("#type")
        const petTypesOptions = ["cat", "dog", "lizard", "snake", "bird", "hamster", "panda"];
        
        for (const type of petTypesOptions) {
        await petTypeDropdownMenu.selectOption(type);
        await expect(petTypeField).toHaveValue(type);
        }
    });

    test('Validate the pet type update', async ({page}) => {
        await page.getByRole('link', {name: 'Eduardo Rodriquez'}).click();
        const editPetButton = page.locator("app-pet-list", { hasText: "Rosy" }).getByRole('button', { name: 'Edit Pet' })
        await editPetButton.click()
        await expect(page.locator('#name')).toHaveValue('Rosy')

    // Verify that initial value "dog" is displayed in the "Type" field 
        const petTypeField = page.locator('#type1')
        await expect(petTypeField).toHaveValue('dog')

    // Update pet type 
        const petTypeDropdownMenu = page.locator('#type')

        petTypeDropdownMenu.selectOption('bird')
        await expect(petTypeField).toHaveValue('bird')
        await expect(petTypeDropdownMenu).toHaveValue('bird')

        const updatePetButton = page.getByRole('button', {name:"Update Pet"})
        await updatePetButton.click();

        const petTypeOnOwnerInfoPage = page.locator('.dl-horizontal', { hasText: "Rosy" }).locator('dd').last()
        await expect(petTypeOnOwnerInfoPage).toHaveText('bird')
   
    // Revert the selection of the pet type "bird" to its initial value "dog" and verify pet type
        await editPetButton.click()
        await expect(petTypeField).toHaveValue('bird')
        petTypeDropdownMenu.selectOption('dog')
        await expect(petTypeField).toHaveValue('dog')
        await expect(petTypeDropdownMenu).toHaveValue('dog')
        await updatePetButton.click();
        await expect(petTypeOnOwnerInfoPage).toHaveText('dog')
    });
})