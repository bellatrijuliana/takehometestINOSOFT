import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItemName: Locator;
  readonly cartItemQty: Locator;
  readonly cartItemPrice: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItemName = page.locator('#product'); 
    this.cartItemQty = page.locator('label.ng-binding').filter({ hasText: 'QTY' })
    this.cartItemPrice = page.locator('.price'); 
    this.cartTotal = page.locator('.cart-total');
    this.checkoutButton = page.locator('button:has-text("CHECKOUT")'); 
    this.emptyCartLabel = page.locator('#shoppingCart .bigEmptyCart').getByText(/your shopping cart is empty/i);
  }

  async goto() {
    await this.page.goto('https://advantageonlineshopping.com/#/shoppingCart');
    await this.page.waitForLoadState('networkidle');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}