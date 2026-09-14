import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  
  // Shipping step
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneNumberInput: Locator;
  //readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly addressInput: Locator;
  readonly postalCodeInput: Locator;
  readonly stateInput: Locator;
  readonly nextButton: Locator;

  // Payment method selection
  readonly mastercreditOption: Locator;
  readonly safepayOption: Locator;

  // Mastercredit fields
  readonly editMasterCredit: Locator;
  readonly cardNumberInput: Locator;
  readonly cvvInput: Locator;
  readonly monthExpiryInput: Locator;
  readonly yearExpiryInput: Locator;
  readonly cardHolderNameInput: Locator;
  readonly payNowMasterCreditBtn: Locator;

  // Safepay fields
  readonly safepayUsernameInput: Locator;
  readonly safepayPasswordInput: Locator;
  readonly payNowSafePay: Locator;
  readonly loaderSafePay: Locator;

  readonly orderConfirmationMessage: Locator;
  readonly orderNumber: Locator;
  readonly trackingNumber: Locator;
  readonly invalidInputs: Locator;
  readonly paymentErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[name="first_name"]');
    this.lastNameInput = page.locator('[name="last_name"]'); 
    this.phoneNumberInput = page.locator('[name="phone_number"]'); 
    //this.countryInput = page.locator('[name="countryListBox"]');
    this.cityInput = page.locator('[name="city"]');
    this.addressInput = page.locator('[name="address"]');
    this.postalCodeInput = page.locator('[name="postal_code"]');
    this.stateInput = page.locator('[name="state_/_province_/_region"]');
    this.nextButton = page.locator('sec-sender button#next_btn');

    this.mastercreditOption = page.locator('[name="masterCredit"]');
    this.safepayOption = page.locator('[name="safepay"]'); 

    this.editMasterCredit = page.locator('label[data-ng-click="toggleShowMasterCart()"]')
    this.cardNumberInput = page.locator('[name="card_number"]'); 
    this.cvvInput = page.locator('[name="cvv_number"]'); 
    this.monthExpiryInput = page.locator('[name="mmListbox"]');
    this.yearExpiryInput = page.locator('[name="yyyyListbox"]');
    this.cardHolderNameInput = page.locator('[name="cardholder_name"]');
    this.payNowMasterCreditBtn = page.locator('#pay_now_btn_MasterCredit');

    this.safepayUsernameInput = page.locator('[name="safepay_username"]');
    this.safepayPasswordInput = page.locator('[name="safepay_password"]'); 
    this.payNowSafePay = page.locator('#pay_now_btn_SAFEPAY')
    this.loaderSafePay = page.locator('.loader').first();

    this.orderConfirmationMessage = page.locator('#orderPaymentSuccess');
    this.orderNumber = page.locator('#orderNumberLabel'); 
    this.trackingNumber = page.locator('#trackingNumberLabel'); 

    this.invalidInputs = page.locator('input.ng-invalid, select.ng-invalid');
    this.paymentErrorMessage = page.locator('#safepayErrorMessage, .invalid');
  }

  async fillShippingDetails(firstName: string, lastName: string, phone: string, country: string, city: string, address: string, postalCode: string, state: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.phoneNumberInput.fill(phone);
    //await this.countryInput.selectOption(country);
    await this.cityInput.fill(city);
    await this.addressInput.fill(address);
    await this.postalCodeInput.fill(postalCode);
    await this.stateInput.fill(state);

    await this.nextButton.click();
  }

  async payWithMasterCredit(cardNumber: string = '4123123412341234',
    cvv: string = '123',
    month: string = '01',
    year: string = '2028',
    cardHolderName: string = 'Julia Lia') {
    await this.mastercreditOption.click();
    //await this.editMasterCredit.click();
    //await this.cardNumberInput.fill(cardNumber);
   // await this.cvvInput.fill(cvv);
   // await this.monthExpiryInput.selectOption(month);
   // await this.yearExpiryInput.selectOption(year);
   // await this.cardHolderNameInput.fill(cardHolderName);

    await this.payNowMasterCreditBtn.click();

    if (await this.editMasterCredit.isVisible()) {
      await this.editMasterCredit.click();
    }

    await this.cardNumberInput.fill(cardNumber);
    await this.cvvInput.fill(cvv);

    // Pilih option jika nilai dipassing
    if (month) await this.monthExpiryInput.selectOption(month);
    if (year) await this.yearExpiryInput.selectOption(year);
    
    await this.cardHolderNameInput.fill(cardHolderName);

    await this.payNowMasterCreditBtn.scrollIntoViewIfNeeded();
    await this.payNowMasterCreditBtn.click({ force: true });
  }

  async payWithSafepay(username: string, password: string) {
    await this.safepayOption.check();
    await this.safepayUsernameInput.fill(username);
    await this.safepayPasswordInput.fill(password);
    await this.page.waitForTimeout(500);
    await this.payNowSafePay.scrollIntoViewIfNeeded();
    await this.payNowSafePay.click({force:true});
    await this.page.waitForLoadState('networkidle');
    
    if (await this.payNowSafePay.isEnabled()) {
      await this.payNowSafePay.click({ force: true });
      await this.page.waitForLoadState('networkidle');

  }
}
}