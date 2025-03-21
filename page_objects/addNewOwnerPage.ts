import { Page, expect } from '@playwright/test';
import { HelperBase } from '../page_objects/helperBase';

export class AddNewOwnerPage extends HelperBase{
    constructor(page: Page){
        super(page)
    }

    async addNewOwner(ownerFirstName: string, ownerLastName: string, address: string, city: string, phone: string ){
        await this.page.getByRole('button', {name: 'Add Owner'}).click()
        await this.page.getByRole('textbox', {name: 'First Name'}).fill(ownerFirstName)
        await this.page.getByRole('textbox', {name: 'Last Name'}).fill(ownerLastName)
        await this.page.getByRole('textbox', {name: 'Address'}).fill(address)
        await this.page.getByRole('textbox', {name: 'City'}).fill(city)
        await this.page.getByRole('textbox', {name: 'Telephone'}).fill(phone)
        await this.page.getByRole('button', {name: 'Add Owner'}).click()
        
    }
    
    async fillTheNewOwnerInformationWithRandomData(){
        const randomOwnerFirstName = await this.generateRandomOwnerFirstName()
        const randomOwnerLastName = await this.generateRandomOwnerLastName()
        const randomOwnerAddress = await this.generateRandomOwnerAddress()
        const randomOwnerCity = await this.generateRandomOwnerCity()
        const randomOwnerTelephone = await this.generateRandomPhone()
        await this.page.getByRole('textbox', {name: 'First Name'}).fill(randomOwnerFirstName)
        await this.page.getByRole('textbox', {name: 'Last Name'}).fill(randomOwnerLastName)
        await this.page.getByRole('textbox', {name: 'Address'}).fill(randomOwnerAddress)
        await this.page.getByRole('textbox', {name: 'City'}).fill(randomOwnerCity)
        await this.page.getByRole('textbox', {name: 'Telephone'}).fill(randomOwnerTelephone)
        //await this.page.waitForTimeout(200)
    }
}