import {test as base} from "@playwright/test";
import {LoginPage} from "../loginPage";
import {MainPage} from "../mainPage";
import {CartPage} from "../cartPage";
import {CartPopUpPage} from "../cartPopUpPage";

type pageObjects = {
    loginPage: LoginPage;
    mainPage: MainPage;
    cartPage: CartPage;
    cartPopUpPage: CartPopUpPage;
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
    },
    cartPopUpPage: async ({page}, use) => {
        const cartPopUpPage = new CartPopUpPage(page);
        await use(cartPopUpPage);
    }
});

export const expect = test.expect;