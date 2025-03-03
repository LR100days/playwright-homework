import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test.beforeEach( async({page}) => {
  await page.goto('/')
  const pm = new PageManager(page)
  await pm.navigateTo().ownersPage()
})

test('Select the desired date in the calendar', async ({page}) => {
  const pm = new PageManager(page)
  await pm.onOwnersPage().selectOwnerFromOwnersTableByName('Harold Davis')

  const birthYear = '2014'
  const birthMonth = '05'
  const birthDay = '02'
  await pm.onOwnerInformationPage().addNewPet('Tom', birthYear, birthMonth, birthDay, 'dog')
  await pm.onOwnerInformationPage().validateAddedPetDetailsAre('Tom', birthYear, birthMonth, birthDay, 'dog')
  await pm.onOwnerInformationPage().deletePet('Tom')
});

test('Select the dates of visits and validate dates order.', async ({page}) => {
  const pm = new PageManager(page)
  await pm.onOwnersPage().selectOwnerFromOwnersTableByName('Jean Coleman')
  await pm.onOwnerInformationPage().openAddVisitFormFor("Samantha", 'Jean Coleman')
  
  const todayVisitDateIsSelected = await pm.onPetDetailsPage().selectDateInTheCalendarOnNewVisitPageToBeToday()
  await pm.onOwnerInformationPage().addNewVisitDescription('dermatologists visit')
  await pm.onOwnerInformationPage().confirmNewVisit()
  await pm.onOwnerInformationPage().validateVisitDate(todayVisitDateIsSelected)
 
  await pm.onOwnerInformationPage().openAddVisitFormFor("Samantha", 'Jean Coleman')
  await pm.onPetDetailsPage().selectDesiredDateInTheCalendarOnNewVisitPageToBeDaysBack(45)
  await pm.onOwnerInformationPage().addNewVisitDescription('massage therapy')
  await pm.onOwnerInformationPage().confirmNewVisit()
  await pm.onOwnerInformationPage().validateTwoVisitDatesForPet("Samantha", "dermatologists visit", "massage therapy")
  
  await pm.onOwnerInformationPage().deleteVisitForPet("Samantha","dermatologists visit")
  await pm.onOwnerInformationPage().deleteVisitForPet("Samantha","massage therapy")
});