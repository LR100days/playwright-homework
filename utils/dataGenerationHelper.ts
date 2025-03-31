import { faker } from '@faker-js/faker'

export class DataGenerationHelper{

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

    async generateDateInThePastYear(){
        const randomPastDate = faker.date.past({ years: 1 })
        return randomPastDate
    }

    async generateDateInTheFutureYear(){
        const randomFutureDate = faker.date.future({ years: 1 })
        const randomFutureDateToString = randomFutureDate.toISOString().split('T')[0];
        return randomFutureDateToString
    }

    async generateRandomPetBirthDayDate(){
        const pastDate = await this.generateDateInThePastYear()
        const randomPetBirthDay = pastDate.toISOString().split('T')[0];
        return randomPetBirthDay
    }

    async generateRandomPetId(){
        const randomPetId = faker.number.int({ min: 1996, max: 2006 }).toString();
        return randomPetId
    }

    async generateRandomPetTypeId(){
        const randomPetTypeId = faker.number.int({ min: 1480, max: 1490 }).toString();
        return randomPetTypeId
    }
}