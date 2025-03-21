import { APIRequestContext, expect, Page } from '@playwright/test';
import { HelperBase } from './helperBase';

export class ApiHelper{

    readonly request: APIRequestContext;
    readonly page: Page

    constructor(request: APIRequestContext) {
        this.request = request;
        
    }

    async deleteOwnerByApiUsingOwnerId( ownerID: string){
        const deleteOwnerResponse =  await this.request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerID}`)
        expect(deleteOwnerResponse.status()).toEqual(204);
    }

    async createOwnerByApi(ownerFirstName: string, ownerLastName: string){
        const helperBase = new HelperBase(this.page)
        const randomOwnerAddress = await helperBase.generateRandomOwnerAddress()
        const randomOwnerCity = await helperBase.generateRandomOwnerCity()
        const randomOwnerTelephone = await helperBase.generateRandomPhone()
    
        const ownerResponse = await this.request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners', {
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

    async addPetToOwnerByApi(ownerId: string, petName: string){
        const helperBase = new HelperBase(this.page)
        const randomPetBirthDay = await helperBase.generateRandomPetBirthDayDate()
        const randomPetType = await helperBase.generateRandomPetType()
        const randomPetTypeId = await helperBase.generateRandomPetTypeId()
        const randomPetId = await helperBase.generateRandomPetId()

        const addPetToOwnerResponse = await this.request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets`, {
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

    async addVisitForPetByApi(ownerId: string, petId: string, visitDescription: string){
        const helperBase = new HelperBase(this.page)
        const visitDate = await helperBase.generateDateInTheFutureYear()
        const addVisitForPetResponse = await this.request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets/${petId}/visits`, {
            data: {
                "date": visitDate,
                "description": visitDescription
            },
        })
        expect(addVisitForPetResponse.status()).toEqual(201);
    }
   
}