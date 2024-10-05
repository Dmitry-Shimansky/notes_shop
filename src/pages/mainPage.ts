import {Page, Locator, expect} from "@playwright/test";
import {OrderItem} from "../models/order.model";

export class MainPage {
    private readonly baseElement: string;
    private readonly navbar: string;
    private readonly cartPopUp: string;
    ordersArray: Array<OrderItem> = [];

    constructor(public readonly page: Page) {
        this.baseElement = '//body/div[@class="wrap"]';
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
    getCartWindow():Locator {
        return this.page.locator('//*[@id="basketContainer"]/*[contains(@class,"dropdown-menu")]');
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
    getCartProductsList():Locator {
        return this.page.locator(`${this.cartPopUp}/ul//li`);
    }
    getCartProductName(cartProductItem: Locator):Locator {
        return cartProductItem.locator('//span[@class="basket-item-title"]');
    }
    getCartProductPrice(cartProductItem: Locator):Locator {
        return cartProductItem.locator('//span[@class="basket-item-price"]');
    }
    getCartProductCount(cartProductItem: Locator):Locator {
        return cartProductItem.locator('//span[contains(@class,"basket-item-count")]');
    }
    getCartTotalPrice():Locator {
        return this.page.locator(`${this.cartPopUp}//span[@class="basket_price"]`);
    }
    getProductList():Locator {
        return this.page.locator(`${this.baseElement}//*[@class="container"]//*[@class="note-list row"]/div`);
    }
    getDiscountProduct(index: number):Locator {
        return this.page.locator(`(${this.baseElement}//*[@class="container"]//*[@class="note-list row"]/div//*[contains(@class,"hasDiscount")])[${index}]`);
    }
    getOriginalProduct(index: number):Locator {
        return this.page.locator(`(${this.baseElement}//*[@class="container"]//*[@class="note-list row"]/div//*[@data-product and not(contains(@class,"hasDiscount"))])[${index}]`);
    }
    getProductInputField(product: Locator):Locator {
        return product.locator('//input[@name="product-enter-count"]');
    }

    public async clickMoveToCartButton():Promise<void> {
        await this.getMoveToCartButton().click();
    }
    public async clickCartButton():Promise<void> {
        await this.getCartButton().click();
        let elem = await this.getCartWindow().evaluate(el=>el.classList.contains('show'));
        if (elem != true) {
            do {
                await this.getCartButton().click();
                elem = await this.getCartWindow().evaluate(el=>el.classList.contains('show'));
            } while (elem === true);
        }
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
        return expect(this.page.locator(`${this.baseElement}`), 'Basket page is not visible').toBeVisible();
    }
    public async cartCountVisible(): Promise<void> {
        return expect(this.getOrdersCount(), "Basket order counter is not visible").toBeVisible({timeout: 15000});
    }
    public async clearButtonVisible(): Promise<void> {
        return expect(this.getCartButton(), "Basket clear button is not visible").toBeVisible();
    }
    public async resetCart(): Promise<void> {
        let ordersCount = parseInt(await this.getOrdersCountValue());
        if (ordersCount > 0) {
            await this.getCartButton().click();
            await this.clearButtonVisible();
            await this.clickClearCart();
            const count = async () => {
                while(ordersCount != 0) {
                    await this.cartCountVisible();
                    ordersCount = parseInt(await this.getOrdersCountValue());
                }
                return ordersCount;
            };
            await count();
            await expect(this.getCartWindow()).toBeVisible({timeout: 10000, visible: false});
        }
    }
    public async waitForCounterUpdate(): Promise<void> {
        let ordersCount = parseInt(await this.getOrdersCountValue());
        if (ordersCount === 0) {
            const count = async () => {
                while(ordersCount > 0) {
                    await this.cartCountVisible();
                    ordersCount = parseInt(await this.getOrdersCountValue());
                }
                return ordersCount;
            };
            await count();
        }
    }
    public async clickBuyButton(product: Locator):Promise<void> {
        await product.locator('//button[text()="Купить"]').click();
    }
    public async addProductToCart(discount: boolean, productNumber = 1):Promise<void> {
        discount === true
            ? await this.clickBuyButton(this.getDiscountProduct(productNumber))
            : await this.clickBuyButton(this.getOriginalProduct(productNumber));
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
            ? product = this.getDiscountProduct(productNumber)
            : product = this.getOriginalProduct(productNumber);

        await this.getProductInputField(product).fill(productCount.toString());
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
    public async findProductInCart(title: string): Promise<Locator> {
        return this.getCartProductsList().locator(`//*[text()="${title}"]/parent::node()`);
    }
    public async productCartNameElement(product: Locator): Promise<Locator> {
        return this.getCartProductName(product);
    }
    public async productCartPriceElement(product: Locator): Promise<Locator> {
        return this.getCartProductPrice(product);
    }
    public async productCartPrice(product: Locator): Promise<number> {
        return parseInt((await this.getCartProductPrice(product).textContent()).match(/\d+/g)[0]);
    }
    public async productCartCountElement(product: Locator): Promise<Locator> {
        return this.getCartProductCount(product);
    }
    public async productCartCount(product: Locator): Promise<number> {
        return parseInt((await this.getCartProductCount(product).textContent()));
    }
    public async getCartProductsTotalValue(): Promise<number> {
        return parseInt(await this.getCartTotalPrice().textContent());
    }
}