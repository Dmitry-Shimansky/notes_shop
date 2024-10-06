import {Page, Locator, expect} from "@playwright/test";
import {OrderItem} from "../models/order.model";

export class MainPage {
    private readonly baseElement: string;
    ordersArray: Array<OrderItem> = [];

    constructor(public readonly page: Page) {
        this.baseElement = '//body/div[@class="wrap"]';
    }

    userAccountElement():Locator {
        return this.page.locator(`//*[@id="dropdownUser"]`);
    }
    exitButtonElement():Locator {
        return this.page.locator('//*[@id="navbarNav"]//button[text()="Выйти"]');
    }
    cartContainerElement():Locator {
        return this.page.locator('//*[@id="basketContainer"]');
    }
    // cartWindowElement():Locator {
    //     return this.page.locator('//*[@id="basketContainer"]/*[contains(@class,"dropdown-menu")]');
    // }
    cartButtonElement():Locator {
        return this.page.locator('//*[@id="dropdownBasket"]');
    }
    ordersCountElement():Locator {
        return this.cartContainerElement().locator('//span[contains(@class,"basket-count-items")]');
    }

    productListElems():Locator {
        return this.page.locator(`${this.baseElement}//*[@class="container"]//*[@class="note-list row"]/div`);
    }
    discountProductElem(index: number):Locator {
        return this.page.locator(`(${this.baseElement}//*[@class="container"]//*[@class="note-list row"]/div//*[contains(@class,"hasDiscount")])[${index}]`);
    }
    originalProductElem(index: number):Locator {
        return this.page.locator(`(${this.baseElement}//*[@class="container"]//*[@class="note-list row"]/div//*[@data-product and not(contains(@class,"hasDiscount"))])[${index}]`);
    }
    productInputFieldElem(product: Locator):Locator {
        return product.locator('//input[@name="product-enter-count"]');
    }

    public async logOut():Promise<void> {
        await this.userAccountElement().click();
        await this.exitButtonElement().click();
        await this.page.reload();
    }
    public async getOrdersCountValue(): Promise<string> {
        await this.cartCountVisible();
        return this.ordersCountElement().innerText()
    }
    public async isReady():Promise<void>  {
        return expect(this.page.locator(`${this.baseElement}`), 'Basket page is not visible').toBeVisible();
    }
    public async cartCountVisible(): Promise<void> {
        return expect(this.ordersCountElement(), "Basket order counter is not visible").toBeVisible({timeout: 10000});
    }
    public async waitForCounterUpdate(): Promise<void> {
        let ordersCount = parseInt(await this.getOrdersCountValue());
        if (ordersCount === 0) {
            const count = async () => {
                while(ordersCount > 0) {
                    ordersCount = parseInt(await this.getOrdersCountValue());
                }
                return ordersCount;
            };
            await count();
            await this.cartCountVisible();
        }
    }
    public async clickBuyButton(product: Locator):Promise<void> {
        await product.locator('//button[text()="Купить"]').click();
    }
    public async addProductToCart(discount: boolean, productNumber = 1):Promise<void> {
        discount === true
            ? await this.clickBuyButton(this.discountProductElem(productNumber))
            : await this.clickBuyButton(this.originalProductElem(productNumber));
    }
    public async addSomeProductsToCart(discount: boolean, productCount: number, productNumber = 1): Promise<void> {
        for (let i = 0; i < productCount; i++) {
            await this.addProductToCart(discount, productNumber);
        }
    }
    public async getProductNameText(product: Locator): Promise<string> {
        return product.locator('//*[contains(@class,"product_name")]').innerText();
    }
    public async getProductPriceValue(product: Locator): Promise<string> {
        return product.locator('//span[contains(@class,"product_price") and text()]').innerText();
    }
    public async addProductToCartByInputCount(discount: boolean, productCount: number, productNumber = 1):Promise<void> {
        let title: string;
        let price: number;
        let count = productCount;
        let total: number;
        let product: Locator;

        discount === true
            ? product = this.discountProductElem(productNumber)
            : product = this.originalProductElem(productNumber);

        await this.productInputFieldElem(product).fill(productCount.toString());
        await this.clickBuyButton(product);
        title = await this.getProductNameText(product);
        price = parseInt((await this.getProductPriceValue(product)).split(' ')[0]);
        total = count * price;

        const order: OrderItem = {
            title,
            price,
            count,
            total
        }
        this.ordersArray.push(order);
    }
}