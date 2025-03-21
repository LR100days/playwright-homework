import { APIRequestContext, expect, Page } from '@playwright/test';
import { HelperBase } from './helperBase';

export class ApiHelper extends HelperBase{

    constructor(page: Page){
            super(page)
        }

    async deleteOwnerByApiUsingOwnerId( request: APIRequestContext, ownerID: string){
        const deleteOwnerResponse =  await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerID}`)
        expect(deleteOwnerResponse.status()).toEqual(204);
    }

    async createOwnerByApi( request: APIRequestContext, ownerFirstName: string, ownerLastName: string){
        const randomOwnerAddress = await this.generateRandomOwnerAddress()
        const randomOwnerCity = await this.generateRandomOwnerCity()
        const randomOwnerTelephone = await this.generateRandomPhone()
    
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
        const randomPetBirthDay = await this.generateRandomPetBirthDayDate()
        const randomPetType = await this.generateRandomPetType()
        const randomPetTypeId = await this.generateRandomPetTypeId()
        const randomPetId = await this.generateRandomPetId()

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
        const visitDate = await this.generateDateInTheFutureYear()
        const addVisitForPetResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets/${petId}/visits`, {
            data: {
                "date": visitDate,
                "description": visitDescription
            },
        })
        expect(addVisitForPetResponse.status()).toEqual(201);
    }
   
}