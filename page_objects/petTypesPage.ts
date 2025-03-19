import { Page, expect } from '@playwright/test';
import { HelperBase } from '../page_objects/helperBase';

export class PetTypesPage extends HelperBase{
    constructor(page: Page){
        super(page)
    }

    async clickAddButtonToOpenPetTypeInputForm(){
        await this.page.getByRole('button', {name:" Add "}).click();
        await expect(this.page.getByRole('heading').last()).toHaveText('New Pet Type');
        await expect(this.page.locator('.control-label')).toHaveText('Name');
    }
    /**
     * Saves new pet type
     * @param petName : desired pet type to be added.
     */
    async addNewPetType(petName: string){
        const nameInputField = this.page.locator('#name');
        await expect(nameInputField).toBeVisible();
    
        await nameInputField.fill(petName);
        await this.page.getByRole('button', {name:"Save"}).click();
    }

    async deleteTheLastPetTypeInThePetsTable(){
        this.page.on('dialog', dialog => {
            expect(dialog.message()).toEqual("Delete the pet type?")
            dialog.accept()
            }) 
        await this.page.locator('tr td').last().getByRole('button', {name:"Delete"}).click();
        
    }

    /**
     * Opens Edit Pet Type page
     * @param petType - pet type name that needs to be changed to new value.
     */
    async clickEditbuttonForPetType(petType: string){
        await this.page.getByRole('row', { name: petType }).getByRole('button', {name: 'Edit'}).click();
        await expect(this.page.getByRole('heading')).toHaveText('Edit Pet Type');
    }

    async validateLastRowPetType(petType: string){
        const lastRowInTable = this.page.locator('tr td input').last();
        await expect(lastRowInTable).toHaveValue(petType);
        return lastRowInTable
    }

    async validatePetTypeValueByRowIndex(rowIndex: string, petType: string){
        await expect(this.page.locator(`[id="${rowIndex}"]`)).toHaveValue(petType);
    }

}