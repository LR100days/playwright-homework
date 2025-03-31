import { test } from '../test-options'

test('test with fixture', async({createOwnerWithPetAndVisitPrecondition, pageManager}) => {
    const { petName, visitDescription, ownerFullName } = createOwnerWithPetAndVisitPrecondition;
    await pageManager.navigateTo().ownersPage()
    await pageManager.onOwnersPage().selectOwnerFromOwnersTableByName(ownerFullName)
    await pageManager.onOwnerInformationPage().deleteVisitAndValidateResultForPet(petName, visitDescription)
    await pageManager.onOwnerInformationPage().deletePetAndValidateResult(petName)
})