import { test, expect } from '@playwright/test';
//import { PageManager } from '../page_objects/pageManager';
import ownersDetails from '../test-data/ownersDetails.json'

test.beforeEach( async({page}) => {
  await page.route('*/**/api/owners', async route => {
    await route.fulfill({
        body: JSON.stringify(ownersDetails)
    })
  })

  await page.route(`*/**/api/owners/${ownersDetails[0].id}`, async route => {

    await route.fulfill({
      body: JSON.stringify(ownersDetails[0])
    })
  })

  await page.goto("/owners");
  //const pm = new PageManager(page)
  //await pm.navigateTo().ownersPage()

})

test('mocking API request', async ({page}) => {
  await expect(page.locator('.ownerFullName')).toHaveCount(2)
  await page.getByRole('link', { name: 'Adam Braun' }).click()
  await expect(page.locator('.ownerFullName')).toHaveText('Adam Braun')
  
  await expect(page.locator('table').first().locator('tr td').last()).toContainText('3456789012')
  await expect(page.locator('.dl-horizontal dd').first()).toContainText(`${ownersDetails[0].pets[0].name}`)

});