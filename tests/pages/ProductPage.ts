import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly menuSearch: Locator;
  readonly searchInput: Locator;
  readonly searchOutput: Locator;
  readonly firstProductResult: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartCount: Locator;
  readonly cartPopup: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuSearch = page.locator('#menuSearch:not(#mobileSearch #menuSearch)');
    this.searchInput = page.locator('#autoComplete');
    this.searchOutput = page.locator('.product.ng-scope');
    this.firstProductResult = page.locator('li[ng-click*="/product/"]').first();
    this.quantityInput = page.locator('[name="quantity"]');
    this.addToCartButton = page.locator('[name="save_to_cart"]');
    this.cartCount = page.locator('#shoppingCartLink .cart');
    this.cartPopup = page.locator('table[ng-show*="cart.productsInCart"]');
    this.noResultsMessage = page.locator('.noPromotedProductDiv');
  }

  async goto() {
    await this.page.goto('https://advantageonlineshopping.com/#/');
  }

  async productSearch(typeProduct: string) {
    await this.menuSearch.click();
    await this.searchInput.fill(typeProduct);
    await this.searchInput.press('Enter');
  }

  async openFirstProduct() {
    await this.firstProductResult.click();
  }

  async selectColor(colorName: string) {
    await this.page.locator(`[title="${colorName}"]`).click();
  }

  async setQuantity(quantity: string) {
    await this.quantityInput.fill(quantity);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}