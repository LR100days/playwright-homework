import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test.describe("Interacting with Input Fields practice", async () => {
    test.beforeEach( async({page}) => {
        await page.getByRole('button', {name:"Owners"}).click();
        await page.getByRole('link', {name:"Search"}).click();
      })

        test('Validate the pet name city of the owner', async ({page}) => {
            //  1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            // 2. In the list of Owners, locate the owner by the name "Jeff Black". Add the assertions that this owner is from the city of "Monona" and he has a pet with a name "Lucky"
        })

        test('Validate owners count of the Madison city', async ({page}) => {
            // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            // 2. In the list of Owners, locate all owners who live in the city of "Madison". Add the assertion that the total number of owners should be 4
        })

        test('Validate search by Last Name', async ({page}) => {
            // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            // 2. On the Owners page, in the "Last name" input field, type the last name "Black" and click the  "Find Owner" button
            // 3. Add the assertion that the displayed owner in the table has a last name "Black"
            // 4. In the "Last name" input field, type the last name "Davis" and click the "Find Owner" button
            // 5. Add the assertion that each owner displayed in the table has a last name "Davis"
            // 6. In the "Last name" input field, type the partial match for the last name "Es" and click the "Find Owner" button
            // 7. Add the assertion that each owner displayed in the table has a last name containing "Es"
            // 8. In the "Last name" input field, type the last name "Playwright" click the "Find Owner" button
            // 9. Add the assertion of the message "No owners with LastName starting with "Playwright"" 
        })

        test('Validate phone number and pet name on the Owner Information page', async ({page}) => {
            // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            // 2. Locate the owner by the phone number "6085552765". Extract the Pet name displayed in the table for the owner and save it to the variable. Click on this owner.
            // 3. On the Owner Information page, add the assertion that "Telephone" value in the Onner Information card is "6085552765"
            // 4. Add the assertion that Pet Name in the Owner Information card matches the name extracted from the page on the step 2
        })

        test('Validate pets of the Madison city', async ({page}) => {
            // 1. Select the OWNERS menu item in the navigation bar and then select "Search" from the drop-down menu
            // 2. On the Owners page, perform the assertion that Madison city has a list of pets: Leo, George, Mulligan, Freddy
            // Hint: create an empty array. loop through the list of the rows, extract the value of the pet for each row that has Madison city, add the value of the pet to the array, perform the assertion that the array has the expected values
        })

})

test('Validate specialty update', async ({page}) => {
    await page.getByRole('button', {name:"Veterinarians"}).click();
    await page.getByRole('link', {name:"All"}).click();

    // 1. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    // 2. On the Veterinarians page, add the assertion that "Rafael Ortega" has specialty "surgery"
    // 3. Select the SPECIALTIES menu item in the navigation bar
    // 4. Add assertion of the "Specialties" header displayed above the table
    // 5. Click on "Edit" button for the "surgery" specialty
    // 6. Add assertion "Edit Specialty" page is displayed
    // 7. Update the specialty from "surgery" to "dermatology" and click "Update button"
    // 8. Add assertion that "surgery" was changed to "dermatology" in the list of specialties
    // 9. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    // 10. On the Veterinarians page, add assertion that "Rafael Ortega" has specialty "dermatology"
    // 11. Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"

})

test('Validate specialty lists', async ({page}) => {
    await page.getByRole('link', {name:"Specialties"}).click();
    // 1. Select the SPECIALTIES menu item in the navigation bar
    // 2. On the Specialties page, select "Add" button. Type the new specialty "oncology" and click "Save" button
    // 3. Extract all values of specialties and put them into the array.
    // 4. Select the VETERINARIANS menu item in the navigation bar, then select "All"
    // 5. On the Veterinarians page, locate the "Sharon Jenkins" in the list and click "Edit" button
    // 6. Click on the Specialties drop-down menu. Extract all values from the drop-down menu to an array
    // 7. Add the assertion that array of specialties collected in the step 3 is equal the the array from drop-down menu
    // 8. Select the "oncology" specialty and click "Save vet" button
    // 9. On the Veterinarians page, add assertion, that "Sharon Jenkins" has specialty "oncology"
    // 10. Navigate to SPECIALTIES page. Click "Delete" for "oncology" specialty
    // 11. Navigate to VETERINARIANS page. Add assertion that "Sharon Jenkins" has no specialty assigned
    // Hint: For step 3, create an empty array, then loop through the list of the table rows, getting the value for each row and adding to the array

})