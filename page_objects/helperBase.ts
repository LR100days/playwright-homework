import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker'

export class HelperBase{

    readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async generateRandomOwnerFullName(){
        const randomFullName = faker.person.fullName()
        return randomFullName
    }

    async generateRandomOwnerFirstName(){
        const randomFirstName = faker.person.firstName()
        return randomFirstName
    }

    async generateRandomOwnerLastName(){
        const randomLastName = faker.person.lastName()
        return randomLastName
    }

    async generateRandomOwnerAddress(){
        const randomAddress = faker.location.streetAddress()
        return randomAddress
    }

    async generateRandomOwnerCity(){
        const randomCity = faker.location.city()
        return randomCity
    }

    async generateRandomPhone(){
        const randomPhone = faker.number.int({ min: 1000000000, max: 9999999999 }).toString();
        return randomPhone
    }

    async generateRandomPetName(){
        const randomPetName = faker.animal.petName()
        return randomPetName
    }

    async generateRandomVisitDescription(){
        const randomVisitDescription = faker.lorem.sentence(5)
        return randomVisitDescription
    }

    async generateRandomPetType(){
        const randomPetType = faker.animal.type()
        return randomPetType
    }

    async generateRandomSpecialty(){
        const randomSpec = faker.person.jobArea()
        return randomSpec
    }
}