import {Page, Locator, expect} from "@playwright/test";
import {MainPage} from "./mainPage";
import {OrderItem} from "../models/order.model";

export class CartPopUpPage extends MainPage {
    private readonly cartPopUp: string;
    constructor(public readonly page: Page) {
        super(page);
        this.cartPopUp = `//*[@id="basketContainer"]//*[contains(@class,"dropdown-menu")]`;
    }

    cartWindowElement():Locator {
        return this.page.locator('//*[@id="basketContainer"]/*[contains(@class,"dropdown-menu")]');
    }
    clearCartBtnElem():Locator {
        return this.page.locator(`${this.cartPopUp}//a[@role="button" and text()="Очистить корзину"]`);
    }
    moveToCartBtnElem():Locator {
        return this.page.locator(`${this.cartPopUp}//a[@role="button" and text()="Перейти в корзину"]`);
    }
    cartProductsListElems():Locator {
        return this.page.locator(`${this.cartPopUp}/ul//li`);
    }
    cartProductNameElem(cartProductItem: Locator):Locator {
        return cartProductItem.locator('//span[@class="basket-item-title"]');
    }
    cartProductPriceElem(cartProductItem: Locator):Locator {
        return cartProductItem.locator('//span[@class="basket-item-price"]');
    }
    cartProductCountElem(cartProductItem: Locator):Locator {
        return cartProductItem.locator('//span[contains(@class,"basket-item-count")]');
    }
    cartTotalPriceElem():Locator {
        return this.page.locator(`${this.cartPopUp}//span[@class="basket_price"]`);
    }

    public async clickMoveToCartButton():Promise<void> {
        await this.moveToCartBtnElem().click();
    }
    public async clickCartButton():Promise<void> {
        await this.cartButtonElement().click();
        let elem = await this.cartWindowElement().evaluate(el=>el.classList.contains('show'));
        if (elem != true) {
            do {
                await this.cartButtonElement().click();
                await this.page.waitForTimeout(1000);
                elem = await this.cartWindowElement().evaluate(el=>el.classList.contains('show'));
            } while (elem === false);
        }
    }
    public async clickClearCart():Promise<void> {
        await this.clearCartBtnElem().click();
    }
    public async clearButtonVisible(): Promise<void> {
        return expect(this.clearCartBtnElem(), "Basket clear button is not visible").toBeVisible();
    }

    public async findProductInCart(title: string): Promise<Locator> {
        return this.cartProductsListElems().locator(`//*[text()="${title}"]/parent::node()`);
    }
    public async productCartNameElement(product: Locator): Promise<Locator> {
        return this.cartProductNameElem(product);
    }
    public async productCartPriceElement(product: Locator): Promise<Locator> {
        return this.cartProductPriceElem(product);
    }
    public async productCartPrice(product: Locator): Promise<number> {
        return parseInt((await this.cartProductPriceElem(product).textContent()).match(/\d+/g)[0]);
    }
    public async productCartCountElement(product: Locator): Promise<Locator> {
        return this.cartProductCountElem(product);
    }
    public async productCartCount(product: Locator): Promise<number> {
        return parseInt((await this.cartProductCountElem(product).textContent()));
    }
    public async getCartProductsTotalValue(): Promise<number> {
        return parseInt(await this.cartTotalPriceElem().textContent());
    }
    public async resetCart(): Promise<void> {
        let ordersCount = parseInt(await this.getOrdersCountValue());
        if (ordersCount > 0 && ordersCount !== 9) {
            await this.clickCartButton();
            await this.clearButtonVisible();
            await this.clickClearCart();
            const count = async () => {
                while(ordersCount != 0) {
                    ordersCount = parseInt(await this.getOrdersCountValue());
                }
                return ordersCount;
            };
            await count();
            await this.cartCountVisible();
            await expect(this.cartWindowElement()).toBeVisible({timeout: 10000, visible: false});
        } else if (ordersCount === 9) {
            await this.addProductToCartByInputCount(false, 1);
            await this.clickCartButton();
            await this.clearButtonVisible();
            await this.clickClearCart();
            const count = async () => {
                while(ordersCount != 0) {
                    ordersCount = parseInt(await this.getOrdersCountValue());
                }
                return ordersCount;
            };
            await count();
            await this.cartCountVisible();
            await expect(this.cartWindowElement()).toBeVisible({timeout: 10000, visible: false});
        }
    }
    public async verifyProductsInCartWithOrdered(cartOrdersArray:OrderItem[], totalPrice:number): Promise<void> {
        let orderTotalPrice = totalPrice;
        for (const order of cartOrdersArray) {
            const productCartElement = await this.findProductInCart(order.title);
            const productCartNameElement = await this.productCartNameElement(productCartElement);
            const productCartPriceElement = await this.productCartPriceElement(productCartElement);
            const productCartCountElement = await this.productCartCountElement(productCartElement);
            const productCartPriceValue = await this.productCartPrice(productCartElement);
            const productCartCountValue = await this.productCartCount(productCartElement);
            await expect(productCartNameElement).toBeVisible();
            await expect(productCartPriceElement).toBeVisible();
            await expect(productCartCountElement).toBeVisible();
            expect(productCartPriceValue,
                `Total price for "${order.title}" in cart (${productCartPriceValue}) doesn't match with ordered total price (${order.total})`
            ).toEqual(order.total);
            expect(productCartCountValue,
                `Count in cart for "${order.title}" (${productCartCountValue}) doesn't match with ordered count (${order.count})`
            ).toEqual(order.count);
            orderTotalPrice += order.total
        }
        await expect(this.cartTotalPriceElem()).toBeVisible();
        expect(await this.getCartProductsTotalValue()).toEqual(orderTotalPrice);
    }
}