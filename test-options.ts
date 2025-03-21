import { test as base } from '@playwright/test'
import { PageManager } from './page_objects/pageManager'
import { ApiHelper } from './page_objects/apiHelper'
import { HelperBase } from './page_objects/helperBase'

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
        const helperBase = new HelperBase(page);
        const randomOwnerFirstName = await  helperBase.generateRandomOwnerFirstName()
        const randomOwnerLastName = await helperBase.generateRandomOwnerLastName()
        
        const apiHelper = new ApiHelper(page);
        const ownerID = await apiHelper.createOwnerByApi(request, randomOwnerFirstName, randomOwnerLastName)

        const randomPetName = await helperBase.generateRandomPetName()
        const petID = await apiHelper.addPetToOwnerByApi(request, ownerID, randomPetName)

        const randomVisitDescription = await helperBase.generateRandomVisitDescription()
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