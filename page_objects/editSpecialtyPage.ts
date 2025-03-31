import { Page } from '@playwright/test';
import { HelperBase } from './helperBase';

export class EditSpecialtyPage extends HelperBase{
    constructor(page: Page){
        super(page)
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