import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test.beforeEach( async({page}) => {
  await page.goto('/')
  const pm = new PageManager(page)
  await pm.navigateTo().ownersPage()
})

test('Select the desired date in the calendar', async ({page}) => {
  await page.getByRole('link', {name: 'Harold Davis'}).click();
  await page.waitForResponse('**/api/owners/*')
  await page.getByRole('button', {name:"Add New Pet"}).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Tom')

  await expect(page.locator("input#name + span")).toHaveClass(/glyphicon-ok/);

  await page.getByRole('button', {name: 'Open calendar'}).click()
  await page.getByRole('button', {name: 'Choose month and year'}).click()

  await page.getByRole('button', { name: 'Previous 24 years' }).click()
  await page.getByText('2014').click()
  await page.getByText('MAY').click()
  await page.getByText('2', {exact: true}).click()
  await expect(page.locator('[name="birthDate"]')).toHaveValue('2014/05/02')

  await page.locator('#type').selectOption('dog')
  await page.getByRole('button', {name: 'Save Pet'}).click()

  const petTomTable= page.locator(".dl-horizontal", { hasText: "Tom" })
  await expect(petTomTable.locator('dd').first()).toHaveText('Tom')
  await expect(petTomTable.locator('dd').nth(1)).toHaveText('2014-05-02')
  await expect(petTomTable.locator('dd').last()).toHaveText('dog')

  await petTomTable.getByRole('button', {name: "Delete Pet"}).click()
  await expect(petTomTable).not.toBeVisible()
});

test('Select the dates of visits and validate dates order.', async ({page}) => {
  await page.getByRole('link', {name: 'Jean Coleman'}).click();
  const petSamanthaTable= page.locator(".dl-horizontal", { hasText: "Samantha" })

  await petSamanthaTable.getByRole('button', {name: "Add Visit"}).click()
  await expect(page.getByRole('heading')).toHaveText('New Visit')

  const petTableAllColumnsForSamanthatRow = page.locator('.table-striped').getByRole('row').locator('td')
  await expect(petTableAllColumnsForSamanthatRow.first()).toHaveText('Samantha')
  await expect(petTableAllColumnsForSamanthatRow.last()).toHaveText('Jean Coleman')
   
// Add new visit for today 
  let date = new Date()
  date.setDate(date.getDate())

  const expectedDate = date.getDate().toString()
  const expectedMonth = date.toLocaleString('En-US', {month : '2-digit'})
  const expectedYear = date.getFullYear()
  const datetoAssert = `${expectedYear}/${expectedMonth}/${expectedDate}`

  await page.getByRole('button', {name: 'Open calendar'}).click()
  await page.getByText(expectedDate, {exact: true}).click()

  let selectedDateField = page.locator('input[name="date"]')
  await expect(selectedDateField).toHaveValue(datetoAssert)

  await page.locator('#description').fill('dermatologists visit')
  await page.getByRole('button', {name: 'Add Visit'}).click()
  await page.waitForURL('/owners/*')

// Verify that visit for today is shown in the Visits table
  const todayVisitDate = `${expectedYear}-${expectedMonth}-${expectedDate}`
  const samanthaAllVisitsTable = page.locator(".table-condensed").last()
  const firstVisitDateCell = samanthaAllVisitsTable.locator("tr td").first()
  
  await expect(firstVisitDateCell).toHaveText(todayVisitDate);

  await petSamanthaTable.getByRole('button', {name: "Add Visit"}).click()
  await expect(page.getByRole('heading')).toHaveText('New Visit')

// Add new visit, 45 days back from today
  date.setDate(date.getDate() - 45)

  const newExpectedDayToClick = date.getDate().toString()
  const newExpectedDayToAssert = date.toLocaleString('En-US', {day: '2-digit'})
  const newExpectedMonth = date.toLocaleString('En-US', {month : '2-digit'})
  const newExpectedYear = date.getFullYear()
  const newDatetoAssert = `${newExpectedYear}/${newExpectedMonth}/${newExpectedDayToAssert}`

  await page.getByRole('button', {name: 'Open calendar'}).click()
  let calendarMonthAndYear = await page.locator(".mat-calendar-period-button").textContent()
  const expectedMonthAndYear = `${newExpectedMonth} ${newExpectedYear}`

  while(!calendarMonthAndYear?.includes(expectedMonthAndYear)){
    await page.getByRole('button', {name: 'Previous month'}).click()
    calendarMonthAndYear = await page.locator(".mat-calendar-period-button").textContent()
    }

  await page.getByText(newExpectedDayToClick, {exact: true}).click()
  await expect(selectedDateField).toHaveValue(newDatetoAssert)

  await page.locator('#description').fill('massage therapy')
  await page.getByRole('button', {name: 'Add Visit'}).click()
  await page.waitForURL('owners/*')

// Verify that visit for 45 days from today is shown in the Visits table in chronological order
  let firstVisitDateText = firstVisitDateCell.innerText()
  let secondVisitDateText = samanthaAllVisitsTable.locator("tr").nth(2).locator('td').first().innerText()
  const firstVisitDate = new Date(await firstVisitDateText)
  const secondVisitDate = new Date(await secondVisitDateText)

  expect(secondVisitDate.getTime()).toBeLessThan(firstVisitDate.getTime())

// Delete newly created visits and verify that they are not shown in the Visits table anymore
  let firstVisitRow = samanthaAllVisitsTable.locator("tr").nth(1)
  let secondVisitRow = samanthaAllVisitsTable.locator("tr").nth(2)

  await firstVisitRow.getByRole('button',{name: 'Delete Visit'}).click()
  await secondVisitRow.getByRole('button',{name: 'Delete Visit'}).click()

  await expect(samanthaAllVisitsTable).not.toContainText("dermatologists visit")
  await expect(samanthaAllVisitsTable).not.toContainText("massage therapy")
});