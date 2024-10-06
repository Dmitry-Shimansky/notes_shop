import {test, expect} from "../../pages/pageObjectManager/pageObjectManager";

test.describe('Preconditions', async () => {
    test('Login and reset orders', async ({loginPage, mainPage}) => {
        await loginPage.goToLoginPage();
        await loginPage.isReady();
        await loginPage.login("test", "test");
        await mainPage.isReady();
    })
});