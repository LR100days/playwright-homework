import { APIRequestContext, expect, Page } from '@playwright/test';
import { DataGenerationHelper } from '../utils/dataGenerationHelper';

export class ApiHelper{

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
        
    }

    async deleteOwnerByApiUsingOwnerId( ownerID: string){
        const deleteOwnerResponse =  await this.request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerID}`)
        expect(deleteOwnerResponse.status()).toEqual(204);
    }

    async createRandomOwnerByApi(){
        const testDataHelper = new DataGenerationHelper()
        const randomOwnerFirstName = await testDataHelper.generateRandomOwnerFirstName()
        const randomOwnerLastName = await testDataHelper.generateRandomOwnerLastName()
        const randomOwnerAddress = await testDataHelper.generateRandomOwnerAddress()
        const randomOwnerCity = await testDataHelper.generateRandomOwnerCity()
        const randomOwnerTelephone = await testDataHelper.generateRandomPhone()
    
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
        const testDataHelper = new DataGenerationHelper()
        const randomPetName = await testDataHelper.generateRandomPetName()
        const randomPetBirthDay = await testDataHelper.generateRandomPetBirthDayDate()
        const randomPetType = await testDataHelper.generateRandomPetType()
        const randomPetTypeId = await testDataHelper.generateRandomPetTypeId()
        const randomPetId = await testDataHelper.generateRandomPetId()

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
        const testDataHelper = new DataGenerationHelper()
        const randomVisitDescription = await testDataHelper.generateRandomVisitDescription()
        const visitDate = await testDataHelper.generateDateInTheFutureYear()
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