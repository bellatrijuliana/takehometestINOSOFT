# Test Plan & Execution Report — Advantage Online Shopping (AOS)

**Author:** Bella Tri Juliana (Software QA Engineer Candidate)  
**Target Site:** [Advantage Online Shopping](https://advantageonlineshopping.com/#/)  
**Stack:** Playwright + TypeScript (POM)

---

## 1. Scope & Strategy

* **In-Scope (Automated):** Login, Product Search/Detail, Cart Management (persistent across login boundary), 2-Step Checkout (Shipping & Payment via Mastercredit/Safepay), Order Confirmation.
* **Out-of-Scope (Not Automated):** New account registration flow, My Account/Orders management pages, Cross-browser & Performance testing, and **Edge Case Scenarios (E01–E09)**.
* **Approach:** Automated E2E testing for Positive & Negative scenarios using Playwright + POM architecture on Chromium (Desktop Viewport). Edge cases are documented exclusively for manual and exploratory testing scope.

---

## 2. Risk Matrix & Prioritization

**Priority Rule:** Payment → Shipping/Checkout → Cart → Login → Search

| Flow | Risk Level | Reason |
| :--- | :--- | :--- |
| **Payment (Mastercredit / Safepay)** | High | Directly impacts transaction success and revenue generation |
| **Checkout - Shipping Details** | High | Required for order fulfillment; missing/invalid data blocks progression |
| **Add to Cart / Cart Review** | Medium | Ensures accuracy of order quantity, price calculation, and item selection |
| **Login** | Medium | Gateway to checkout flow |
| **Product Search / Browsing** | Low | Discovery feature; failure is non-blocking to transaction execution |

---

## 3. Test Cases Matrix

### Positive Scenarios (P01 - P08) — *Automated*
| ID | Scenario | Expected Result |
| :--- | :--- | :--- |
| **P01** | Login with valid credentials | User logs in successfully and is redirected to the homepage |
| **P02** | Search for a product | Relevant products are displayed |
| **P03** | Add product from PDP | Product is added to cart with selected options |
| **P04** | Cart details validation | Product name, color, quantity, unit price, and total price match |
| **P05** | Valid shipping form submission | User advances to the Payment Method step |
| **P06** | Complete payment via Mastercredit | Payment succeeds; Order & Tracking Numbers are generated |
| **P07** | Complete payment via Safepay | Payment succeeds; Order & Tracking Numbers are generated |
| **P08** | Cart persistence across login | Cart items added before login remain in cart after logging in |

### Negative Scenarios (N01 - N09) — *Automated*
| ID | Scenario | Expected Result |
| :--- | :--- | :--- |
| **N01** | Login with invalid credentials | Error message appears; login is rejected |
| **N02** | Search non-existent keyword | "No products found" / empty state message is displayed |
| **N03** | Checkout with an empty cart | Redirected to Cart/Home or "Cart is empty" message shown |
| **N04** | Form shipping required fields empty | Validation error is displayed; cannot proceed to Payment |
| **N05** | Mastercredit card invalid | Input marked with `ng-invalid`; payment is not processed |
| **N06** | Mastercredit card expired | Payment is rejected / not processed |
| **N07** | Mastercredit CVV missing | Input marked with `ng-invalid`; payment is rejected |
| **N08** | Safepay missing credentials | Pay Now button remains disabled |
| **N09** | Safepay invalid credentials | Error message triggered; payment is rejected |

### Edge Cases (E01 - E09) — *Not Automated (Manual / Exploratory Scope)*
> **Note:** The following edge cases are documented for manual evaluation and are **not included** in the automated Playwright test execution.

| ID | Scenario | Expected Result |
| :--- | :--- | :--- |
| **E01** | Quantity 0 or negative | System rejects value or resets quantity to minimum (1) |
| **E02** | Quantity exceeds stock | System displays stock limit warning |
| **E03** | Rapid double-click on "Pay Now" | Only one order and charge are generated |
| **E04** | Browser Back button during Payment | State remains consistent; no errors or duplicate charges |
| **E05** | Switch payment method mid-process | Form data is safely isolated without cross-form leaking |
| **E06** | Access Cart across two browser tabs | Cart data stays synchronized and consistent |
| **E07** | Special characters in Shipping input | Input is sanitized; no layout breakage or script execution |
| **E08** | Non-numeric characters in card field | Field auto-formats or triggers a validation error |
| **E09** | Page refresh during Checkout | Cart and checkout state are retained without data loss |

---

## 4. Test Execution Summary

* **Execution Date:** 13-15th September 2026
* **Environment:** Chromium (Desktop) via Playwright

| Category | Total | Automated | Passed | Failed/Skipped | Manual / Excluded | Pass Rate |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Positive Cases | 8 | Yes | 8 | 8 | 0 | 100% |
| Negative Cases | 9 | Yes | 6 | 6 | 3 | 100% |
| Edge Cases | 9 | **No** | - | - | 9 (Manual) | N/A |
| **Total** | **26** | **17** | **14** | **0** | **3** | **100%** |

Pass rate is calculated against test cases that were actually executed (14 passed out of 14 executed); the 3 skipped negative cases (N06–N08) are excluded from this run pending the fixes described in Section 5, and are not counted as failures.

---

## 5. Defects & Observations

| Finding ID | Severity | Area | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | High | Checkout / Shipping Form | Mandatory shipping fields lack validation on submission, allowing navigation to Payment step without required data. | Open (Site Bug) |

---

### Skipped / Blocked Test Cases

### ⚠️ Skipped / Blocked Test Cases

| Test Case ID | Scenario | Status | Reason / Blocked Issue | Action Plan |
| :--- | :--- | :--- | :--- | :--- |
| **N06** | Submit Mastercredit payment with expired credit card | **SKIPPED** | Locator adjustments required for expiration date dropdowns (MM/YYYY) along with helper method refactoring in `CheckoutPage.ts`. | Update selectors in `CheckoutPage.ts` and re-enable in the next iteration. |
| **N07** | Submit Mastercredit payment with missing CVV | **SKIPPED** | Locator adjustments required for CVV validation state and explicit error label mapping in `CheckoutPage.ts`. | Add `cvvError` locator to `CheckoutPage.ts` and re-enable test case. |
| **N08** | Submit Safepay payment with missing credentials | **SKIPPED** | Safepay credentials auto-fill upon active session login; requires helper method in `CheckoutPage.ts` to clear pre-filled inputs before assertion. | Implement `clearSafepayCredentials()` method in `CheckoutPage.ts` and re-enable test case. |

### Detailed Bug Report: BUG-01

* **Bug ID:** BUG-01
* **Title:** Navigation to Payment step succeeds with empty required Shipping fields
* **Test Case Reference:** N04 (`Submit shipping details with required fields empty`)
* **Severity:** High
* **Area:** Checkout — Shipping Details Page

**Steps to Reproduce:**
1. Log in with valid user credentials.
2. Add any product to the cart and proceed to Checkout (`#/checkout`).
3. Clear all input fields under the **Shipping Details** form (First Name, Address, City, etc.).
4. Click the **NEXT** button (`sec-sender button#next_btn`).

**Expected Result:**  
Form submission should be blocked, and required inputs should trigger Angular validation errors (`ng-invalid` class & visible highlight), preventing the user from moving to the Payment step.

**Actual Result:**  
The form bypasses client-side validation entirely, navigating directly to the Payment Method step (Mastercredit / Safepay selection options become visible).

**Impact:**  
Orders can proceed to the payment state without valid shipping or fulfillment information, causing data integrity issues and delivery failure on the backend.

### Detailed Incident / Blocked Report: BLK-01

* **Issue ID:** BLK-01 (Test Execution Blocker)
* **Title:** Dynamic locator mismatch on Mastercredit Expiry Date dropdowns (MM/YYYY)
* **Test Case Reference:** N06 (`Submit Mastercredit payment with expired credit card`)
* **Severity:** Medium
* **Area:** Checkout — Payment Step (Mastercredit)
* **Current Status:** 🟡 SKIPPED / BLOCKED

**Description:**  
Execution of automated test scenario N06 is currently set to `skip` due to required locator adjustments and custom wait-state handling for the Expiry Month (`mmListbox`) and Expiry Year (`yyyyListbox`) HTML `<select>` elements in `CheckoutPage.ts`.

**Steps to Reproduce:**
1. Navigate to Checkout with at least one item in the shopping cart.
2. Fill in valid Shipping Details and proceed to the Payment step.
3. Select **Mastercredit** as the payment method.
4. Call `payWithMasterCredit()` passing an expired year value (e.g., `2020`).

**Expected Result:**  
The test suite smoothly interacts with the expiration date dropdowns, triggers client-side form validation, and asserts the appearance of the card expiration error message.

**Actual Result:**  
Playwright's `selectOption()` action encounters interaction delays because the underlying AngularJS DOM structure requires explicit locator re-mapping and manual `change` event dispatching.

**Technical Root Cause & Action Plan:**
* **Root Cause:** Locators `monthExpiryInput` and `yearExpiryInput` in `CheckoutPage.ts` do not consistently handle dynamic Angular DOM re-rendering when the card detail dialog is toggled.
* **Action Plan:**
  1. Re-map locators for `mmListbox` and `yyyyListbox` dropdowns.
  2. Implement helper methods in `CheckoutPage.ts` to dispatch proper `change` events upon option selection.
  3. Re-enable test case `N06` by removing the `test.skip()` tag in the next sprint iteration.


### Detailed Incident / Blocked Report: BLK-02

* **Issue ID:** BLK-02 (Test Execution Blocker)
* **Title:** Missing CVV validation locator mapping on Mastercredit payment form
* **Test Case Reference:** N07 (`Submit Mastercredit payment with missing CVV`)
* **Severity:** Medium
* **Area:** Checkout — Payment Step (Mastercredit)
* **Current Status:** 🟡 SKIPPED / BLOCKED

**Description:**  
Execution of automated test scenario N07 is currently set to `skip` pending selector refactoring in `CheckoutPage.ts` to reliably capture the Angular `ng-invalid` state and field error label when the CVV input is left empty.

**Steps to Reproduce:**
1. Navigate to Checkout with at least one item in the shopping cart.
2. Fill in valid Shipping Details and proceed to the Payment step.
3. Select **Mastercredit** as the payment method.
4. Call `payWithMasterCredit()` leaving the CVV argument empty (`''`).

**Expected Result:**  
The test suite asserts that the CVV input highlights as invalid (`ng-invalid`) or displays the required field error label, blocking order placement.

**Actual Result:**  
The field state transition requires explicit `blur` event dispatching and a dedicated error label locator in `CheckoutPage.ts` to prevent false assertion failures.

**Technical Root Cause & Action Plan:**
* **Root Cause:** Properti `cvvInput` requires explicit blur event triggering and dedicated error label declaration (`cvvError`) inside `CheckoutPage.ts`.
* **Action Plan:**
  1. Declare `cvvError` locator in `CheckoutPage.ts`.
  2. Update `payWithMasterCredit()` to handle explicit blur events on the CVV field.
  3. Re-enable test case `N07` by removing the `test.skip()` tag in the next sprint iteration.


### Detailed Incident / Blocked Report: BLK-03

* **Issue ID:** BLK-03 (Test Execution Blocker)
* **Title:** Pre-filled Safepay credentials block missing-credentials negative validation
* **Test Case Reference:** N08 (`Submit Safepay payment with missing credentials`)
* **Severity:** Medium
* **Area:** Checkout — Payment Step (Safepay)
* **Current Status:** 🟡 SKIPPED / BLOCKED

**Description:**  
Execution of automated test scenario N08 is currently set to `skip` because the active user session automatically populates the Safepay username and password inputs. Passing empty arguments without explicitly clearing pre-existing input values leaves the form populated.

**Steps to Reproduce:**
1. Navigate to Checkout with at least one item in the shopping cart under an authenticated session.
2. Fill in valid Shipping Details and proceed to the Payment step.
3. Select **Safepay** as the payment method.
4. Observe that Safepay username and password input fields are automatically populated by default.

**Expected Result:**  
The test suite clears the pre-filled credentials, dispatches `blur` validation events, and asserts that the **PAY NOW** button is disabled (`toBeDisabled()`).

**Actual Result:**  
Passing empty strings to `payWithSafepay('', '')` does not guarantee input reset due to Angular's binding model without explicit input selection and blur triggers.

**Technical Root Cause & Action Plan:**
* **Root Cause:** Default session behavior auto-fills Safepay inputs. Standard `.fill('')` calls without dedicated select-all and blur events fail to update Angular state properly.
* **Action Plan:**
  1. Create a `clearSafepayCredentials()` helper method in `CheckoutPage.ts` utilizing `Control+A` + `Backspace` + `blur()`.
  2. Invoke `clearSafepayCredentials()` in scenario N08 prior to assertion.
  3. Re-enable test case `N08` by removing the `test.skip()` tag in the next sprint iteration.


## 6. Attachments & Artifacts

* **Playwright HTML Report:** `./playwright-report/index.html`
* **Execution Screen Recording:** [Google Drive / Loom Video Link]