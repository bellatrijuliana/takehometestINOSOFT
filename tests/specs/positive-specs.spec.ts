import { test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Positive Test Cases - Advantage Shopping', () => {

test('P01 - Login with Valid Credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.openLoginPopUp();
  await loginPage.login('bella','Yopmail!@#1');

  await expect(page).toHaveURL('https://advantageonlineshopping.com/#/');
  await expect(loginPage.loginModal).toBeHidden();
  await expect(loginPage.menuUserIcon).toBeVisible();
});

test('P02 - Search for a product and view results', async ({ page }) => {
  const productPage = new ProductPage(page);

  await productPage.goto();
  await productPage.productSearch('tablets');

  await expect(page).toHaveURL(/search/);
  await expect(productPage.searchOutput).toBeVisible();
});

test('P03 - Add a product to cart from product detail page', async ({ page }) => {
  const productPage = new ProductPage(page);

  await productPage.goto();
  await productPage.productSearch('tablets');
  await productPage.openFirstProduct();
  await productPage.selectColor('GRAY');
  await productPage.setQuantity('1');
  await productPage.addToCart();

  await expect(productPage.cartCount).toHaveText('1');
  await expect(productPage.cartPopup).toContainText(/tablet/i);
});

test('P04 - Cart reflects correct product info and total', async ({ page }) => {
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await productPage.goto();
  await productPage.productSearch('tablets');
  await productPage.openFirstProduct();
  await productPage.selectColor('GRAY');
  await productPage.addToCart();

  await cartPage.goto();
  await expect(cartPage.cartItemName).toContainText(/tablet/i);
  await expect(cartPage.cartTotal).not.toBeEmpty();
});


test('P05 - Proceed to checkout and submit valid shipping details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.openLoginPopUp();
  await loginPage.login('bella','Yopmail!@#1');

  await productPage.goto();
  await productPage.productSearch('tablets');
  await productPage.openFirstProduct();
  await productPage.selectColor('GRAY');
  await productPage.addToCart();

  await cartPage.goto();
  await cartPage.proceedToCheckout();
  await checkoutPage.fillShippingDetails('Julia', 'Lia', '081234567890', 'United States', 'Amsterdam', 'XII Roman', '223', 'USA');

  await expect(checkoutPage.mastercreditOption).toBeVisible();
});

test('P06 - Complete payment with Mastercredit', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.openLoginPopUp();
  await loginPage.login('bella','Yopmail!@#1');

  await productPage.goto();
  await productPage.productSearch('speakers');
  await productPage.openFirstProduct();
  await productPage.selectColor('GRAY');
  await productPage.addToCart();

  await cartPage.goto();
  await cartPage.proceedToCheckout();
  await checkoutPage.fillShippingDetails('Julia', 'Lia', '081234567890', 'United States', 'Amsterdam', 'XII Roman', '223', 'USA');
  await checkoutPage.payWithMasterCredit();

  await expect(checkoutPage.payNowSafePay).toBeEnabled();
  await expect(checkoutPage.orderConfirmationMessage).toBeAttached({timeout: 15000});
  await expect(checkoutPage.orderConfirmationMessage).toContainText('Thank you for buying with Advantage', { timeout: 15000 });
  await expect(checkoutPage.orderConfirmationMessage).toContainText('Your order number is');
  await expect(checkoutPage.orderConfirmationMessage).toContainText('Your tracking number is');
});

test('P07 - Complete payment with Safepay', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.openLoginPopUp();
  await loginPage.login('bella','Yopmail!@#1');

  await productPage.goto();
  await productPage.productSearch('speakers');
  await productPage.openFirstProduct();
  await productPage.selectColor('GRAY');
  await productPage.addToCart();

  await cartPage.goto();
  await cartPage.proceedToCheckout();
  await checkoutPage.fillShippingDetails('Julia', 'Lia', '081234567890', 'United States', 'Amsterdam', 'XII Roman', '223', 'USA');
  await checkoutPage.payWithSafepay('bella', 'Yopmail!@#1');

  await expect(checkoutPage.payNowSafePay).toBeEnabled();
  await expect(checkoutPage.orderConfirmationMessage).toBeAttached({timeout: 15000});
  await expect(checkoutPage.orderConfirmationMessage).toContainText('Thank you for buying with Advantage', { timeout: 15000 });
  await expect(checkoutPage.orderConfirmationMessage).toContainText('Your order number is');
  await expect(checkoutPage.orderConfirmationMessage).toContainText('Your tracking number is');
  
});

test('P08 - Cart persists across login boundary', async ({ page }) => {
  const productPage = new ProductPage(page);
  const loginPage = new LoginPage(page);

  await productPage.goto();
  await productPage.productSearch('tablets');
  await productPage.openFirstProduct();
  await productPage.selectColor('GRAY');
  await productPage.addToCart();

  await expect(productPage.cartCount).toHaveText('1');

  await loginPage.openLoginPopUp();
  await loginPage.login('bella', 'Yopmail!@#1');

  await expect(productPage.cartCount).toHaveText('1');
});

});