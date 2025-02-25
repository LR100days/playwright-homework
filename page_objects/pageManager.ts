import { Page, expect } from '@playwright/test';
import { NavigationPage } from '../page_objects/navigationPage';
//import { OwnerInformationPage } from './ownerInformationPage';
import { VeterinariansPage } from './veterinariansPage';


export class PageManager{

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly veterinariansPage: VeterinariansPage

    //private readonly ownerInformationPage: OwnerInformationPage

    constructor(page: Page){
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.veterinariansPage = new VeterinariansPage(this.page)

        //this.ownerInformationPage = new OwnerInformationPage(this.page)
    }

    navigateTo(){
        return this.navigationPage
    }

    onVeterinariansPage(){
        return this.veterinariansPage
    }
}