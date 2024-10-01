import {Page, Locator, expect} from "@playwright/test";

export class MainPage {
    private readonly baseElement: string;
    private readonly navbar: string;
    private readonly cartPopUp: string;

    constructor(public readonly page: Page) {
        this.baseElement = 'body div[class="wrap"]';
        this.navbar = `${this.baseElement} nav[class*="navbar"] > [class*="container"]`;
        this.cartPopUp = `//*[@id="basketContainer"]//*[contains(@class,"dropdown-menu")]`;
    }

    getUserAccount():Locator {
        return this.page.locator(`//*[@id="dropdownUser"]`);
    }
    getExitButton():Locator {
        return this.page.locator('//*[@id="navbarNav"]//button[text()="Выйти"]');
    }
    getCartContainer():Locator {
        return this.page.locator('//*[@id="basketContainer"]');
    }
    getCartButton():Locator {
        return this.page.locator('//*[@id="dropdownBasket"]');
    }
    getOrdersCount():Locator {
        return this.getCartContainer().locator('//span[contains(@class,"basket-count-items")]');
    }
    getClearCartButton():Locator {
        return this.page.locator(`${this.cartPopUp}//a[@role="button" and text()="Очистить корзину"]`);
    }
    getMoveToCartButton():Locator {
        return this.page.locator(`${this.cartPopUp}//a[@role="button" and text()="Перейти в корзину"]`);
    }

    public async clickMoveToCartButton():Promise<void> {
        await this.getMoveToCartButton().click();
    }
    public async clickCartButton():Promise<void> {
        await this.getCartButton().click();
    }
    public async clickClearCart():Promise<void> {
        await this.getClearCartButton().click();
    }
    public async logOut():Promise<void> {
        await this.getUserAccount().click();
        await this.getExitButton().click();
    }
    public async getOrdersCountValue(): Promise<string> {
        await this.cartCountVisible();
        return this.getOrdersCount().innerText()
    }
    public async isReady():Promise<void>  {
        return expect(this.page.locator(`${this.baseElement}`)).toBeVisible();
    }
    public async cartCountVisible(): Promise<void> {
        return expect(this.getOrdersCount()).toBeVisible();
    }
    public async clearButtonVisible(): Promise<void> {
        return expect(this.getCartButton()).toBeVisible();
    }
    public async resetCart(): Promise<void> {
        let ordersCount = parseInt(await this.getOrdersCountValue());
        if (ordersCount > 0) {
            await this.getCartButton().click();
            await this.clearButtonVisible();
            await this.clickClearCart();
            expect(async () => {
                while(ordersCount != 0) {
                    ordersCount = parseInt(await this.getOrdersCountValue());
                }
                return ordersCount;
            }).toEqual("0");
        }
    }
}