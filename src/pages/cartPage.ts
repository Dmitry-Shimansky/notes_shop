import {Page, Locator, expect} from "@playwright/test";

export class CartPage {
    private readonly baseElement: string;


    constructor(public readonly page: Page) {
        this.baseElement = 'body div[class="container"]';
    }

    getCartContainer():Locator {
        return this.page.locator(`${this.baseElement}`);
    }

    public async isReady():Promise<void>  {
        return expect(this.page.locator(`${this.baseElement}`)).toBeVisible();
    }
}