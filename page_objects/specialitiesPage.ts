import { Page, expect } from '@playwright/test';

export class SpecialitiesPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    /**
     * This method updates speciality, availiable in the main Specialities list
     * @param speciality - expected speciality
     */
    async editMainSpecialityTo(speciality: string){
        const specialityInputField = this.page.getByRole('textbox')
        await specialityInputField.click()
        await specialityInputField.clear()
        await specialityInputField.fill(speciality)
    }

    async addNewMainSpeciality(newSpeciality: string){
        await this.page.getByRole('button', {name:"Add"}).click();
        const addSpecialityField = this.page.getByRole('textbox').last()
        await addSpecialityField.click()
        await addSpecialityField.fill(newSpeciality)
    }
    /**
     * Extrats all specialities text from Specialities table.
     * @returns a list of strings with speciality names from Specialities table.
     */
    async createListOfAllMainSpecialitiesTable(){
        const allRows = this.page.getByRole('row').filter({has: this.page.getByRole('button', {name:"Edit"})})
        let allMainSpecialitiesList: string[] = [];

        for(let row of await allRows.all()){
            let spec = await row.locator('td input').inputValue()
            allMainSpecialitiesList.push(spec)
        }
        return allMainSpecialitiesList
    }

    /**
     * Extrats all specialities options text from Specialities dropdown.
     * @returns a list of strings with speciality names from Specialities dropdown.
     */
    async createListOfAllMainSpecialitiesInDropdownOptions(){
        await this.page.locator('.dropdown-display').click()

        const dropdownOptions = this.page.locator('.dropdown-content div label')
        let specialitiesOptionsInDropdown: string[] = []

        for(let option of await dropdownOptions.all()){
            let optionValue = await option.innerText()
            specialitiesOptionsInDropdown.push(optionValue)
        }
        return specialitiesOptionsInDropdown
    }
}

