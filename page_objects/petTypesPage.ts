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
     * @param petName : should be string.
     */
    async addNewPetType(petName: string){
        const nameInputField = this.page.locator('#name');
        await expect(nameInputField).toBeVisible();
    
        await nameInputField.fill(petName);
        await this.page.getByRole('button', {name:"Save"}).click();
    }

    async deleteThePreviouslyCreatedPetType(){
        this.page.on('dialog', dialog => {
            expect(dialog.message()).toEqual("Delete the pet type?")
            dialog.accept()
            }) 
        await this.page.locator('tr td').last().getByRole('button', {name:"Delete"}).click();
    }
}