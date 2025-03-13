import { Page, expect } from '@playwright/test';

export class OwnersPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    async selectOwnerFromOwnersTableByName(ownerName: string){
        await this.page.getByRole('link', {name: ownerName }).click();
        await expect(this.page.locator(".ownerFullName")).toHaveText(ownerName)
        await expect(this.page.getByRole("heading").first()).toHaveText('Owner Information')
    }

    async searchByOwnerNameAndValidateSearchResult(ownerName: string){
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

    async validateCityAndPetNameOfOwner(ownerName: string, ownerCityName: string, petName: string){
        const ownerRow = this.page.getByRole('row', {name: ownerName})
        expect(await ownerRow.locator("td").nth(2).textContent()).toEqual(ownerCityName);
        expect(await ownerRow.locator("td").last().textContent()).toEqual(petName);
    }

    async countOwnersOfCity(cityName: string){
        const countOfOwnersOfSelectedCity = this.page.getByRole('row', {name: cityName})
        return countOfOwnersOfSelectedCity
    }

    async findPetNameByOwnerPhoneNumber(phoneNumber: string){
        const ownerRow = this.page.getByRole('row', {name: phoneNumber})
        const petName = await ownerRow.locator('td').last().textContent()
        return petName
    }

    async petNamesOfSelectedCity(selectedCityRows: any){
        let petsInSelectedCity: string[] = [];

        for(let row of await selectedCityRows.all()){
            let petName = await row.locator('td').last().innerText()
            petsInSelectedCity.push(petName.trim())
        }
        return petsInSelectedCity
    }

    async validateTheNumberOfOwnersRowsIs(expectedRowsCount: number){
        const countOfOwnersInTable = this.page.locator('.ownerFullName')
        await expect(countOfOwnersInTable).toHaveCount(expectedRowsCount)
    }

    async addNewOwner(ownerFirstName: string, ownerLastName: string, address: string, city: string, phone: string ){
        await this.page.getByRole('button', {name: 'Add Owner'}).click()
        await this.page.getByRole('textbox', {name: 'First Name'}).fill(ownerFirstName)
        await this.page.getByRole('textbox', {name: 'Last Name'}).fill(ownerLastName)
        await this.page.getByRole('textbox', {name: 'Address'}).fill(address)
        await this.page.getByRole('textbox', {name: 'City'}).fill(city)
        await this.page.getByRole('textbox', {name: 'Telephone'}).fill(phone)
        await this.page.getByRole('button', {name: 'Add Owner'}).click()
    }

    async validateOwnerDetailsInTable(ownerFullName: string, address: string, city: string, phone: string ){
        const ownerRow = this.page.getByRole('row', {name: ownerFullName})
        expect(await ownerRow.locator("td").nth(0).textContent()).toEqual(ownerFullName);
        expect(await ownerRow.locator("td").nth(1).textContent()).toEqual(address);
        expect(await ownerRow.locator("td").nth(2).textContent()).toEqual(city);
        expect(await ownerRow.locator("td").nth(3).textContent()).toEqual(phone);
        
    }

    async validateTableContainsOwnerName(ownerFullName: string) {
        await expect(this.page.getByRole('row', { name: ownerFullName })).toHaveCount(1)
    }

    async validateTableDoesNOTcontainOwnerName(ownerFullName: string) {
        await expect(this.page.getByRole('row', { name: ownerFullName })).toHaveCount(0)
    }

}