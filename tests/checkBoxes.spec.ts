import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test.beforeEach( async({page}) => {
  await page.goto('/')
  const pm = new PageManager(page)
  await pm.navigateTo().veterinariansPage()
})

test.describe("Checkboxes assignment", async () => {
  test('Validate selected specialties', async ({page}) => {
    const pm = new PageManager(page)
    await pm.onVeterinariansPage().clickEditButtonForVet('Helen Leary')
    await pm.onEditVeterinarianPage().checkVetSpecialityIs('radiology')

    const radiologyCheckbox = page.getByRole('checkbox', {name: 'radiology'})
    const surgeryCheckbox = page.getByRole('checkbox', {name: 'surgery'})
    const dentistryCheckbox = page.getByRole('checkbox', {name: 'dentistry'})

    expect(await radiologyCheckbox.isChecked()).toBeTruthy()
    expect(await surgeryCheckbox.isChecked()).toBeFalsy()
    expect(await dentistryCheckbox.isChecked()).toBeFalsy()
    
    // Modify specialty and verify changes
    await surgeryCheckbox.check()
    await radiologyCheckbox.uncheck()
    await pm.onEditVeterinarianPage().checkVetSpecialityIs('surgery')
    await dentistryCheckbox.check()
    await pm.onEditVeterinarianPage().checkVetSpecialityIs('surgery, dentistry')
  });

  test('Select all specialties', async ({page}) => {
    const pm = new PageManager(page)
    await pm.onVeterinariansPage().clickEditButtonForVet('Rafael Ortega')
    await pm.onEditVeterinarianPage().checkVetSpecialityIs('surgery')
    await pm.onEditVeterinarianPage().setAllSpecialitiesCheckboxesInSpecialitiesDropdownTo(true)
    await pm.onEditVeterinarianPage().checkVetSpecialityIs('surgery, radiology, dentistry')
  });

  test('Unselect all specialties', async ({page}) => {
    const pm = new PageManager(page)
    await pm.onVeterinariansPage().clickEditButtonForVet('Linda Douglas')
    await pm.onEditVeterinarianPage().checkVetSpecialityIs('dentistry, surgery')
    await pm.onEditVeterinarianPage().setAllSpecialitiesCheckboxesInSpecialitiesDropdownTo(false)
    await expect(page.locator('.selected-specialties')).toBeEmpty() 
  });
})