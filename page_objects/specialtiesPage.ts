import { Page, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class SpecialtiesPage extends HelperBase{
    constructor(page: Page){
        super(page)
    }

    async deleteSpecialtyByName(specialty: string){
        await this.page.getByRole('row', {name: specialty}).getByRole('button', {name:"Delete"}).click()
        
    }

    async addNewSpecialty(newSpecialty: string){
        await this.page.getByRole('button', {name:"Add"}).click();
        const addSpecialtyField = this.page.getByRole('textbox').last()
        await addSpecialtyField.click()
        await addSpecialtyField.fill(newSpecialty)
        await this.page.getByRole('button', {name:"Save"}).click();
        await this.page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/specialties')
    }
    /**
     * Extrats all specialties text from Specialties table.
     * @returns a list of strings with specialty names from Specialties table.
     */
    async getListOfAllSpecialtiesThatAreShownInTable(){
        const allRows = this.page.getByRole('row').filter({has: this.page.getByRole('button', {name:"Edit"})})
        let allSpecialtiesList: string[] = [];

        for(let row of await allRows.all()){
            let spec = await row.locator('td input').inputValue()
            allSpecialtiesList.push(spec)
        }
        return allSpecialtiesList
    }

    async selectEditSpecialtyInSpecialtiesTableByRowIndex(rowIndex: number){
        const selectedSpecialtyRow = this.page.getByRole('row').nth(rowIndex)
        await selectedSpecialtyRow.getByRole('button', { name: 'Edit' }).click()
        await expect(this.page.getByRole('heading')).toHaveText('Edit Specialty')
    }

    async validateSpecialtyValueInSpecialtiesTableByRowIndex(rowIndex: number, expectedSpecialty: string){
        const selectedSpecialtyRow = this.page.getByRole('row').nth(rowIndex)
        await expect(selectedSpecialtyRow.locator('td input')).toHaveValue(expectedSpecialty);
    }

    async validateLastAddedSpecialtyInTableByName(specialtyName: string) {
        await expect(this.page.getByRole('textbox').last()).toHaveValue(specialtyName)
    }

    async validateLastAddedSpecialtyInTableIsDeletedByName(specialtyName: string) {
        await expect(this.page.getByRole('textbox').last()).not.toHaveValue(specialtyName)
    }

   
}

