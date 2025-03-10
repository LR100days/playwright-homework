import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';
import ownersDetails from '../test-data/ownersDetails.json'
import specialities from '../test-data/specialities.json'

test.describe('owners page', async () => {
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

    await page.goto("/");
    const pm = new PageManager(page)
    await pm.navigateTo().ownersPage()

  })

  test('mocking API request', async ({page}) => {
    const pm = new PageManager(page)
    await pm.onOwnersPage().validateTheNumberOfOwnersRowsIs(2)

    await pm.onOwnersPage().selectOwnerFromOwnersTableByName(`${ownersDetails[0].firstName} ${ownersDetails[0].lastName}`)
    await pm.onOwnerInformationPage().validateOwnerNameAddressCityAndTelephoneAre(`${ownersDetails[0].firstName} ${ownersDetails[0].lastName}`,
      `${ownersDetails[0].address}`, `${ownersDetails[0].city}`, `${ownersDetails[0].telephone}`)
    
    let actualPetListOfOwner = await pm.onOwnerInformationPage().getListOfPetsNamesThatAreDisplayedOnOwnerInfoPage()
    
    let expectedPetsList: string[] = ownersDetails[0].pets.map(pet => pet.name);
    
    expect(actualPetListOfOwner).toEqual(expectedPetsList)

    await pm.onOwnerInformationPage().validateVisitsCountForPetName(`${ownersDetails[0].pets[0].name}`, 10)

  })
});


test.describe('veterinarians page', async () => {
  test.beforeEach(async ({ page }) => {
      await page.route('*/**/api/vets', async route => {
          const response = await route.fetch();
          const responseBody = await response.json();

          responseBody.forEach(vet => {
            if (vet.firstName === 'Sharon' && vet.lastName === 'Jenkins') {
                vet.specialties = specialities;
            }
          });

          await route.fulfill({
              body: JSON.stringify(responseBody)
          });
      });  
      await page.goto("/");
      const pm = new PageManager(page);
      await pm.navigateTo().veterinariansPage(); 
  });

  test('intercept API response', async ({ page }) => {
      const pm = new PageManager(page)
      await pm.onVeterinariansPage().validateNumberOfSpecialtiesByVetName('Sharon Jenkins', 10)
  });
});