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

    async createRandomOwnerByApi(){
        const helperBase = new HelperBase(this.page)
        const randomOwnerFirstName = await  helperBase.generateRandomOwnerFirstName()
        const randomOwnerLastName = await helperBase.generateRandomOwnerLastName()
        const randomOwnerAddress = await helperBase.generateRandomOwnerAddress()
        const randomOwnerCity = await helperBase.generateRandomOwnerCity()
        const randomOwnerTelephone = await helperBase.generateRandomPhone()
    
        const ownerResponse = await this.request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners', {
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
        return {
            ownerId: ownerID, 
            randomOwnerFullName: `${randomOwnerFirstName} ${randomOwnerLastName}`
            };  
    }

    async addPetToOwnerByApi(ownerId: string){
        const helperBase = new HelperBase(this.page)
        const randomPetName = await helperBase.generateRandomPetName()
        const randomPetBirthDay = await helperBase.generateRandomPetBirthDayDate()
        const randomPetType = await helperBase.generateRandomPetType()
        const randomPetTypeId = await helperBase.generateRandomPetTypeId()
        const randomPetId = await helperBase.generateRandomPetId()

        const addPetToOwnerResponse = await this.request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets`, {
            data: {
                "name": randomPetName,
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
        return {
            petId: petID, 
            petName: randomPetName
            };
    }

    async addVisitForPetByApi(ownerId: string, petId: string){
        const helperBase = new HelperBase(this.page)
        const randomVisitDescription = await helperBase.generateRandomVisitDescription()
        const visitDate = await helperBase.generateDateInTheFutureYear()
        const addVisitForPetResponse = await this.request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets/${petId}/visits`, {
            data: {
                "date": visitDate,
                "description": randomVisitDescription
            },
        })
        expect(addVisitForPetResponse.status()).toEqual(201);
        return randomVisitDescription
    }
   
}