
import { Page, expect } from '@playwright/test';

export class OwnerInformationPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    /**
     * Verifies that newly selected pet type is shown on owner details page
     * @param expectedPetType - newly selected pet type
     */
    async validateRosyPetTypeOnOwnerInfoPageToBe(expectedPetType: string){
        const rosyPetTypeOnOwnerInfoPage = this.page.locator(".dl-horizontal", { hasText: "Rosy" }).locator('dd').last()
        await expect(rosyPetTypeOnOwnerInfoPage).toHaveText(expectedPetType)
    }
}