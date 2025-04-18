import { Page } from '@playwright/test';
import { NavigationPage } from '../page_objects/navigationPage';
import { OwnersPage } from './ownersPage';
import { OwnerInformationPage } from './ownerInformationPage';
import { VeterinariansPage } from './veterinariansPage';
import { PetTypesPage } from './petTypesPage';
import { PetDetailsPage } from './petDetailsPage';
import { SpecialtiesPage } from './specialtiesPage'
import { EditVeterinarianPage } from './editVeterinarianPage'; 
import { NewVisitPage } from './newVisitPage'; 
import { EditPetTypePage } from './editPetTypePage';
import { EditSpecialtyPage } from './editSpecialtyPage';
import { AddNewOwnerPage } from './addNewOwnerPage';


export class PageManager{

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly veterinariansPage: VeterinariansPage
    private readonly petTypesPage: PetTypesPage
    private readonly petDetailsPage: PetDetailsPage
    private readonly ownersPage: OwnersPage
    private readonly ownerInformationPage: OwnerInformationPage
    private readonly specialtiesPage: SpecialtiesPage
    private readonly editVeterinarianPage: EditVeterinarianPage
    private readonly newVisitPage: NewVisitPage
    private readonly editPetTypePage: EditPetTypePage
    private readonly editSpecialtyPage: EditSpecialtyPage
    private readonly addNewOwnerPage: AddNewOwnerPage


    constructor(page: Page){
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.veterinariansPage = new VeterinariansPage(this.page)
        this.petTypesPage = new PetTypesPage(this.page)
        this.petDetailsPage = new PetDetailsPage(this.page)
        this.ownersPage = new OwnersPage(this.page)
        this.ownerInformationPage = new OwnerInformationPage(this.page)
        this.specialtiesPage = new SpecialtiesPage(this.page)
        this.editVeterinarianPage = new EditVeterinarianPage(this.page)
        this.newVisitPage = new NewVisitPage(this.page)
        this.editPetTypePage = new EditPetTypePage(this.page)
        this.editSpecialtyPage = new EditSpecialtyPage(this.page)
        this.addNewOwnerPage = new AddNewOwnerPage(this.page)
        
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

    onSpecialtiesPage(){
        return this.specialtiesPage
    }

    onEditVeterinarianPage(){
        return this.editVeterinarianPage
    }

    onNewVisitPage(){
        return this.newVisitPage
    }

    onEditPetTypePage(){
        return this.editPetTypePage
    }

    onEditSpecialtyPage(){
        return this.editSpecialtyPage
    }

    onAddNewOwnerPage(){
        return this.addNewOwnerPage
    }
}