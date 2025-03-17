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

// Verify initial target Veterinarian specialty
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable("Rafael Ortega","surgery" )
    await pm.navigateTo().specialtiesPage()

// Edit specialty from 'surgery' to 'dermatology' in the list of specialties
    await pm.onSpecialtiesPage().selectEditSpecialtyInSpecialtiesTableByRowIndex(2)
    await pm.onEditSpecialtyPage().enterNewSpecialtyName('dermatology')
    await pm.onEditSpecialtyPage().confirmSpecialtyUpdate()

// Verify that specialty is updated in the Specialty list and for the target Veterinarian
    await pm.onSpecialtiesPage().validateSpecialtyValueInSpecialtiesTableByRowIndex(2,"dermatology")

    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable("Rafael Ortega","dermatology")

// Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().selectEditSpecialtyInSpecialtiesTableByRowIndex(2)
    await pm.onEditSpecialtyPage().enterNewSpecialtyName('surgery')
    await pm.onEditSpecialtyPage().confirmSpecialtyUpdate()
    await pm.onSpecialtiesPage().validateSpecialtyValueInSpecialtiesTableByRowIndex(2,'surgery')

    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable("Rafael Ortega","surgery" )

})

test('Validate specialty lists', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().specialtiesPage()

    const randomSpecialty = await pm.onSpecialtiesPage().generateRandomSpecialty()
    await pm.onSpecialtiesPage().addNewSpecialty(randomSpecialty)

    let allSpecialties = await pm.onSpecialtiesPage().getListOfAllSpecialtiesThatAreShownInTable()

// Edit specialty for target veterinarian sharonJenkins
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().clickEditButtonForVet("Sharon Jenkins")
  
    let dropdownSpecialtiesOptions = await pm.onEditVeterinarianPage().getListOfAllSpecialtiesInDropdownOptions()
    expect(dropdownSpecialtiesOptions).toEqual(allSpecialties)
   
    await pm.onEditVeterinarianPage().inSpecialtiesDropdownSelectSpecialtyCheckbox(randomSpecialty)
    await pm.onEditVeterinarianPage().clickSaveVetDetails()

// Check updated specialty for target Vet
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable("Sharon Jenkins",randomSpecialty )

// Delete newly added specialty from the Specialitis list and verify that deleted specialty is also removed for targetVet 
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().deleteSpecialtyByName(randomSpecialty)
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable("Sharon Jenkins","empty" )

})