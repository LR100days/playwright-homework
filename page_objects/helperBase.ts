import { Page } from '@playwright/test';


export class HelperBase{

    readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    // Use this helper for some methods shared across page objects.
}