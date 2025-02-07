import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
  await page.getByRole('button', {name:"Veterinarians"}).click();
  await page.getByRole('link', {name:"All"}).click()
})

test.describe("Checkboxes assignment", async () => {
  test('Validate selected specialties', async ({page}) => {
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')

    // Select the veterinarian "Helen Leary" and edit Specialties
    await page.locator('tr', {hasText: 'Helen Leary'}).getByRole('button',{name: "Edit Vet"}).click();
    
    // Check default Specialties and its selection
    const specialtiesDropdown = page.locator('.selected-specialties')
    await expect(specialtiesDropdown).toHaveText('radiology');

    await specialtiesDropdown.click()
    const radiologyCheckbox = page.getByRole('checkbox', {name: 'radiology'})
    const surgeryCheckbox = page.getByRole('checkbox', {name: 'surgery'})
    const dentistryCheckbox = page.getByRole('checkbox', {name: 'dentistry'})

    expect(await radiologyCheckbox.isChecked()).toBeTruthy
    expect(await surgeryCheckbox.isChecked()).toBeFalsy
    expect(await dentistryCheckbox.isChecked()).toBeFalsy

    // Modify specialty and verify changes
    await surgeryCheckbox.check()
    await radiologyCheckbox.uncheck()
    await expect(specialtiesDropdown).toHaveText('surgery');

    await dentistryCheckbox.check()
    await expect(specialtiesDropdown).toHaveText('surgery, dentistry');
  });

  test('Select all specialties', async ({page}) => {
    // Select the veterinarian "Rafael Ortega" and edit Specialties
    await page.locator('tr', {hasText: 'Rafael Ortega'}).getByRole('button',{name: "Edit Vet"}).click();
    
    // Check default Specialties
    const specialtiesDropdown = page.locator('.selected-specialties')
    await expect(specialtiesDropdown).toHaveText('surgery');

    // Select all specialties from the list and verify that all of them are displayed in the "Specialties" field
    await specialtiesDropdown.click()

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.check({force:true})
        expect(await box.isChecked()).toBeTruthy()
    }
    await expect(specialtiesDropdown).toHaveText('surgery, radiology, dentistry');
  });

  test('Unselect all specialties', async ({page}) => {
    // Select the veterinarian "Linda Douglas" and edit Specialties
    await page.locator('tr', {hasText: 'Linda Douglas'}).getByRole('button',{name: "Edit Vet"}).click();
    
    // Check default Specialties
    const specialtiesDropdown = page.locator('.selected-specialties')
    await expect(specialtiesDropdown).toHaveText('dentistry, surgery');

    // Unselect all specialties from the list and verify the "Specialties" field is empty
    await specialtiesDropdown.click()

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force:true})
        expect(await box.isChecked()).toBeFalsy()
    }
    await expect(specialtiesDropdown).toBeEmpty();
  });
})