import {test, expect} from "../pages/pageObjectManager/pageObjectManager";

test.describe("Cart", async () => {
    test.beforeEach(async ({loginPage, mainPage}) => {
        await loginPage.goToLoginPage();
        await loginPage.isReady();
        await loginPage.login("test", "test");
        await mainPage.isReady();
    });
    test.afterEach(async ({mainPage}) => {
        await mainPage.logOut();
    });

    test.only("Move to empty cart", async ({mainPage}) => {
        console.log(await mainPage.getOrdersCountValue());
    });

    test("Move to cart with 1 not promotion product", async () => {});

    test("Move to cart with 1 promotion product", async () => {});

    test("Move to cart with 9 different products", async () => {});

    test("Move to cart with 9 promotion products with the same product name", async () => {});
});