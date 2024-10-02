import {Page, Locator, expect} from "@playwright/test";

export class LoginPage {
    private readonly baseElement: string;

    constructor(public readonly page: Page) {
        this.baseElement = '[id="login-form"]';
    }

    getUserName():Locator {
        return this.page.locator(`${this.baseElement} input[id="loginform-username"]`);
    }
    getPassword():Locator {
        return this.page.locator(`${this.baseElement} input[id="loginform-password"]`);
    }
    getLoginBtn():Locator {
        return this.page.locator(`${this.baseElement} button[name="login-button"]`);
    }
    getLogInPanel():Locator {
        return this.page.locator(`${this.baseElement}`);
    }

    public async goToLoginPage(): Promise<void> {
        await this.page.goto('/login');
    }

    public async login(userName: string, password: string):Promise<void> {
        await this.getUserName().pressSequentially(userName);
        await this.getPassword().pressSequentially(password);
        await this.getLoginBtn().click();
    }

    public async isReady()  {
        return expect(this.getLogInPanel(), "Login page is not visible").toBeVisible();
    }
}