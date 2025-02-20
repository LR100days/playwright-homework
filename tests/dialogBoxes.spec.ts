import { test, expect } from '@playwright/test';

test('Add and delete pet type', async ({page}) => {
    await page.goto('/');
    await page.getByRole('link', {name:" Pet Types"}).click();

    await expect(page.getByRole('heading')).toHaveText('Pet Types');
    await page.getByRole('button', {name:" Add "}).click();
    await expect(page.getByRole('heading').last()).toHaveText('New Pet Type');
    await expect(page.locator('.control-label')).toHaveText('Name');

    const nameInputField = page.locator('#name');
    await expect(nameInputField).toBeVisible();

    await nameInputField.fill('pig');
    await page.getByRole('button', {name:"Save"}).click();

    const lastRowInTable = page.locator('tr td input').last();
    await expect(lastRowInTable).toHaveValue('pig');
    
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual("Delete the pet type?")
        dialog.accept()
    })

    await page.locator('tr td').last().getByRole('button', {name:"Delete"}).click();
    await expect(lastRowInTable).not.toHaveValue('pig');
})