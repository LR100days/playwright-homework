import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';
import { faker } from '@faker-js/faker'

test.beforeEach( async({page}) => {
  await page.goto("/");
})

test('Delete specialty validation', async ({page, request}) => {
    // Create specialty by API
    const newSpecialty = faker.person.jobArea()
    const specialtiesResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            "name":newSpecialty
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

test('Add and delete veterinarian', async ({page, request}) => {
    // Create veterinarian by API
    const randomVeterinarianFirstName = faker.person.firstName()
    const randomVeterinarianLastName = faker.person.lastName()
    const veterinarianResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: {
            "firstName":randomVeterinarianFirstName,
            "lastName":randomVeterinarianLastName,
            "specialties":[],
        },
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            "Content-Type": 'application/json',
        },
    })
    expect(veterinarianResponse.status()).toEqual(201);
    const veterinarianResponseBody = await veterinarianResponse.json();
    const veterinarianID = await veterinarianResponseBody.id;

    // On Veterinarians page validate vet speciality before and after update
    const pm = new PageManager(page)
    await pm.navigateTo().veterinariansPage();
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable(`${randomVeterinarianFirstName} ${randomVeterinarianLastName}`, 'empty');
    await pm.onVeterinariansPage().clickEditButtonForVet(`${randomVeterinarianFirstName} ${randomVeterinarianLastName}`);
    await pm.onEditVeterinarianPage().inSpecialtiesDropdownSelectSpecialtyCheckbox('dentistry');
    await pm.onEditVeterinarianPage().clickSaveVetDetails()
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable(`${randomVeterinarianFirstName} ${randomVeterinarianLastName}`,"dentistry" )

    // Delete vet by API and check that the vet is not shown in Veterinarians API response anymore
    const veterinarianDeleteResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${veterinarianID}`)
    expect(veterinarianDeleteResponse.status()).toEqual(204);
    const vetListResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets')
    const vetListResponseBody = await vetListResponse.json()
    expect(vetListResponseBody.every((vet: any) => vet.id !== veterinarianID)).toBeTruthy();

});

test('New specialty is displayed', async ({page, request}) => {
    // Create specialty by API
    const newRandomSpecialty = faker.person.jobArea()
    const specialtiesResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            "name":newRandomSpecialty
        },
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    })
    expect(specialtiesResponse.status()).toEqual(201)
    const specialtiesResponseBody = await specialtiesResponse.json();
    const specialtyID = await specialtiesResponseBody.id;

    // Create veterinarian by API
    const randomVeterinarianFirstName = faker.person.firstName()
    const randomVeterinarianLastName = faker.person.lastName()
    const veterinarianResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: {
            "firstName":randomVeterinarianFirstName,
            "lastName":randomVeterinarianLastName,
            "specialties":[
                {
                    "id": 2678,
                    "name": "surgery"
                }
            ],
        },
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    })
    expect(veterinarianResponse.status()).toEqual(201);
    const veterinarianResponseBody = await veterinarianResponse.json();
    const veterinarianID = await veterinarianResponseBody.id;

    // On Veterinarians page validate vet speciality before and after update
    const pm = new PageManager(page)
    await pm.navigateTo().veterinariansPage();
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable(`${randomVeterinarianFirstName} ${randomVeterinarianLastName}`, 'surgery');
    await pm.onVeterinariansPage().clickEditButtonForVet(`${randomVeterinarianFirstName} ${randomVeterinarianLastName}`)
    await pm.onEditVeterinarianPage().checkVetSpecialtyIs('surgery')
    await pm.onEditVeterinarianPage().setAllSpecialtiesCheckboxesInSpecialtiesDropdownTo(false)
    await pm.onEditVeterinarianPage().inSpecialtiesDropdownSelectSpecialtyCheckbox(newRandomSpecialty);
    await pm.onEditVeterinarianPage().clickSaveVetDetails()
    await pm.onVeterinariansPage().validateVetSpecialtyInVetTable(`${randomVeterinarianFirstName} ${randomVeterinarianLastName}`,newRandomSpecialty)

    // Delete vet and specialty by API
    const veterinarianDeleteResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${veterinarianID}`)
    expect(veterinarianDeleteResponse.status()).toEqual(204);

    const specialtyDeleteResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${specialtyID}`)
    expect(specialtyDeleteResponse.status()).toEqual(204);

    await pm.navigateTo().specialtiesPage();
    await pm.onSpecialtiesPage().validateLastAddedSpecialtyInTableIsDeletedByName(newRandomSpecialty)  
});