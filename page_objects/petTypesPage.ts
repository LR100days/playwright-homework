import { Page, expect } from '@playwright/test';

export class PetTypesPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
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
    
    /**
     * Clears Name input field and enters a new desired pet type value.
     * @param newPetType - desired Pet Type Value to be saved
     */
    async enterNewPetTypeName(newPetType: string){
        await this.clearNameField()
        const nameField = this.page.locator('#name');
        await nameField.click()
        await nameField.fill(newPetType);
    }

    async clearNameField(){
        const nameField = this.page.locator('#name');
        await nameField.click();
        await nameField.clear();
    }

    async validateLastRowPetType(petType: string){
        const lastRowInTable = this.page.locator('tr td input').last();
        await expect(lastRowInTable).toHaveValue(petType);
        return lastRowInTable
    }

    async validatePetTypeValueByRowIndex(rowIndex: string, petType: string){
        await expect(this.page.locator(`[id="${rowIndex}"]`)).toHaveValue(petType);
    }

    async clickCancelButtonForPetTypeUpdating(){
        await this.page.getByRole('button', {name:"Cancel"}).click()
    }

    async verifyValidationMessageForEmptyPetTypeNameFieldIs(message: string){
        await expect(this.page.locator('.help-block')).toHaveText(message);
    }

    async verifyPageHeadingIs(heading: string){
        await expect(this.page.getByRole('heading')).toHaveText(heading)
    }

    async confirmPetTypeNameUpdating(){
        await this.page.getByRole('button', {name:"Update"}).click();
    }

}