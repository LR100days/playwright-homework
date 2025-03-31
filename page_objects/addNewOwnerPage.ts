import { Page } from '@playwright/test';
import { HelperBase } from '../page_objects/helperBase';
import { DataGenerationHelper } from '../utils/dataGenerationHelper';

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
        const testDataHelper = new DataGenerationHelper()
        const randomOwnerFirstName = await testDataHelper.generateRandomOwnerFirstName()
        const randomOwnerLastName = await testDataHelper.generateRandomOwnerLastName()
        const randomOwnerAddress = await testDataHelper.generateRandomOwnerAddress()
        const randomOwnerCity = await testDataHelper.generateRandomOwnerCity()
        const randomOwnerTelephone = await testDataHelper.generateRandomPhone()
        await this.page.getByRole('textbox', {name: 'First Name'}).fill(randomOwnerFirstName)
        await this.page.getByRole('textbox', {name: 'Last Name'}).fill(randomOwnerLastName)
        await this.page.getByRole('textbox', {name: 'Address'}).fill(randomOwnerAddress)
        await this.page.getByRole('textbox', {name: 'City'}).fill(randomOwnerCity)
        await this.page.getByRole('textbox', {name: 'Telephone'}).fill(randomOwnerTelephone)
        
    }
}