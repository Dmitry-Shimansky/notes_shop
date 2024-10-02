import {test, expect} from "../pages/pageObjectManager/pageObjectManager";

test.describe("Cart", async () => {
    test.beforeEach(async ({loginPage, mainPage}) => {
        await loginPage.goToLoginPage();
        await loginPage.isReady();
        await loginPage.login("test", "test");
        await mainPage.isReady();
        await mainPage.resetCart();
    });
    // test.afterEach(async ({mainPage}) => {
    //     await mainPage.logOut();
    // });

    test("Move to empty cart", async ({mainPage, cartPage}) => {
        await mainPage.clickCartButton();
        await expect(mainPage.getCartContainer(),`Basket window is not visible`).toBeVisible();
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 1 not promotion product", async ({mainPage, cartPage}) => {
        await mainPage.addProductToCart(false);
        expect(await mainPage.getOrdersCountValue()).toBe("1");
        await mainPage.clickCartButton();
        await expect(mainPage.getCartContainer(),`Basket window is not visible`).toBeVisible();
        await expect(mainPage.getCartProductName(mainPage.getCartProductsList())).toBeVisible();
        await expect(mainPage.getCartProductPrice(mainPage.getCartProductsList())).toBeVisible();
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 1 promotion product", async ({mainPage, cartPage}) => {
        await mainPage.addProductToCart(true);
        expect(await mainPage.getOrdersCountValue()).toBe("1");
        await mainPage.clickCartButton();
        await expect(mainPage.getCartContainer(),`Basket window is not visible`).toBeVisible();
        await expect(mainPage.getCartProductName(mainPage.getCartProductsList())).toBeVisible();
        await expect(mainPage.getCartProductPrice(mainPage.getCartProductsList())).toBeVisible();
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 9 different products", async ({mainPage, cartPage}) => {
        await mainPage.addSomeProductsToCart(true, 4);
        await mainPage.addSomeProductsToCart(false, 5);
        expect(await mainPage.getOrdersCountValue()).toBe("9");
        await mainPage.clickCartButton();
        await expect(mainPage.getCartContainer(),`Basket window is not visible`).toBeVisible();
        await expect(mainPage.getCartProductName(mainPage.getCartProductsList())).toBeVisible();
        await expect(mainPage.getCartProductPrice(mainPage.getCartProductsList())).toBeVisible();
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 9 promotion products with the same product name", async ({mainPage, cartPage}) => {
        await mainPage.addSomeProductsToCart(false, 9);
        expect(await mainPage.getOrdersCountValue()).toBe("9");
        await mainPage.clickCartButton();
        await expect(mainPage.getCartContainer(),`Basket window is not visible`).toBeVisible();
        await expect(mainPage.getCartProductName(mainPage.getCartProductsList())).toBeVisible();
        await expect(mainPage.getCartProductPrice(mainPage.getCartProductsList())).toBeVisible();
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });
});