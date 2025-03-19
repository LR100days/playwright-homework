import { test as base } from '@playwright/test'
import { expect } from '@playwright/test';
import { PageManager } from './page_objects/pageManager'
import { faker } from '@faker-js/faker'

export type TestOptions = {
    createOwnerWithPetAndVisitPrecondition:{
    petName: string;
    visitDescription: string;
    ownerFullName: string;
    }

    pageManager: PageManager
    
}

export const test = base.extend<TestOptions>({
    createOwnerWithPetAndVisitPrecondition: async({page, request}, use) => {
        // Create owner by API
        const randomOwnerFirstName = faker.person.firstName()
        const randomOwnerLastName = faker.person.lastName()
        const randomOwnerAddress = faker.location.streetAddress()
        const randomOwnerCity = faker.location.city()
        const randomOwnerTelephone = faker.number.int({ min: 1000000000, max: 9999999999 }).toString();

        const ownerResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners', {
            data: {
                "firstName": randomOwnerFirstName,
                "lastName": randomOwnerLastName,
                "address": randomOwnerAddress,
                "city": randomOwnerCity,
                "telephone": randomOwnerTelephone
            },
        })
        expect(ownerResponse.status()).toEqual(201);
        const ownerResponseBody = await ownerResponse.json();
        const ownerID = await ownerResponseBody.id;

        // Add pet to owner, created by API
        const randomPetName = faker.animal.petName()
        const pastDate = faker.date.past({ years: 1 })
        const randomPetBirthDay = pastDate.toISOString().split('T')[0];
        const randomPetType = faker.animal.type()
        const randomPetTypeId = faker.number.int({ min: 1300, max: 1500 }).toString();
        const randomPetId = faker.number.int({ min: 1550, max: 1600 }).toString();

        const addPetToOwnerResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerID}/pets`, {
            data: {
                "name": randomPetName,
                "birthDate": randomPetBirthDay,
                "type": {
                    "name": randomPetType,
                    "id": randomPetTypeId
                },
                "id": randomPetId,
                "ownerId": ownerID,
                "visits": []
            },
        })
        
        expect(addPetToOwnerResponse.status()).toEqual(201);
        const addPetToOwnerResponseBody = await addPetToOwnerResponse.json();
        const petID = await addPetToOwnerResponseBody.id;

        // Add visit for the the pet.
        const randomVisitDescription = faker.lorem.sentence(5)
        const futureDate = faker.date.past({ years: 1 })
        const visitDate = futureDate.toISOString().split('T')[0];

        const addVisitForPetResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerID}/pets/${petID}/visits`, {
            data: {
                "date": visitDate,
                "description": randomVisitDescription
            },
        })
        expect(addVisitForPetResponse.status()).toEqual(201);
        await page.goto("/");
        
        await use({ petName: randomPetName, visitDescription: randomVisitDescription, ownerFullName: `${randomOwnerFirstName} ${randomOwnerLastName}` })
        
        // Delete created Owner after test run
        const deleteOwnerResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerID}`, {
            data: {
                "date": visitDate,
                "description": randomVisitDescription
            },
        
        })
        expect(deleteOwnerResponse.status()).toEqual(204);
    },

    pageManager: async({page}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }

})