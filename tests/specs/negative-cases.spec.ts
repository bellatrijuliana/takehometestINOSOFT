import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Negative Test Suite - Advantage Online Shopping', () => {

  async function setupCheckout(page: any) {
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
  }

  test('N01 - Login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.openLoginPopUp();
    await loginPage.login('invalidUser_99', 'WrongPassword123!');

    await expect(loginPage.signInErrorMessage).toBeVisible();
    await expect(loginPage.signInErrorMessage).toContainText('Incorrect user name or password');
  });

test('N02 - Search with a term matching no products', async ({ page }) => {
  const productPage = new ProductPage(page);

  await productPage.goto();
  await productPage.productSearch('nonexistentitem123456');

  await expect(productPage.noResultsMessage).toBeVisible();
  await expect(productPage.noResultsMessage).toContainText('No results for');
});

test('N03 - Proceed to checkout with an empty cart', async ({ page }) => {
  const cartPage = new CartPage(page);

  await cartPage.goto();

  await expect(cartPage.emptyCartLabel).toBeVisible({ timeout: 15000 });
  await expect(cartPage.emptyCartLabel).toContainText(/your shopping cart is empty/i);
});


async function navigateToCheckout(
    page: Page,
    loginPage: LoginPage,
    productPage: ProductPage,
    cartPage: CartPage
  ) {
    await loginPage.goto();
    await loginPage.openLoginPopUp();
    await loginPage.login('bella','Yopmail!@#1');

    await productPage.goto();
    await productPage.productSearch('tablets');
    await productPage.openFirstProduct();
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.proceedToCheckout();
  }

test('N04 - Submit shipping details with required fields empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await navigateToCheckout(page, loginPage, productPage, cartPage);

    await checkoutPage.fillShippingDetails('', '', '', '', '', '', '', '');
    await checkoutPage.clearShippingDetails();
    await checkoutPage.nextButton.click();

    await expect(checkoutPage.invalidInputs.first()).toBeVisible();
    await expect(checkoutPage.mastercreditOption).not.toBeVisible();
  });

test('N05 - Submit Mastercredit payment with invalid card number', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await navigateToCheckout(page, loginPage, productPage, cartPage);
  await checkoutPage.fillShippingDetails('Julia', 'Lia', '081234567890', 'United States', 'Amsterdam', 'XII Roman', '223', 'USA');

  await checkoutPage.payWithMasterCredit('12345', '123', '01', '2028', 'Julia Lia');

  await expect(checkoutPage.cardNumberError).toBeVisible();
  await expect(checkoutPage.cardNumberError).toHaveText('Card number field is required');
});

test.skip('N06 - Submit Mastercredit payment with expired card date', async ({ page }) => {
// TODO: Refactor the MM/YYYY locator in CheckoutPage.ts before enabling this test    
  const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await navigateToCheckout(page, loginPage, productPage, cartPage);
    await checkoutPage.fillShippingDetails('Julia', 'Lia', '081234567890', 'United States', 'Amsterdam', 'XII Roman', '223', 'USA');

    await checkoutPage.payWithMasterCredit('4123123412341234', '123', '01', '2020', 'Julia Lia');

    await expect(checkoutPage.orderConfirmationMessage).not.toBeVisible();
  });

test.skip('N07 - Submit Mastercredit payment with missing CVV', async ({ page }) => {
// TODO (BLK-02): Add cvvError locator and handle CVV blur event in CheckoutPage.ts before re-enabling  
  const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await navigateToCheckout(page, loginPage, productPage, cartPage);
    await checkoutPage.fillShippingDetails('Julia', 'Lia', '081234567890', 'United States', 'Amsterdam', 'XII Roman', '223', 'USA');

    await checkoutPage.payWithMasterCredit('4123123412341234', '', '01', '2028', 'Julia Lia');

    await expect(checkoutPage.cvvInput).toHaveClass(/ng-invalid/);
    await expect(checkoutPage.orderConfirmationMessage).not.toBeVisible();
  });

test.skip('N08 - Submit Safepay payment with missing credentials', async ({ page }) => {
// TODO (BLK-03): Add clearSafepayCredentials() helper in CheckoutPage.ts to clear auto-filled session data before re-enabling  
  const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await navigateToCheckout(page, loginPage, productPage, cartPage);
    await checkoutPage.fillShippingDetails('Julia', 'Lia', '081234567890', 'United States', 'Amsterdam', 'XII Roman', '223', 'USA');

    await checkoutPage.payWithSafepay('', '');

    await expect(checkoutPage.payNowSafePay).toBeDisabled();
    await expect(checkoutPage.orderConfirmationMessage).not.toBeVisible();
  });

test('N09 - Submit Safepay payment with incorrect credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await navigateToCheckout(page, loginPage, productPage, cartPage);
    await checkoutPage.fillShippingDetails('Julia', 'Lia', '081234567890', 'United States', 'Amsterdam', 'XII Roman', '223', 'USA');
    await checkoutPage.payWithSafepay('wrongSafepayUser', 'WrongPass123!');

    await expect(checkoutPage.orderConfirmationMessage).not.toBeVisible();
  });

});