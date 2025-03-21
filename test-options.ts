import { test as base } from '@playwright/test'
import { PageManager } from './page_objects/pageManager'
import { faker } from '@faker-js/faker'
import { ApiHelper } from './page_objects/apiHelper'

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
        const randomOwnerFirstName = faker.person.firstName()
        const randomOwnerLastName = faker.person.lastName()
        
        const apiHelper = new ApiHelper();
        const ownerID = await apiHelper.createOwnerByApi(request, randomOwnerFirstName, randomOwnerLastName)

        const randomPetName = faker.animal.petName()
        const petID = await apiHelper.addPetToOwnerByApi(request, ownerID, randomPetName)

        const randomVisitDescription = faker.lorem.sentence(5)
        await apiHelper.addVisitForPetByApi(request, ownerID, petID, randomVisitDescription)

        await page.goto("/");
        
        await use({ petName: randomPetName, visitDescription: randomVisitDescription, ownerFullName: `${randomOwnerFirstName} ${randomOwnerLastName}` })
        
        await apiHelper.deleteOwnerByApiUsingOwnerId(request, ownerID); 
    },

    pageManager: async({page}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }

})