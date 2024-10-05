import {test, expect} from "../pages/pageObjectManager/pageObjectManager";

let orderTotalPrice: number;

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
        await mainPage.isReady();
    });
    // test.afterEach(async ({mainPage}) => {
    //     await mainPage.logOut();
    // });

    test("Move to empty cart", async ({mainPage, cartPage}) => {
        await mainPage.clickCartButton();
        await expect(mainPage.getCartWindow(),`Basket window is not visible`).toBeVisible();
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 1 not promotion product", async ({mainPage, cartPage}) => {
        orderTotalPrice = 0;
        await mainPage.addProductToCartByInputCount(false, 1);
        await mainPage.waitForCounterUpdate();
        await mainPage.clickCartButton();
        await expect(mainPage.getCartWindow(),`Basket window is not visible`).toBeVisible({timeout: 15000});
        for (const order of mainPage.ordersArray) {
            const productCartElement = await mainPage.findProductInCart(order.title);
            const productCartNameElement = await mainPage.productCartNameElement(productCartElement);
            const productCartPriceElement = await mainPage.productCartPriceElement(productCartElement);
            const productCartCountElement = await mainPage.productCartCountElement(productCartElement);
            const productCartPriceValue = await mainPage.productCartPrice(productCartElement);
            const productCartCountValue = await mainPage.productCartCount(productCartElement);
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
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        expect(await mainPage.getCartProductsTotalValue()).toEqual(orderTotalPrice);
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 1 promotion product", async ({mainPage, cartPage}) => {
        orderTotalPrice = 0;
        await mainPage.addProductToCartByInputCount(true, 1);
        await mainPage.waitForCounterUpdate();
        await mainPage.clickCartButton();
        await expect(mainPage.getCartWindow(),`Basket window is not visible`).toBeVisible();
        for (const order of mainPage.ordersArray) {
            const productCartElement = await mainPage.findProductInCart(order.title);
            const productCartNameElement = await mainPage.productCartNameElement(productCartElement);
            const productCartPriceElement = await mainPage.productCartPriceElement(productCartElement);
            const productCartCountElement = await mainPage.productCartCountElement(productCartElement);
            const productCartPriceValue = await mainPage.productCartPrice(productCartElement);
            const productCartCountValue = await mainPage.productCartCount(productCartElement);
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
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        expect(await mainPage.getCartProductsTotalValue()).toEqual(orderTotalPrice);
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 9 different products", async ({mainPage, cartPage}) => {
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
        await mainPage.clickCartButton();
        await expect(mainPage.getCartWindow(),`Basket window is not visible`).toBeVisible();
        for (const order of mainPage.ordersArray) {
            const productCartElement = await mainPage.findProductInCart(order.title);
            const productCartNameElement = await mainPage.productCartNameElement(productCartElement);
            const productCartPriceElement = await mainPage.productCartPriceElement(productCartElement);
            const productCartCountElement = await mainPage.productCartCountElement(productCartElement);
            const productCartPriceValue = await mainPage.productCartPrice(productCartElement);
            const productCartCountValue = await mainPage.productCartCount(productCartElement);
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
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        expect(await mainPage.getCartProductsTotalValue()).toEqual(orderTotalPrice);
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 9 promotion products with the same product name", async ({mainPage, cartPage}) => {
        orderTotalPrice = 0;
        await mainPage.addProductToCartByInputCount(false, 9);
        await mainPage.waitForCounterUpdate();
        await mainPage.clickCartButton();
        await expect(mainPage.getCartWindow(),`Basket window is not visible`).toBeVisible();
        for (const order of mainPage.ordersArray) {
            const productCartElement = await mainPage.findProductInCart(order.title);
            const productCartNameElement = await mainPage.productCartNameElement(productCartElement);
            const productCartPriceElement = await mainPage.productCartPriceElement(productCartElement);
            const productCartCountElement = await mainPage.productCartCountElement(productCartElement);
            const productCartPriceValue = await mainPage.productCartPrice(productCartElement);
            const productCartCountValue = await mainPage.productCartCount(productCartElement);
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
        await expect(mainPage.getCartTotalPrice()).toBeVisible();
        expect(await mainPage.getCartProductsTotalValue()).toEqual(orderTotalPrice);
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });
});