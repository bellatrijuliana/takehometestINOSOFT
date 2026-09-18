# takehometestINOSOFT
This repository was created to complete a take-home test as part of the recruitment process for the Software QA Engineer position at PT. Inosoft Trans Sistem.
Among the 3 provided web application options for this assignment, **Advantage Online Shopping (AOS)** (`https://advantageonlineshopping.com/#/`) was selected as the target platform for this end-to-end automation suite.

# Advantage Online Shopping (AOS) — Playwright E2E Automation Suite

An end-to-end (E2E) automated testing framework built with **Playwright**, **TypeScript**, and **Page Object Model (POM)** for the Advantage Online Shopping application.

---

## 📌 Project Overview
This repository contains a test automation suite designed to validate core purchase flows and form validation logic:
- **Positive Test Cases (P01–P08):** Authentication, product search, cart persistence across login, shipping details submission, and successful payments via Mastercredit & Safepay.
- **Negative Test Cases (N01–N09):** Handling of invalid logins, empty shipping fields, malformed card numbers, expired credit cards, missing CVV, and invalid Safepay credentials.
- **Test Plan & Execution Report:** Detailed test matrix, risk assessment, and execution metrics are documented in [`TEST_PLAN.md`](./TEST_PLAN.md).

---

## 🌐 Target Application Selection
Among the 3 provided web application options for this assignment, **Advantage Online Shopping (AOS)** (`https://advantageonlineshopping.com/#/`) was selected as the target platform for this end-to-end automation suite.

---

## 🛠 Tech Stack & Architecture
- **Language:** TypeScript
- **Test Framework:** Playwright Test
- **Design Pattern:** Page Object Model (POM)
- **Environment Management:** `dotenv`

---

## 📁 Directory Structure
```
├── pages/                  # Page Object Model classes
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/                  # Test specifications
│   ├── positive-specs.spec.ts
│   └── negative-specs.spec.ts
├── .env.example            # Environment variables template
├── .gitignore              # Files excluded from version control
├── playwright.config.ts    # Global Playwright configuration
├── TEST_PLAN.md            # Test Plan & Execution Report
└── README.md               # Framework documentation
```

---

## Start

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 1. Installation
Clone this repository and install the project dependencies:
```bash
git clone [https://github.com/bellatrijuliana/takehometestINOSOFT.git](https://github.com/bellatrijuliana/takehometestINOSOFT.git)
cd takehometestINOSOFT
npm install
npx playwright install chromium
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
BASE_URL=[https://advantageonlineshopping.com/#/](https://advantageonlineshopping.com/#/)
APP_USERNAME=your_valid_username
APP_PASSWORD=your_valid_password
```

---

## 🧪 Executing Tests

| Execution Command | Description |
| :--- | :--- |
| `npx playwright test` | Run all test suites in headless mode |
| `npx playwright test --headed` | Run all test suites with browser UI visible |
| `npx playwright test tests/negative-specs.spec.ts --headed` | Run negative test suite only in headed mode |
| `npx playwright show-report` | Open the HTML test report after execution |

---

## 📹 Artifacts
- **HTML Report Location:** Generated automatically at `./playwright-report/index.html`

---

## 👥 Collaborator & Review
- Invited reviewer: `varian@inosoft.id`
