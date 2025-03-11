import { Page, expect } from '@playwright/test';

export class SpecialitiesPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    async deleteSpecialityByName(speciality: string){
        await this.page.getByRole('row', {name: speciality}).getByRole('button', {name:"Delete"}).click()
        
    }

    async addNewSpeciality(newSpeciality: string){
        await this.page.getByRole('button', {name:"Add"}).click();
        const addSpecialityField = this.page.getByRole('textbox').last()
        await addSpecialityField.click()
        await addSpecialityField.fill(newSpeciality)
        await this.page.getByRole('button', {name:"Save"}).click();
        await this.page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/specialties')
    }
    /**
     * Extrats all specialities text from Specialities table.
     * @returns a list of strings with speciality names from Specialities table.
     */
    async createListOfAllSpecialitiesThatAreShownInTable(){
        const allRows = this.page.getByRole('row').filter({has: this.page.getByRole('button', {name:"Edit"})})
        let allSpecialitiesList: string[] = [];

        for(let row of await allRows.all()){
            let spec = await row.locator('td input').inputValue()
            allSpecialitiesList.push(spec)
        }
        return allSpecialitiesList
    }

    /**
     * Extrats all specialities options text from Specialities dropdown.
     * @returns a list of strings with speciality names from Specialities dropdown.
     */
    async createListOfAllSpecialitiesInDropdownOptions(){
        await this.page.locator('.dropdown-display').click()

        const dropdownOptions = this.page.locator('.dropdown-content div label')
        let specialitiesOptionsInDropdown: string[] = []

        for(let option of await dropdownOptions.all()){
            let optionValue = await option.innerText()
            specialitiesOptionsInDropdown.push(optionValue)
        }
        return specialitiesOptionsInDropdown
    }

    async selectEditSpecialityInSpecialitiesTableByRowIndex(rowIndex: number){
        const selectedSpecialtyRow = this.page.getByRole('row').nth(rowIndex)
        await selectedSpecialtyRow.getByRole('button', { name: 'Edit' }).click()
        await expect(this.page.getByRole('heading')).toHaveText('Edit Specialty')
    }

    async validateSpecialityValueInSpecialitiesTableByRowIndex(rowIndex: number, expectedSpeciality: string){
        const selectedSpecialtyRow = this.page.getByRole('row').nth(rowIndex)
        await expect(selectedSpecialtyRow.locator('td input')).toHaveValue(expectedSpeciality);
    }

    async validateLastAddedSpecialtyInTableByName(specialtyName: string) {
        await expect(this.page.getByRole('textbox').last()).toHaveValue(specialtyName)
    }

    async validateLastAddedSpecialtyInTableIsDeletedByName(specialtyName: string) {
        await expect(this.page.getByRole('textbox').last()).not.toHaveValue(specialtyName)
    }

   
}

