import { Page, expect } from '@playwright/test';

export class VeterinariansPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    /**
     * This method checks the initial speciality, selected for given veterinar
     * @param specialityName - expected speciality
     */
    async checkVetSpecialityIs(specialityName: string){
     const specialtiesDropdown = this.page.locator('.selected-specialties')
     await expect(specialtiesDropdown).toHaveText(specialityName);
     if (await this.page.locator(".dropdown-display").locator('..').getAttribute('class') !== 'dropdown show')
        await specialtiesDropdown.click();
    }

    /**
     * Selects or Unselects all vet specialties checkboxes from the Specialities dropdown list and verifies checkboxes state
     * @param checkboxesState - should be boolean (true or false)
     */
    async setAllSpecialitiesCheckboxesInSpecialitiesDropdownTo(checkboxesState: boolean){
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

    async inSpecialitiesDropdownSelectSpecialityCheckbox(checkboxOption: string){
        await this.page.getByRole('checkbox', {name: checkboxOption}).check()
        expect(await this.page.getByRole('checkbox', {name: checkboxOption}).isChecked()).toBeTruthy()
        await this.page.locator('.dropdown-display').click() // to close the dropdown
    } 

    async clickEditButtonForVet(vetName: string){
        await this.page.locator('tr', {hasText: vetName}).getByRole('button',{name: "Edit Vet"}).click();
    }

    async validateVetSpecialityInVetTable(vetName: string, expectedVetSpeciality: string ){
        const specialtyForSelectedVet = this.page.getByRole('row', {name:vetName}).locator('td').nth(1)
        if (expectedVetSpeciality == 'empty'){
            await expect(specialtyForSelectedVet).toBeEmpty()
        }
        else{
            await expect(specialtyForSelectedVet).toHaveText(expectedVetSpeciality)
        }
    }
    async clickSaveVetDetails(){
        await this.page.getByRole('button', {name:"Save Vet"}).click();
    }
}

