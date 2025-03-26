import { Page, expect } from '@playwright/test';

export class EditPetTypePage{
    readonly page: Page
    constructor(page: Page){
        this.page = page
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

    async confirmPetTypeNameUpdating(){
        await this.page.getByRole('button', {name:"Update"}).click();
        await this.page.waitForURL('/pettypes')
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

}