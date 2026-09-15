import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  
  readonly menuUserIcon: Locator;
  readonly loginModal: Locator;
  readonly username: Locator;
  readonly password: Locator;
  //readonly rememberMe: Locator;
  readonly signInButton: Locator;
  readonly signInErrorMessage: Locator;


  constructor(page: Page) {
    this.page = page;
    this.menuUserIcon = page.locator('#menuUserLink');
    this.loginModal = page.locator('.PopUp');
    this.username = page.locator('[name="username"]');
    this.password = page.locator('[name="password"]');
    //this.rememberMe = page.locator('[name="REMEMBER_ME"]');
    this.signInButton = page.locator('#sign_in_btn');
    this.signInErrorMessage = page.locator('#signInResultMessage');
  }

  async goto() {
    await this.page.goto('https://advantageonlineshopping.com/#/');
  }

  async openLoginPopUp() {
    await this.menuUserIcon.click();
  }

  async login(username: string, password:string) {
    await this.username.fill(username);
    await this.password.fill(password);
    //await this.rememberMe.check();
    await this.signInButton.click();
  }
}