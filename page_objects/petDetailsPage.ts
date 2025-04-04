import { Page, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class PetDetailsPage extends HelperBase{
    constructor(page: Page){
        super(page)
    }

    /**
     * Validates pet details on Edit pet page
     * @param petOwner - pet owner, selected for test
     * @param petType - initial pet type for selected pet
     */
    async validatePetOwnerAndPetTypeAre(petOwner: string, petType: string){
        
        await expect(this.page.getByRole('heading')).toHaveText('Pet')
        await expect(this.page.locator('#owner_name')).toHaveValue(petOwner)
        const petTypeField = this.page.locator('#type1');
        await expect(petTypeField).toHaveValue(petType)
    }

    /**
     * Selects all options in dropdown menu one-by-one and verifies that selected options are displayed in the Type field
     */
    async selectSequentiallyAllOptionsFromDropdownAndVerifyOptionDisplayInTypeField(){
        for (let petType of await this.page.locator("#type option").allInnerTexts()) {
            await this.page.locator("#type").selectOption(petType);
            await expect(this.page.locator('#type1')).toHaveValue(petType);
            }
    }


    /**
     * Selects new pet type option for selected pet
     * @param newOption - select any option from the dropdown list, except of the initial option.
     */
    async updatePetTypeTo(newOption: string){
        const petTypeField = this.page.locator('#type1')
        const petTypeDropdownMenu = this.page.locator('#type')
        await petTypeDropdownMenu.selectOption(newOption)
        await expect(petTypeField).toHaveValue(newOption)
        await expect(petTypeDropdownMenu).toHaveValue(newOption)
        await this.page.getByRole('button', {name:"Update Pet"}).click()
    }
     
}

