import { test } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';
import { DataGenerationHelper } from '../utils/dataGenerationHelper';

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

  const testDataHelper = new DataGenerationHelper()
  const randomPetName = await testDataHelper.generateRandomPetName()

  await pm.onOwnerInformationPage().addNewPet(randomPetName, birthYear, birthMonth, birthDay, 'dog')
  await pm.onOwnerInformationPage().validateAddedPetDetailsAre(randomPetName, birthYear, birthMonth, birthDay, 'dog')
  await pm.onOwnerInformationPage().deletePetAndValidateResult(randomPetName)
});

test('Select the dates of visits and validate dates order.', async ({page}) => {
  const pm = new PageManager(page)
  await pm.onOwnersPage().selectOwnerFromOwnersTableByName('Jean Coleman')
  await pm.onOwnerInformationPage().openAddVisitFormFor("Samantha", 'Jean Coleman')
  
  const todayVisitDateIsSelected = await pm.onNewVisitPage().selectDateInTheCalendarOnNewVisitPageToBeToday()

  const testDataHelper = new DataGenerationHelper()
  const randomDescriptionForFirstVisit = await testDataHelper.generateRandomVisitDescription()
  await pm.onNewVisitPage().addNewVisitDescription(randomDescriptionForFirstVisit)
  await pm.onNewVisitPage().confirmNewVisit()
  await pm.onOwnerInformationPage().validateVisitDate(todayVisitDateIsSelected)
 
  await pm.onOwnerInformationPage().openAddVisitFormFor("Samantha", 'Jean Coleman')
  await pm.onNewVisitPage().selectDesiredDateInTheCalendarOnNewVisitPageToBeDaysBack(45)
  
  const randomDescriptionForSecondVisit = await testDataHelper.generateRandomVisitDescription()
  await pm.onNewVisitPage().addNewVisitDescription(randomDescriptionForSecondVisit)
  await pm.onNewVisitPage().confirmNewVisit()
  await pm.onOwnerInformationPage().validateTwoVisitDatesForPet("Samantha", randomDescriptionForFirstVisit, randomDescriptionForSecondVisit)
  
  await pm.onOwnerInformationPage().deleteVisitAndValidateResultForPet("Samantha",randomDescriptionForFirstVisit)
  await pm.onOwnerInformationPage().deleteVisitAndValidateResultForPet("Samantha",randomDescriptionForSecondVisit)
});