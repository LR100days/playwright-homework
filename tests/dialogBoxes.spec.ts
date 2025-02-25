import { test, expect } from '@playwright/test';
import { PageManager } from '../page_objects/pageManager';

test('Add and delete pet type', async ({page}) => {
    await page.goto('/');
    const pm = new PageManager(page)
    await pm.navigateTo().petTypesPage()
    await pm.onPetTypePage().clickAddButtonToOpenPetTypeInputForm()
    await pm.onPetTypePage().addNewPetType("pig")

    const lastRowInTable = page.locator('tr td input').last();
    await expect(lastRowInTable).toHaveValue('pig');
    await pm.onPetTypePage().deleteThePreviouslyCreatedPetType()
    await expect(lastRowInTable).not.toHaveValue('pig');
})