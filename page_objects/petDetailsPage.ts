// for operations such as adding a new pet, updating pet details, add/update visit details
import { Page, expect } from '@playwright/test';

export class PetDetailsPage {
    readonly page: Page
    constructor(page: Page){
        this.page = page
    }

    /**
     * Validates pet details on Edit pet page
     * @param petOwner - pet owner, selected for test
     * @param petType - initial pet type for selected pet
     */
    async validatePetOwnerAndPetTypeOnEditPetPageAre(petOwner: string, petType: string){
        
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
     * 
     * @param petName - pet name selected for test
     */
    async editPetWithName(petName: string){
        const petRosy = this.page.locator(".dl-horizontal", { hasText: petName })
        await petRosy.getByRole('button', { name: 'Edit Pet' }).click()
        await expect(this.page.locator('#name')).toHaveValue(petName)
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
}

