import { Page, expect } from '@playwright/test';

export class OwnerInformationPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    /**
     * Verifies that newly selected pet type is shown on owner details page
     * @param petName - select pet for which the validation should be performed
     * @param expectedPetType - expected pet type
     */
    async validatePetTypeOnOwnerInfoPage(petName: string, expectedPetType: string){
        const petTable= this.page.locator(".dl-horizontal", { hasText: petName })
        await expect(petTable.locator('dd').last()).toHaveText(expectedPetType)
    }

    /**
     * Saves a new pet for selected owner.
     * @param petName - new Pet name
     * @param birthYear - format example '2014'
     * @param birthMonth - format example '05'
     * @param birthDay - format example '02'
     * @param petType - pet type, example 'dog'
     */
    async addNewPet(petName: string, birthYear: string, birthMonth: string, birthDay: string, petType: string){
        await this.page.getByRole('button', {name:"Add New Pet"}).click();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(petName)
        await expect(this.page.locator("input#name + span")).toHaveClass(/glyphicon-ok/);

        await this.page.getByLabel('Open calendar').click();
        const petBirthDate = `${birthYear}/${birthMonth}/${birthDay}`

        await this.page.getByLabel('Choose month and year').click()
        await this.page.getByLabel('Previous 24 years').click()
        await this.page.getByRole('button', { name: birthYear }).click()
        await this.page.getByLabel(`${birthMonth} ${birthYear}`).click()
        await this.page.getByLabel(petBirthDate).click()
        await expect(this.page.locator('[name="birthDate"]')).toHaveValue(petBirthDate)
        await this.page.locator('#type').selectOption(petType)
        await this.page.getByRole('button', {name: 'Save Pet'}).click()
    }

    /**
     * Selects pet birth date in the calendar
     * @param year - format example '2020'
     * @param month - format example 'June'
     * @param day - format example '4'
     */
    async validateAddedPetDetailsAre(petName: string, birthYear: string, birthMonth: string, birthDay: string, petType: string){
        const petBirthDate = `${birthYear}-${birthMonth}-${birthDay}`
        const petTomTable= this.page.locator(".dl-horizontal", { hasText: petName })
        await expect(petTomTable.locator('dd').first()).toHaveText(petName)
        await expect(petTomTable.locator('dd').nth(1)).toHaveText(petBirthDate)
        await this.validatePetTypeOnOwnerInfoPage(petName, petType)
    }

    async deletePetAndValidateResult(petName: string){
        const petTomTable= this.page.locator(".dl-horizontal", { hasText: petName })
        await petTomTable.getByRole('button', {name: "Delete Pet"}).click()
        await expect(petTomTable).not.toBeVisible()
    }

    async openAddVisitFormFor(petName: string, petOwner: string){
        const petSamanthaTable= this.page.locator(".dl-horizontal", { hasText: petName })
        await petSamanthaTable.getByRole('button', {name: "Add Visit"}).click()
        await expect(this.page.getByRole('heading')).toHaveText('New Visit')
      
        const petTableAllColumnsForSamanthatRow = this.page.locator('.table-striped').getByRole('row').locator('td')
        await expect(petTableAllColumnsForSamanthatRow.first()).toHaveText(petName)
        await expect(petTableAllColumnsForSamanthatRow.last()).toHaveText(petOwner)
    }

    async deleteVisitAndValidateResultForPet(petName: string,description:string){
        const petVisitsTable = this.page.locator('app-pet-list', { has: this.page.getByText(petName) }).locator('app-visit-list')
        
        await petVisitsTable.locator('tr', { has: this.page.getByText(description) }).getByRole('button', { name: 'Delete Visit' }).click()
        await expect(petVisitsTable).not.toContainText(description)
    }

    async validateTwoVisitDatesForPet(petName: string, firstVisitDescription: string, secondVisitDescription: string) {
        const firstDateValue = await this.page.locator('app-pet-list', { has: this.page.getByText(petName) }).locator('app-visit-list')
        .locator('tr', { has: this.page.getByText(firstVisitDescription)}).locator('td').first().textContent()
        const secondDateValue = await this.page.locator('app-pet-list', { has: this.page.getByText(petName) }).locator('app-visit-list')
        .locator( 'tr', { has: this.page.getByText(secondVisitDescription) }).locator('td').first().textContent()
        const firstDate = new Date(firstDateValue!);
        const secondDate = new Date(secondDateValue!);
        expect(firstDate > secondDate).toBeTruthy();
    }

    async validateOwnerPhoneNumberAndPetNameAre(phoneNumber: string, petName: string){
        
        await this.page.getByRole('row', {name: phoneNumber}).getByRole('link').click()
        await expect(this.page.getByRole('row', {name: "Telephone"})).toContainText(phoneNumber)
        await expect(this.page.getByRole('table').locator("dd").first()).toHaveText(petName!)
    }

    async validateVisitDate(visitDate: string){
        const samanthaAllVisitsTable = this.page.locator(".table-condensed").last()
        const firstVisitDateCell = samanthaAllVisitsTable.locator("tr td").first()
        await expect(firstVisitDateCell).toHaveText(visitDate);
    }

      /**
     * 
     * @param petName - pet name selected for test
     */
      async clickEditPetWithName(petName: string){
        const petRosy = this.page.locator(".dl-horizontal", { hasText: petName })
        await petRosy.getByRole('button', { name: 'Edit Pet' }).click()
        await expect(this.page.locator('#name')).toHaveValue(petName)
    }

    async validateOwnerNameAddressCityAndTelephoneAre(name: string, address: string, city: string, phone: string ){
        await expect(this.page.locator(".ownerFullName")).toHaveText(name)
        await expect(this.page.getByRole('row', {name: "Address"})).toContainText(address)
        await expect(this.page.getByRole('row', {name: "City"})).toContainText(city)
        await expect(this.page.getByRole('row', {name: "Telephone"})).toContainText(phone)
    }

    async getListOfPetsNamesThatAreDisplayedOnOwnerInfoPage(){
        const petsList: string[] = [];
        const allPetTablesRows = await this.page.locator('dd').all();

        for (let i = 0; i < allPetTablesRows.length; i += 3) {
            const petName = await allPetTablesRows[i].innerText();
            petsList.push(petName.trim());
            }

        return petsList      
    }

    async validateVisitsCountForPetName(petName: string, expectedVisitsCount: number){
        await expect(this.page.locator('app-pet-list', { has: this.page.getByText(petName) })
            .locator('app-visit-list tr:not(:first-child)')).toHaveCount(expectedVisitsCount)
    }
}