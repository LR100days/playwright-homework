import { test, expect } from '@playwright/test';
//import { PageManager } from '../page_objects/pageManager';
import ownersDetails from '../test-data/ownersDetails.json'

test.beforeEach( async({page}) => {
  await page.route('https://petclinic-api.bondaracademy.com/petclinic/api/owners', async route => {
    await route.fulfill({
        body: JSON.stringify(ownersDetails)
    })
  })

//   const pm = new PageManager(page)
//   await pm.navigateTo().ownersPage()

})

test('mocking API request', async ({page}) => {
    await expect
});