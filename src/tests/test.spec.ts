import {test, expect} from "../pages/pageObjectManager/pageObjectManager";

let orderTotalPrice = 0;

test.describe("Cart", async () => {
    // test.beforeAll(async ({loginPage, mainPage}) => {
    //     await loginPage.goToLoginPage();
    //     await loginPage.isReady();
    //     await loginPage.login("test", "test");
    //     await mainPage.isReady();
    // })
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

    test.only("Move to cart with 1 not promotion product", async ({mainPage, cartPage}) => {
        await mainPage.addProductToCartByInputCount(false, 1);
        await mainPage.waitForCounterUpdate();
        // expect(await mainPage.getOrdersCountValue()).toBe("1");
        await mainPage.clickCartButton();
        await expect(mainPage.getCartContainer(),`Basket window is not visible`).toBeVisible();
        for (const order of mainPage.ordersArray) {
            const productCart = await mainPage.findProductInCart(order.title);
            const productCartPrice = await mainPage.productCartPrice(productCart);
            const productCartCount = await mainPage.productCartCount(productCart);
            expect(productCartPrice).toEqual(order.total);
            expect(productCartCount).toEqual(order.count);
            orderTotalPrice += order.total
        }
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        expect(await mainPage.getCartProductsTotalValue()).toEqual(orderTotalPrice);
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