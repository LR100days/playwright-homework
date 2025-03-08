import { Page, expect } from '@playwright/test';

export class EditSpecialityPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

     /**
     * This method updates speciality, availiable in the Specialities list
     * @param speciality - expected speciality
     */
     async enterNewSpecialityName(speciality: string){
        const specialityInputField = this.page.getByRole('textbox')
        await specialityInputField.click()
        await specialityInputField.clear()
        await specialityInputField.fill(speciality)
    }

    async confirmSpecialityUpdate(){
        await this.page.getByRole('button', { name: 'Update' }).click()
    }

}