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
        const apiHelper = new ApiHelper(request);
        const ownerDetails = await apiHelper.createRandomOwnerByApi()

        const petDetails = await apiHelper.addPetToOwnerByApi(ownerDetails.ownerId)

        const petVisitDescription = await apiHelper.addVisitForPetByApi(ownerDetails.ownerId, petDetails.petId)

        await page.goto("/");
        
        await use({ petName: petDetails.petName, visitDescription: petVisitDescription, ownerFullName: ownerDetails.randomOwnerFullName })
        
        await apiHelper.deleteOwnerByApiUsingOwnerId(ownerDetails.ownerId); 
    },

    pageManager: async({page}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }

})