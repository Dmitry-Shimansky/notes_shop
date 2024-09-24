import {test as base} from "@playwright/test";
import {LoginPage} from "../loginPage";

type pageObjects = {
    loginPage: LoginPage;
};

export const test = base.extend<pageObjects>({
    loginPage: async ({page}, use) => {
        const loginPage = new LoginPage(page);
        use(loginPage);
    }
})