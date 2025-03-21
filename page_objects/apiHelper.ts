import { APIRequestContext, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'

export class ApiHelper{

    constructor() {}

    async deleteOwnerByApiUsingOwnerId( request: APIRequestContext, ownerID: string){
        const deleteOwnerResponse =  await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerID}`)
        expect(deleteOwnerResponse.status()).toEqual(204);
    }

    async createOwnerByApi( request: APIRequestContext, ownerFirstName: string, ownerLastName: string){
        const randomOwnerAddress = faker.location.streetAddress()
        const randomOwnerCity = faker.location.city()
        const randomOwnerTelephone = faker.number.int({ min: 1000000000, max: 9999999999 }).toString();
        const ownerResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners', {
            data: {
                "firstName": ownerFirstName,
                "lastName": ownerLastName,
                "address": randomOwnerAddress,
                "city": randomOwnerCity,
                "telephone": randomOwnerTelephone
            },
        })
        expect(ownerResponse.status()).toEqual(201);
        const ownerResponseBody = await ownerResponse.json();
        const ownerID = await ownerResponseBody.id;
        return ownerID
    }

    async addPetToOwnerByApi(request: APIRequestContext, ownerId: string, petName: string){
        const pastDate = faker.date.past({ years: 1 })
        const randomPetBirthDay = pastDate.toISOString().split('T')[0];
        const randomPetType = faker.animal.type()
        const randomPetTypeId = faker.number.int({ min: 1480, max: 1490 }).toString();
        const randomPetId = faker.number.int({ min: 1996, max: 2006 }).toString();

        const addPetToOwnerResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets`, {
            data: {
                "name": petName,
                "birthDate": randomPetBirthDay,
                "type": {
                    "name": randomPetType,
                    "id": randomPetTypeId
                },
                "id": randomPetId,
                "ownerId": ownerId,
                "visits": []
            },
        })
        
        expect(addPetToOwnerResponse.status()).toEqual(201);
        const addPetToOwnerResponseBody = await addPetToOwnerResponse.json();
        const petID = await addPetToOwnerResponseBody.id;
        return petID
    }

    async addVisitForPetByApi(request: APIRequestContext, ownerId: string, petId: string, visitDescription: string){
        const futureDate = faker.date.past({ years: 1 })
        const visitDate = futureDate.toISOString().split('T')[0];

        const addVisitForPetResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets/${petId}/visits`, {
            data: {
                "date": visitDate,
                "description": visitDescription
            },
        })
        expect(addVisitForPetResponse.status()).toEqual(201);
    }
   
}