import { Page, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class VeterinariansPage extends HelperBase{
    constructor(page: Page){
        super(page)
    }

    async clickEditButtonForVet(vetName: string){
        await this.page.locator('tr', {hasText: vetName}).getByRole('button',{name: "Edit Vet"}).click();
    }

    async validateVetSpecialtyInVetTable(vetName: string, expectedVetSpecialty: string ){
        const specialtyForSelectedVet = this.page.getByRole('row', {name:vetName}).locator('td').nth(1)
        if (expectedVetSpecialty == 'empty'){
            await expect(specialtyForSelectedVet).toBeEmpty()
        }
        else{
            await expect(specialtyForSelectedVet).toHaveText(expectedVetSpecialty)
        }
    }

    async validateNumberOfSpecialtiesByVetName(vetName: string, expectedSpecialtiesNumber: number ){
        const specialtyForSelectedVet = this.page.getByRole('row', {name:vetName}).locator('td div')
            await expect(specialtyForSelectedVet).toHaveCount(expectedSpecialtiesNumber)
    }
}

