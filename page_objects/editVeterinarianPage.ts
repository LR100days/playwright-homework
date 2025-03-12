import { Page, expect } from '@playwright/test';

export class EditVeterinarianPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    /**
         * This method checks the initial specialty, selected for given veterinar
         * @param specialtyName - expected specialty
         */
    async checkVetSpecialtyIs(specialtyName: string){
        const specialtiesDropdown = this.page.locator('.selected-specialties')
        await expect(specialtiesDropdown).toHaveText(specialtyName);
        if (await this.page.locator(".dropdown-display").locator('..').getAttribute('class') !== 'dropdown show')
        await specialtiesDropdown.click();
    }

    /**
        * Selects or Unselects all vet specialties checkboxes from the Specialties dropdown list and verifies checkboxes state
        * @param checkboxesState - should be boolean (true or false)
        */
    async setAllSpecialtiesCheckboxesInSpecialtiesDropdownTo(checkboxesState: boolean){
        const allBoxes = this.page.getByRole('checkbox')
        for(const box of await allBoxes.all()){
            if (checkboxesState){
                await box.check({force:true})
                expect(await box.isChecked()).toBeTruthy()}
            else{
                await box.uncheck({force:true})
                expect(await box.isChecked()).toBeFalsy()
            }     
        }
    }

    async inSpecialtiesDropdownSelectSpecialtyCheckbox(checkboxOption: string){
        if(!await this.page.getByRole('checkbox', {name: checkboxOption}).isVisible()){
            await this.page.locator('.dropdown-display').click() // to open the dropdown
        }
        
        await this.page.getByRole('checkbox', {name: checkboxOption}).check()
        expect(await this.page.getByRole('checkbox', {name: checkboxOption}).isChecked()).toBeTruthy()
        await this.page.locator('.dropdown-display').click() // to close the dropdown
    } 

    async clickSaveVetDetails(){
        await this.page.getByRole('button', {name:"Save Vet"}).click();
    }

    /**
     * Extrats all specialties options text from Specialties dropdown.
     * @returns a list of strings with specialty names from Specialties dropdown.
     */
    async createListOfAllSpecialtiesInDropdownOptions(){
        await this.page.locator('.dropdown-display').click()

        const dropdownOptions = this.page.locator('.dropdown-content div label')
        let specialtiesOptionsInDropdown: string[] = []

        for(let option of await dropdownOptions.all()){
            let optionValue = await option.innerText()
            specialtiesOptionsInDropdown.push(optionValue)
        }
        return specialtiesOptionsInDropdown
    }
}

