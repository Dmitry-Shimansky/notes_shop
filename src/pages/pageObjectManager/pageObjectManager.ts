import {test as base} from "@playwright/test";
import {LoginPage} from "../loginPage";
import {MainPage} from "../mainPage";
import {CartPage} from "../cartPage";

type pageObjects = {
    loginPage: LoginPage;
    mainPage: MainPage;
    cartPage: CartPage;
};

export const test = base.extend<pageObjects>({
    loginPage: async ({page}, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    mainPage: async ({page}, use) => {
        const mainPage = new MainPage(page);
        await use(mainPage);
    },
    cartPage: async ({page}, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    }
});

export const expect = test.expect;