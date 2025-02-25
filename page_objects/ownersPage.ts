import { Page, expect } from '@playwright/test';

export class OwnersPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    async selectOwnerFromOwnersTable(ownerName: string){
        await this.page.getByRole('link', {name: ownerName }).click();
        await expect(this.page.locator(".ownerFullName")).toHaveText(ownerName)
    }

}