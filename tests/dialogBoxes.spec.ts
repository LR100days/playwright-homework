import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';
import { DataGenerationHelper } from '../utils/dataGenerationHelper';

test('Add and delete pet type', async ({page}) => {
    await page.goto('/');
    const pm = new PageManager(page)
    await pm.navigateTo().petTypesPage()
    await pm.onPetTypePage().clickAddButtonToOpenPetTypeInputForm()

    const testDataHelper = new DataGenerationHelper()
    const randomPetType = await testDataHelper.generateRandomPetType()
    await pm.onPetTypePage().addNewPetType(randomPetType)
    const lastRowInTable = await pm.onPetTypePage().validateLastRowPetType(randomPetType)
    await pm.onPetTypePage().deleteTheLastPetTypeInThePetsTable()
    await expect(lastRowInTable).not.toHaveValue(randomPetType);
})