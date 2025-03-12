import { test, expect } from '@playwright/test';
import { request, APIRequestContext } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test.beforeEach( async({page}) => {
  await page.goto("/");
})

test('Delete specialty validation', async ({page}) => {
    // Create specialty by API
    const newSpecialty = "api testing expert"
    const apiContext: APIRequestContext = await request.newContext();
    const specialtiesResponse = await apiContext.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            "name":newSpecialty
        },
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    })
    expect(specialtiesResponse.status()).toEqual(201)

    // Verify added specialty and then delete it
    const pm = new PageManager(page)
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().validateLastAddedSpecialtyInTableByName(newSpecialty)
    await pm.onSpecialtiesPage().deleteSpecialtyByName(newSpecialty)
    await pm.onSpecialtiesPage().validateLastAddedSpecialtyInTableIsDeletedByName(newSpecialty)
});



test('Add and delete veterinarian', async ({page}) => {
    // Test Case 2: Add and delete veterinarian
// STEPS:
// 1. Using API, create a new Veterinarian without the specialties assigned. Save the veterinarian ID from the response to the constant for later use. Add assertion of the response status code and name of the veterinarian
// 2. Navigate to Veterinarians page
// 3. Add the assertion that newly created veterinarian is available in the list and it does not have specialties assigned
// 4. Click "Edit Vet" button for newly created veterinarian
// 5. On "Edit Veterinarian" page, select "dentistry" specialty from the drop-down, and click Save Vet button
// 6. Add the assertion that the "dentistry" specialty is displayed for the test veterinarian
// 7. Using API request, delete the created test veterinarian. Add assertion of response status code. (Tip: use the ID from the step 1)
// 8. Using API request, get the list of veterinarians. Make the assertion that deleted veterinarian does not exist in the response body

});

test('New specialty is displayed', async ({page}) => {
    // Test Case 3: New specialty is displayed
// STEPS:
// 1. Using API request, create a new specialty with the name "api testing ninja". Add assertion of the response status code
// 2. Using API request, create a new veterinarian with a specialty "surgery". Add assertion of the response status code.
// 3. Navigate to Veterinarians page
// 4. Add the assertion that newly created veterinarian is available in the list and it has specialty "surgery"
// 5. Click on the "Edit Vet" button
// 6. On Edit Veterinarian page, change the specialty from "surgery" to "api testing ninja" and click "Save Vet" button
// 7. Add the assertion that veterinarian has a specialty "api testing ninja"
// 8. Using API request, delete the create test veterinarian. Add assertion of the response status code
// 9. Using API request, delete the specialty "api testing ninja". Add assertion of the response status code
// 10. Navigate to the Specialties page and add assertion that "api testing ninja" does not exist in the list of specialties
    
});