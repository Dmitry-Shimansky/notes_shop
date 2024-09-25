import {test as base} from "@playwright/test";
import {LoginPage} from "../loginPage";
import {MainPage} from "../mainPage";

type pageObjects = {
    loginPage: LoginPage;
    mainPage: MainPage;
};

export const test = base.extend<pageObjects>({
    loginPage: async ({page}, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    mainPage: async ({page}, use) => {
        const mainPage = new MainPage(page);
        await use(mainPage);
    }
});

export const expect = test.expect;