import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test.describe("Owners table practice", async () => {
    test.beforeEach( async({page}) => {
        const pm = new PageManager(page)
        await pm.navigateTo().ownersPage()
      })

        test('Validate the pet name city of the owner', async ({page}) => {
            const pm = new PageManager(page)
            await pm.onOwnersPage().validateCityAndPetNameOfOwner("Jeff Black",'Monona', ' Lucky ')
        })

        test('Validate owners count of the Madison city', async ({page}) => {
            const pm = new PageManager(page)
            const numberOfOwnersInTheCity = await pm.onOwnersPage().countOwnersOfCity('Madison')
            await expect(numberOfOwnersInTheCity).toHaveCount(4);
        })

        test('Validate search by Last Name', async ({page}) => {
            const pm = new PageManager(page)
            await pm.onOwnersPage().searchByOwnerName('Black')
            await pm.onOwnersPage().searchByOwnerName('Davis')
            await pm.onOwnersPage().searchByOwnerName('Es')
            await pm.onOwnersPage().searchByOwnerName('Playwright')
        })

        test('Validate phone number and pet name on the Owner Information page', async ({page}) => {
            const pm = new PageManager(page)
            const petName = await pm.onOwnersPage().findPetNameByOwnerPhoneNumber('6085552765')
            await pm.onOwnerInformationPage().validateOwnerPhoneNumberAndPetNameAre('6085552765', petName!)
        })

        test('Validate pets of the Madison city', async ({page}) => {
            const pm = new PageManager(page)
            const selectedCityRows = await pm.onOwnersPage().countOwnersOfCity('Madison')
            await expect(selectedCityRows).toHaveCount(4);
            const petsInSelectedCity = await pm.onOwnersPage().petNamesOfSelectedCity(selectedCityRows)
            expect(petsInSelectedCity).toEqual(['Leo', 'George', 'Mulligan', 'Freddy'])
        })

})

test('Validate specialty update', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().veterinariansPage()

// Verify initial target Veterinarian speciality
    const rafaelOrtegaRow = page.getByRole('row', {name:"Rafael Ortega"})
    const rafaelOrtegaSpecialtyColumn = rafaelOrtegaRow.locator('td').nth(1)
    await expect(rafaelOrtegaSpecialtyColumn).toHaveText("surgery")

    await pm.navigateTo().specialitiesPage()

// Edit speciality from 'surgery' to 'dermatology' in the list of specialties
    const secondSpecialtyRow = page.getByRole('row').nth(2)
    await secondSpecialtyRow.getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Specialty')

    await pm.onMainSpecialitiesPage().editMainSpecialityTo('dermatology')

    await page.getByRole('button', { name: 'Update' }).click()

// Verify that speciality is updated in the Speciality list and for the target Veterinarian

    await expect(secondSpecialtyRow.locator('td input')).toHaveValue('dermatology');

    await pm.navigateTo().veterinariansPage()
    await expect(rafaelOrtegaSpecialtyColumn).toHaveText("dermatology")
    
// Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"
    await pm.navigateTo().specialitiesPage()
    await secondSpecialtyRow.getByRole('button', { name: 'Edit' }).click()
  
    await pm.onMainSpecialitiesPage().editMainSpecialityTo('surgery')

    await page.getByRole('button', { name: 'Update' }).click()
    await expect(secondSpecialtyRow.locator('td input')).toHaveValue('surgery');

    await pm.navigateTo().veterinariansPage()
    await expect(rafaelOrtegaSpecialtyColumn).toHaveText("surgery")

})

test('Validate specialty lists', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().specialitiesPage()
    await pm.onMainSpecialitiesPage().addNewMainSpeciality('oncology')
    await page.getByRole('button', {name:"Save"}).click();
    await page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/specialties')

    let allSpecialities = await pm.onMainSpecialitiesPage().createListOfAllMainSpecialitiesTable()

// Edit speciality for target veterinarian sharonJenkins
    await pm.navigateTo().veterinariansPage()
   
    const sharonJenkinsRow = page.getByRole('row', {name:"Sharon Jenkins"})
    await sharonJenkinsRow.getByRole('button', {name:"Edit"}).click();
  
    let dropdownSpecialitiesOptions = await pm.onMainSpecialitiesPage().createListOfAllMainSpecialitiesInDropdownOptions()
    expect(dropdownSpecialitiesOptions).toEqual(allSpecialities)
   
    await pm.onVeterinariansPage().inSpecialitiesDropdownSelectSpecialityCheckbox('oncology')
    await page.getByRole('button', {name:"Save Vet"}).click();

// Check updated speciality for target Vet
    const specialitysharonJenkins = sharonJenkinsRow.locator('td').nth(1)
    await expect(specialitysharonJenkins).toHaveText('oncology')

// Delete newly added speciality from the Specialitis list and verify that deleted speciality is also removed for targetVet 
    await pm.navigateTo().specialitiesPage()
    await page.getByRole('row', {name: 'oncology'}).getByRole('button', {name:"Delete"}).click()
    await pm.navigateTo().veterinariansPage()

    await expect(specialitysharonJenkins).toBeEmpty()

})