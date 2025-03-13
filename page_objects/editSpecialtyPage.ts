import { Page, expect } from '@playwright/test';

export class EditSpecialtyPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

     /**
     * This method updates specialty, availiable in the Specialties list
     * @param specialty - expected specialty
     */
     async enterNewSpecialtyName(specialty: string){
        const specialtyInputField = this.page.getByRole('textbox')
        await specialtyInputField.click()
        await specialtyInputField.clear()
        await specialtyInputField.fill(specialty)
    }

    async confirmSpecialtyUpdate(){
        await this.page.getByRole('button', { name: 'Update' }).click()
    }

}