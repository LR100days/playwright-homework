import { Page, expect } from '@playwright/test';

export class VeterinariansPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    async clickEditButtonForVet(vetName: string){
        await this.page.locator('tr', {hasText: vetName}).getByRole('button',{name: "Edit Vet"}).click();
    }

    async validateVetSpecialityInVetTable(vetName: string, expectedVetSpeciality: string ){
        const specialtyForSelectedVet = this.page.getByRole('row', {name:vetName}).locator('td').nth(1)
        if (expectedVetSpeciality == 'empty'){
            await expect(specialtyForSelectedVet).toBeEmpty()
        }
        else{
            await expect(specialtyForSelectedVet).toHaveText(expectedVetSpeciality)
        }
    }
}

