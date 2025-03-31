import { Page, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class NavigationPage extends HelperBase{
    constructor(page: Page){
        super(page)
    }

    async petTypesPage(){
        await this.page.getByRole('link', {name:"Pet Types"}).click();
        await expect(this.page.getByRole('heading')).toHaveText('Pet Types');
    }

    async ownersPage(){
        await this.page.getByRole('button', {name:"Owners"}).click();
        await this.page.getByRole('link', {name:"Search"}).click();
        await expect(this.page.getByRole('heading')).toHaveText('Owners')
    }

    async veterinariansPage(){
        await this.page.getByRole('button', {name:"Veterinarians"}).click();
        await this.page.getByRole('link', {name:"All"}).click();
        await expect(this.page.getByRole('heading')).toHaveText('Veterinarians')
    }

    async specialtiesPage(){
        await this.page.getByRole('link', {name:'Specialties'}).click()
        await expect(this.page.getByRole('heading')).toHaveText('Specialties')
    }

    async addNewOwnerPage(){
        await this.page.getByRole('button', {name:"Owners"}).click();
        await this.page.getByRole('link', {name:"Add new"}).click();
        await expect(this.page.getByRole('heading')).toHaveText('New Owner')
    }
    
}

