import {Page, Locator, expect} from "@playwright/test";

export class MainPage {
    private readonly baseElement: string;
    private readonly navbar: string;

    constructor(public readonly page: Page) {
        this.baseElement = 'body div[class="wrap"]';
        this.navbar = `${this.baseElement} nav[class*="navbar"] > [class*="container"]`;
    }

    getUserAccount():Locator {
        return this.page.locator(`//*[@id="dropdownUser"]`);
    }
    getExitButton():Locator {
        return this.page.locator('//*[@id="navbarNav"]//button[text()="Выйти"]');
    }
    getCartButton():Locator {
        return this.page.locator('//*[@id="basketContainer"]');
    }
    getOrdersCount():Locator {
        return this.getCartButton().locator('//span[contains(@class,"basket-count-items")]');
    }

    public async logOut():Promise<void> {
        await this.getUserAccount().click();
        await this.getExitButton().click();
    }
    public getOrdersCountValue(): Promise<string> {
        return this.getOrdersCount().innerText()
    }
    public async isReady()  {
        return expect(this.page.locator(`${this.baseElement}`)).toBeVisible();
    }
}