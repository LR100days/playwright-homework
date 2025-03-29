import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('visual testing', async ({page}) => {
  const pm = new PageManager(page)
  await pm.navigateTo().addNewOwnerPage()
 
  await expect(page.getByRole('button', { name: "Add Owner" })).toHaveScreenshot('Add_Owner_Button_Inactive.png');
  await pm.onAddNewOwnerPage().fillTheNewOwnerInformationWithRandomData()
  await expect(page.getByRole('button', { name: "Add Owner" })).toHaveScreenshot('Add_Owner_Button_Active.png')
});