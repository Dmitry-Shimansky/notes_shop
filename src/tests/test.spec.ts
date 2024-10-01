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

    test.only("Move to empty cart", async ({mainPage, cartPage}) => {
        await mainPage.clickCartButton();
        await expect(mainPage.getCartContainer()).toBeVisible();
        await mainPage.clickMoveToCartButton();
        await cartPage.isReady();
    });

    test("Move to cart with 1 not promotion product", async () => {});

    test("Move to cart with 1 promotion product", async () => {});

    test("Move to cart with 9 different products", async () => {});

    test("Move to cart with 9 promotion products with the same product name", async () => {});
});