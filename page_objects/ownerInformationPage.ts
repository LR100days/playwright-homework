
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
        const expectedMonth = date.toLocaleString('En-US', {month : '2-digit'})
        const expectedYear = date.getFullYear()
        const datetoAssert = `${expectedYear}/${expectedMonth}/${expectedDate}`

        await this.page.getByRole('button', {name: 'Open calendar'}).click()
        await this.page.getByText(expectedDate, {exact: true}).click()

        let selectedDateField = this.page.locator('input[name="date"]')
        await expect(selectedDateField).toHaveValue(datetoAssert)

        const todayVisitDate = `${expectedYear}-${expectedMonth}-${expectedDate}`
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

        return newDatetoAssert
        
    }
}