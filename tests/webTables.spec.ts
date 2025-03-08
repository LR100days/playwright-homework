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
            await pm.onOwnersPage().searchByOwnerNameAndValidateSearchResult('Black')
            await pm.onOwnersPage().searchByOwnerNameAndValidateSearchResult('Davis')
            await pm.onOwnersPage().searchByOwnerNameAndValidateSearchResult('Es')
            await pm.onOwnersPage().searchByOwnerNameAndValidateSearchResult('Playwright')
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
    await pm.onVeterinariansPage().validateVetSpecialityInVetTable("Rafael Ortega","surgery" )
    await pm.navigateTo().specialitiesPage()

// Edit speciality from 'surgery' to 'dermatology' in the list of specialties
    await pm.onSpecialitiesPage().selectEditSpecialityInSpecialitiesTableByRowIndex(2)
    await pm.onEditSpecialityPage().enterNewSpecialityName('dermatology')
    await pm.onEditSpecialityPage().confirmSpecialityUpdate()

// Verify that speciality is updated in the Speciality list and for the target Veterinarian
    await pm.onSpecialitiesPage().validateSpecialityValueInSpecialitiesTableByRowIndex(2,"dermatology")

    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateVetSpecialityInVetTable("Rafael Ortega","dermatology")

// Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"
    await pm.navigateTo().specialitiesPage()
    await pm.onSpecialitiesPage().selectEditSpecialityInSpecialitiesTableByRowIndex(2)
    await pm.onEditSpecialityPage().enterNewSpecialityName('surgery')
    await pm.onEditSpecialityPage().confirmSpecialityUpdate()
    await pm.onSpecialitiesPage().validateSpecialityValueInSpecialitiesTableByRowIndex(2,'surgery')

    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateVetSpecialityInVetTable("Rafael Ortega","surgery" )

})

test('Validate specialty lists', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().specialitiesPage()
    await pm.onSpecialitiesPage().addNewSpeciality('oncology')

    let allSpecialities = await pm.onSpecialitiesPage().createListOfAllSpecialitiesThatAreShownInTable()

// Edit speciality for target veterinarian sharonJenkins
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().clickEditButtonForVet("Sharon Jenkins")
  
    let dropdownSpecialitiesOptions = await pm.onSpecialitiesPage().createListOfAllSpecialitiesInDropdownOptions()
    expect(dropdownSpecialitiesOptions).toEqual(allSpecialities)
   
    await pm.onEditVeterinarianPage().inSpecialitiesDropdownSelectSpecialityCheckbox('oncology')
    await pm.onEditVeterinarianPage().clickSaveVetDetails()

// Check updated speciality for target Vet
    await pm.onVeterinariansPage().validateVetSpecialityInVetTable("Sharon Jenkins","oncology" )

// Delete newly added speciality from the Specialitis list and verify that deleted speciality is also removed for targetVet 
    await pm.navigateTo().specialitiesPage()
    await pm.onSpecialitiesPage().deleteSpecialityByName('oncology')
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateVetSpecialityInVetTable("Sharon Jenkins","empty" )

})