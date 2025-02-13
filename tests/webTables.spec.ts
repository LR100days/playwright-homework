import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test.describe("Owners table practice", async () => {
    test.beforeEach( async({page}) => {
        await page.getByRole('button', {name:"Owners"}).click();
        await page.getByRole('link', {name:"Search"}).click();
      })

        test('Validate the pet name city of the owner', async ({page}) => {
            const targetOwnerRow = page.getByRole('row', {name: "Jeff Black"})
            expect(await targetOwnerRow.locator("td").nth(2).textContent()).toEqual('Monona');
            expect(await targetOwnerRow.locator("td").last().textContent()).toEqual(' Lucky ');
        })

        test('Validate owners count of the Madison city', async ({page}) => {
            await expect(page.locator("tbody tr").filter({ hasText: "Madison" })).toHaveCount(4);
        
        })

        test('Validate search by Last Name', async ({page}) => {
            const lastNameInputField = page.getByRole('textbox')
            const lastNamesForTest = ['Black', 'Davis', 'Es', 'Playwright']

            for(let lastname of lastNamesForTest){
                await lastNameInputField.clear();
                await lastNameInputField.fill(lastname);
                await page.getByRole('button', {name: 'Find Owner'}).click()
            
                if(lastname == 'Playwright'){
                    await expect(page.locator('.xd-container div').last()).toHaveText('No owners with LastName starting with "Playwright"')
                } else {
                    await page.waitForResponse(`https://petclinic-api.bondaracademy.com/petclinic/api/owners?lastName=${lastname}`);
                    await expect(page.getByRole('row').locator('td').first()).toContainText(lastname)
                }
            } 
        })

        test('Validate phone number and pet name on the Owner Information page', async ({page}) => {
            const ownerForTest = page.getByRole('row', {name: "6085552765"})
            const petName = await ownerForTest.locator('td').last().textContent()
            
            await ownerForTest.getByRole('link').click()
            await expect(page.getByRole('row', {name: "Telephone"})).toContainText('6085552765')
            await expect(page.getByRole('table').locator("dd").first()).toHaveText(petName)
        })

        test('Validate pets of the Madison city', async ({page}) => {
            const madisonCityRows = page.locator("tbody tr").filter({hasText: "Madison"})
            await expect(madisonCityRows).toHaveCount(4);
            let pets: string[] = [];

            for(let row of await madisonCityRows.all()){
                let petName = await row.locator('td').last().innerText()
                pets.push(petName.trim())
            }
            
            expect(pets).toEqual(['Leo', 'George', 'Mulligan', 'Freddy'])
        })

})

test('Validate specialty update', async ({page}) => {
    await page.getByRole('button', {name:"Veterinarians"}).click();
    await page.getByRole('link', {name:"All"}).click();

// Verify initial target Veterinarian speciality
    const targetRow = page.getByRole('row', {name:"Rafael Ortega"})
    const targetSpeciality = targetRow.locator('td').nth(1)
    await expect(targetSpeciality).toHaveText("surgery")

// Navigate to the Specialties list
    await page.getByRole('link', {name:'Specialties'}).click()
    await expect(page.getByRole('heading')).toHaveText('Specialties')

// Edit speciality from 'surgery' to 'dermatology' in the list of specialties
    const targetSpecialityRow = page.getByRole('row').nth(2)
    await targetSpecialityRow.getByRole('button', { name: 'Edit' }).click()

    await expect(page.getByRole('heading')).toHaveText('Edit Specialty')

    const specialityInputField = page.getByRole('textbox')
    await specialityInputField.click()
    await specialityInputField.clear()
    await specialityInputField.fill('dermatology')
    await page.getByRole('button', { name: 'Update' }).click()

// Verify that speciality is updated in the Speciality list and for the target Veterinarian

    expect(await targetSpecialityRow.locator('td input').inputValue()).toEqual('dermatology')

    await page.getByRole('button', {name:"Veterinarians"}).click();
    await page.getByRole('link', {name:"All"}).click();

    await expect(targetSpeciality).toHaveText("dermatology")
    
// Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"
    await page.getByRole('link', {name:'Specialties'}).click()
    await expect(page.getByRole('heading')).toHaveText('Specialties')

    await targetSpecialityRow.getByRole('button', { name: 'Edit' }).click()
    await specialityInputField.click()
    await specialityInputField.clear()
    await specialityInputField.fill('surgery')
    await page.getByRole('button', { name: 'Update' }).click()

    expect(await targetSpecialityRow.locator('td input').inputValue()).toEqual('surgery')

    await page.getByRole('button', {name:"Veterinarians"}).click();
    await page.getByRole('link', {name:"All"}).click();

    await expect(targetSpeciality).toHaveText("surgery")

})

test('Validate specialty lists', async ({page}) => {
    await page.getByRole('link', {name:"Specialties"}).click();
    await page.getByRole('button', {name:"Add"}).click();

    const addSpecialityField = page.getByRole('textbox').last()
    await addSpecialityField.click()
    await addSpecialityField.fill('oncology')
    await page.getByRole('button', {name:"Save"}).click();

    await page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/specialties')

// Extract all specialities in the list
    const allRows = page.getByRole('row').filter({has: page.getByRole('button', {name:"Edit"})})
    let allSpecialities: string[] = [];

    for(let row of await allRows.all()){
        let spec = await row.locator('td input').inputValue()
        allSpecialities.push(spec)
    }

// Edit speciality for target veterinarian (targetVet)
    await page.getByRole('button', {name:"Veterinarians"}).click();
    await page.getByRole('link', {name:"All"}).click();
   
    const targetVetRow = page.getByRole('row', {name:"Sharon Jenkins"})
    await targetVetRow.getByRole('button', {name:"Edit"}).click();
  
    await page.locator('.dropdown-display').click()

    const dropdownOptions = page.locator('.dropdown-content div label')
    let specialitiesOptions: string[] = []

    for(let option of await dropdownOptions.all()){
        let optionValue = await option.innerText()
        specialitiesOptions.push(optionValue)
    }
    
    expect(specialitiesOptions).toEqual(allSpecialities)
   
    await page.getByRole('checkbox', {name: 'oncology'}).check()
    expect(await page.getByRole('checkbox', {name: 'oncology'}).isChecked()).toBeTruthy
    await page.locator('.dropdown-display').click() // to close the dropdown
    await page.getByRole('button', {name:"Save Vet"}).click();

// Check updated speciality for target Vet
    const specialitysharonJenkins = targetVetRow.locator('td').nth(1)
    await expect(specialitysharonJenkins).toHaveText('oncology')

// Delete newly added speciality from the Specialitis list and verify that deleted speciality is also removed for targetVet 
    await page.getByRole('link', {name:"Specialties"}).click();
    await page.getByRole('row', {name: 'oncology'}).getByRole('button', {name:"Delete"}).click()
    await page.getByRole('button', {name:"Veterinarians"}).click();
    await page.getByRole('link', {name:"All"}).click();

    await expect(specialitysharonJenkins).toBeEmpty()

})