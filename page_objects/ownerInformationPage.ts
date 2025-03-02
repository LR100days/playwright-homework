
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

    /**
     * Selects day of today in the calendar on New Visit Page
     * @returns today's date in format YYYY-MM-DD
     */
    async selectDateInTheCalendarOnNewVisitPageToBeToday(){
        let date = new Date()
        date.setDate(date.getDate())

        const expectedDate = date.getDate().toString()
        const expectedDate2digits = date.toLocaleString('En-US', {day : '2-digit'})
        const expectedMonth = date.toLocaleString('En-US', {month : '2-digit'})
        const expectedYear = date.getFullYear()
        const datetoAssert = `${expectedYear}/${expectedMonth}/${expectedDate2digits}`

        await this.page.getByRole('button', {name: 'Open calendar'}).click()
        await this.page.getByText(expectedDate, {exact: true}).click()

        let selectedDateField = this.page.locator('input[name="date"]')
        await expect(selectedDateField).toHaveValue(datetoAssert)

        const todayVisitDate = `${expectedYear}-${expectedMonth}-${expectedDate2digits}`
        return todayVisitDate
    }

    /**
     * Selects desired day in the past in the calendar on New Visit Page
     * @param numberOfDays - how many days back the desired day is
     * @returns desired date in format YYYY/MM/DD
     */
    async selectDesiredDateInTheCalendarOnNewVisitPageToBeDaysBack(numberOfDays: number){
        let date = new Date()
        date.setDate(date.getDate() - numberOfDays)

        const newExpectedDayToClick = date.getDate().toString()
        const newExpectedDayToAssert = date.toLocaleString('En-US', {day: '2-digit'})
        const newExpectedMonth = date.toLocaleString('En-US', {month : '2-digit'})
        const newExpectedYear = date.getFullYear()
        const newDatetoAssert = `${newExpectedYear}/${newExpectedMonth}/${newExpectedDayToAssert}`
      
        await this.page.getByRole('button', {name: 'Open calendar'}).click()
        let calendarMonthAndYear = await this.page.locator(".mat-calendar-period-button").textContent()
        const expectedMonthAndYear = `${newExpectedMonth} ${newExpectedYear}`
      
        while(!calendarMonthAndYear?.includes(expectedMonthAndYear)){
          await this.page.getByRole('button', {name: 'Previous month'}).click()
          calendarMonthAndYear = await this.page.locator(".mat-calendar-period-button").textContent()
          }
      
        await this.page.getByText(newExpectedDayToClick, {exact: true}).click()
        
        let selectedDateField = this.page.locator('input[name="date"]')
        await expect(selectedDateField).toHaveValue(newDatetoAssert)
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
        await expect(petTomTable.locator('dd').last()).toHaveText(petType)
    }

    async deletePet(petName: string){
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

    async addNewVisitDescription(description: string){
        const selectedDateField = this.page.locator('input[name="date"]')
        await this.page.locator('#description').fill(description)
    }

    async confirmNewVisit(){
        await this.page.getByRole('button', {name: 'Add Visit'}).click()
        await this.page.waitForURL('/owners/*')
    }

    async validateVisitDate(visitDate: string){
        const samanthaAllVisitsTable = this.page.locator(".table-condensed").last()
        const firstVisitDateCell = samanthaAllVisitsTable.locator("tr td").first()
        await expect(firstVisitDateCell).toHaveText(visitDate);
    }

    async deleteVisitForPet(petName: string,description:string){
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
}