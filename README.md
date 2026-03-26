<img width="1920" height="1080" alt="DevSecOpsAutomationArchitecture Lotfi" src="https://github.com/user-attachments/assets/4bb1fc50-ec1b-4bcc-ac74-19d4399a0c33" />

<div align="center">

# Playwright Test Intelligence & Reporting

**Enterprise-grade E2E test automation framework with real-time analytics dashboard**

[![Playwright](https://img.shields.io/badge/Playwright-1.53-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

</div>

---

## Overview

A production-ready Playwright E2E testing framework built with the **Page Object Model** pattern, custom fixtures, centralized locator management, and an integrated **analytics dashboard** for test intelligence and reporting.

Designed and maintained by **Lotfi OTAI** -- Senior QA Automation Engineer.

---

## Architecture

```
PlaywrightE2ETests.OTAI/
|
|-- otaiE2ETests/
|   |-- pages/
|   |   |-- BasePage.ts
|   |   |-- LoginPage.ts
|   |   |-- SidebarPage.ts
|   |   |-- CustomersPage.ts
|   |
|   |-- tests/
|   |   |-- dashboard-tests/
|   |   |   |-- login.spec.ts
|   |   |-- customers-tests/
|   |       |-- customers.spec.ts
|   |       |-- segments.spec.ts
|   |
|   |-- utils/
|       |-- config.ts
|       |-- fixtures.ts
|       |-- elementFinder.ts
|       |-- locators.ts
|
|-- dashboard-reports/
|   |-- index.html
|   |-- generate_report.py
|   |-- serve_dashboard.py
|   |-- report_data.json
|   |-- run_history.json
|
|-- playwright.config.ts
|-- package.json
|-- .gitignore
```

---

## Key Design Patterns

| Pattern | Implementation |
|---------|---------------|
| **Page Object Model** | Each page has its own class inheriting from `BasePage` |
| **Custom Fixtures** | Page objects injected via Playwright's `test.extend()` |
| **Locator Abstraction** | 3-layer system: `elementFinder` -> `locators` -> Page Objects |
| **Centralized Config** | Single `config.ts` for URLs, credentials, and settings |
| **Explicit Waits** | Condition-based waits (`waitForVisibility`, `waitForText`) |
| **Multi-layer Reporting** | HTML + Allure + JSON + Custom Dashboard |

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Playwright** | Browser automation & test runner |
| **TypeScript** | Type-safe test development |
| **Chart.js** | Dashboard visualizations |
| **Allure** | Detailed test reporting |
| **Python** | Report data pipeline |
| **SonarQube** | Code quality analysis |

---

## Getting Started

### Prerequisites

- **Node.js** (LTS)
- **Python 3.x** (for dashboard generation)

### Installation

```bash
git clone <repo-url>
cd PlaywrightE2ETests.OTAI
npm install
npx playwright install
```

### Running Tests

```bash
npx playwright test
npx playwright test --headed
npx playwright test login.spec.ts
npx playwright test customers-tests/
```

### Test Intelligence Dashboard

```bash
npx playwright test
python dashboard-reports/generate_report.py
start dashboard-reports/index.html
```

The dashboard provides:
- **Pass / Fail / Skip** summary cards
- **Tests by Suite** doughnut chart
- **Test Stability** line chart (last 30 runs)
- **Run Overview** with success rate, duration, and metadata
- **Sidebar** with test lists, passes, failures, and filters
- **Test Detail Modal** with steps and logs

---

## Reporting

The framework outputs reports in **4 formats** simultaneously:

| Reporter | Output | Purpose |
|----------|--------|---------|
| **List** | Console | Real-time test progress |
| **HTML** | `playwright-report/` | Playwright built-in report |
| **Allure** | `allure-results/` | Enterprise reporting |
| **JSON** | `test-results/results.json` | Dashboard data source |

---

## Test Coverage

| Suite | Tests | Description |
|-------|-------|-------------|
| **Login** | 2 | Valid & invalid authentication |
| **Customers** | 1 | Full customer creation workflow |
| **Segments** | 2 | Segment display & filtering |

**Target Application:** [React Admin Demo](https://marmelab.com/react-admin-demo/)

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---------|-------|
| Timeout | 30s |
| Retries | 1 |
| Headless | true |
| Viewport | 1280 x 720 |
| Video | On first retry |
| Screenshots | On failure only |

---

<div align="center">

**Built with precision by Lotfi OTAI**

Senior QA Automation Engineer

</div>
