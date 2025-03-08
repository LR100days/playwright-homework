import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test('Add and delete pet type', async ({page}) => {
    await page.goto('/');
    const pm = new PageManager(page)
    await pm.navigateTo().petTypesPage()
    await pm.onPetTypePage().clickAddButtonToOpenPetTypeInputForm()
    await pm.onPetTypePage().addNewPetType("pig")
    const lastRowInTable = await pm.onPetTypePage().validateLastRowPetType('pig')
    await pm.onPetTypePage().deleteTheLastPetTypeInThePetsTable()
    await expect(lastRowInTable).not.toHaveValue('pig');
})