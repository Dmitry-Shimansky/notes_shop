import {test, expect} from "../pages/pageObjectManager/pageObjectManager";

let orderTotalPrice: number;

test.describe("Cart", async () => {
    test.beforeEach("Precondition",async ({loginPage, mainPage, cartPopUpPage}) => {
        await loginPage.goToLoginPage();
        await loginPage.isReady();
        await loginPage.login("test", "test");
        await mainPage.isReady();
        await cartPopUpPage.resetCart();
        await mainPage.isReady();
    });
    test.afterEach("Log out after test",async ({mainPage}) => {
        await mainPage.logOut();
    });

    test("Move to empty cart", async ({mainPage, cartPage, cartPopUpPage}) => {
        await cartPopUpPage.clickCartButton();
        await expect(cartPopUpPage.cartWindowElement(),`Basket window is not visible`).toBeVisible();
        await cartPopUpPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 1 not promotion product", async ({mainPage, cartPage, cartPopUpPage}) => {
        orderTotalPrice = 0;
        await mainPage.addProductToCartByInputCount(false, 1);
        await mainPage.waitForCounterUpdate();
        await cartPopUpPage.clickCartButton();
        await expect(cartPopUpPage.cartWindowElement(),`Basket window is not visible`).toBeVisible({timeout: 10000});
        await cartPopUpPage.verifyProductsInCartWithOrdered(mainPage.ordersArray, orderTotalPrice);
        await cartPopUpPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 1 promotion product", async ({mainPage, cartPage, cartPopUpPage}) => {
        orderTotalPrice = 0;
        await mainPage.addProductToCartByInputCount(true, 1);
        await mainPage.waitForCounterUpdate();
        await cartPopUpPage.clickCartButton();
        await expect(cartPopUpPage.cartWindowElement(),`Basket window is not visible`).toBeVisible({timeout: 10000});
        await cartPopUpPage.verifyProductsInCartWithOrdered(mainPage.ordersArray, orderTotalPrice);
        await cartPopUpPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 9 different products", async ({mainPage, cartPage, cartPopUpPage}) => {
        orderTotalPrice = 0;
        const discountProducts: number[] = [1,2];
        const originalProducts: number[] = [1,2,3,4,5];
        for (const product of discountProducts) {
            await mainPage.addProductToCartByInputCount(true, 1, product);
        }
        await mainPage.addProductToCartByInputCount(true, 2, 3);
        for (const product of originalProducts) {
            await mainPage.addProductToCartByInputCount(false, 1, product);
        }
        await mainPage.waitForCounterUpdate();
        await cartPopUpPage.clickCartButton();
        await expect(cartPopUpPage.cartWindowElement(),`Basket window is not visible`).toBeVisible({timeout: 10000});
        await cartPopUpPage.verifyProductsInCartWithOrdered(mainPage.ordersArray, orderTotalPrice);
        await cartPopUpPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 9 promotion products with the same product name", async ({mainPage, cartPage, cartPopUpPage}) => {
        orderTotalPrice = 0;
        await mainPage.addProductToCartByInputCount(false, 9);
        await mainPage.waitForCounterUpdate();
        await cartPopUpPage.clickCartButton();
        await expect(cartPopUpPage.cartWindowElement(),`Basket window is not visible`).toBeVisible({timeout: 10000});
        await cartPopUpPage.verifyProductsInCartWithOrdered(mainPage.ordersArray, orderTotalPrice);
        await cartPopUpPage.clickMoveToCartButton();
        await cartPage.isReady();
    });
});