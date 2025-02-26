import { Page } from '@playwright/test';
import { NavigationPage } from '../page_objects/navigationPage';
import { OwnersPage } from './ownersPage';
import { OwnerInformationPage } from './ownerInformationPage';
import { VeterinariansPage } from './veterinariansPage';
import { PetTypesPage } from './petTypesPage';
import { PetDetailsPage } from './petDetailsPage';
import { SpecialitiesPage } from './specialitiesPage';


export class PageManager{

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly veterinariansPage: VeterinariansPage
    private readonly petTypesPage: PetTypesPage
    private readonly petDetailsPage: PetDetailsPage
    private readonly ownersPage: OwnersPage
    private readonly ownerInformationPage: OwnerInformationPage
    private readonly specialitiesPage: SpecialitiesPage

    constructor(page: Page){
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.veterinariansPage = new VeterinariansPage(this.page)
        this.petTypesPage = new PetTypesPage(this.page)
        this.petDetailsPage = new PetDetailsPage(this.page)
        this.ownersPage = new OwnersPage(this.page)
        this.ownerInformationPage = new OwnerInformationPage(this.page)
        this.specialitiesPage = new SpecialitiesPage(this.page)
    }

    navigateTo(){
        return this.navigationPage
    }

    onVeterinariansPage(){
        return this.veterinariansPage
    }

    onPetTypePage(){
        return this.petTypesPage
    }

    onPetDetailsPage(){
        return this.petDetailsPage
    }

    onOwnersPage(){
        return this.ownersPage
    }
    
    onOwnerInformationPage(){
        return this.ownerInformationPage
    }

    onMainSpecialitiesPage(){
        return this.specialitiesPage
    }
}