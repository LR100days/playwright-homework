import { Page, expect } from '@playwright/test';

export class OwnersPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    async selectOwnerFromOwnersTableByName(ownerName: string){
        await this.page.getByRole('link', {name: ownerName }).click();
        await this.page.waitForResponse('**/api/owners/*')
        await expect(this.page.locator(".ownerFullName")).toHaveText(ownerName)
    }

    async searchByOwnerName(ownerName: string){
        const lastNameInputField = this.page.getByRole('textbox')
        await lastNameInputField.clear();
        await lastNameInputField.fill(ownerName);
        await this.page.getByRole('button', {name: 'Find Owner'}).click()
    
        if(ownerName == 'Playwright'){
            await expect(this.page.locator('.xd-container div').last()).toHaveText('No owners with LastName starting with "Playwright"')
        } 
        else {
            await this.page.waitForResponse(`https://petclinic-api.bondaracademy.com/petclinic/api/owners?lastName=${ownerName}`);
            await expect(this.page.getByRole('row').locator('td').first()).toContainText(ownerName)
        }
        
    }

}