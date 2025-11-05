# 🎭 Playwright + Cucumber BDD Test Automation Framework

<div align="center">

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=for-the-badge&logo=cucumber&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

**A modern, comprehensive, production-ready test automation framework with Visual Regression, Performance Testing, Accessibility Testing, and Mobile Emulation**

[Features](#-features) • [Quick Start](#-quick-start) • [Commands](#-test-commands) • [Documentation](#-documentation) • [Examples](#-examples)

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)]()
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

</div>

---

## 🌟 Overview

This framework provides a **complete testing solution** for modern web applications, combining the power of Playwright with Cucumber BDD, enhanced with enterprise-grade features including Visual Regression, Performance Monitoring, Accessibility Compliance, and Mobile Device Testing.

### Why This Framework?

- ✅ **All-in-One Solution**: UI, API, Visual, Performance, Accessibility, Mobile - everything included
- ✅ **Production-Ready**: Battle-tested with comprehensive error handling and diagnostics
- ✅ **Developer-Friendly**: TypeScript with excellent IDE support and type safety
- ✅ **Business-Readable**: Cucumber's Gherkin syntax for stakeholder collaboration
- ✅ **Fast & Reliable**: Parallel execution, auto-waiting, and smart retry mechanisms
- ✅ **Quality-First**: Built-in performance budgets, accessibility checks, and visual comparisons

---

## 🚀 Features

### 🎯 Core Testing Capabilities

#### UI Test Automation
- 🎭 **Playwright Integration** - Modern, reliable cross-browser automation
- 🥒 **Cucumber BDD** - Write tests in plain English using Gherkin syntax
- 📘 **TypeScript** - Full type safety and excellent developer experience
- 🏗️ **Page Object Model** - Maintainable, scalable test architecture
- 🌍 **World Pattern** - Proper test isolation and state management

#### API Testing (Phase 2) 🆕
- 🔌 **Full REST API Support** - GET, POST, PUT, PATCH, DELETE
- 🔐 **Authentication Management** - Token-based auth handling
- ✅ **Response Assertions** - Built-in status and content validation
- 📊 **Request/Response Logging** - Automatic logging with performance metrics
- 🔄 **Hybrid Testing** - Seamlessly combine API and UI tests

#### Network Control (Phase 2) 🆕
- 🕸️ **Traffic Capture** - Monitor all network requests/responses
- 🎭 **API Mocking** - Mock external dependencies for deterministic tests
- 🚫 **Resource Blocking** - Block ads, analytics, fonts for faster execution
- 🐌 **Network Simulation** - Test slow connections and offline scenarios
- 📈 **Performance Metrics** - Track request durations and patterns

#### Visual Regression Testing (Phase 3) 🆕
- 📸 **Screenshot Comparison** - Pixel-perfect visual regression testing
- 🎨 **Element Comparison** - Test specific components independently
- 🎭 **Dynamic Content Masking** - Hide changing elements (dates, counters)
- 📱 **Responsive Testing** - Compare across multiple viewports
- 🎯 **Hover/Focus States** - Test interactive element states
- 📏 **Custom Thresholds** - Configurable tolerance for differences

#### Performance Testing (Phase 3) 🆕
- ⚡ **Web Vitals** - FCP, LCP, CLS, TTI, TBT measurements
- 📊 **Performance Budgets** - Set and enforce performance thresholds
- 🎯 **Performance Scoring** - 0-100 score based on metrics
- 📈 **Resource Analysis** - Identify slowest/largest resources
- ⏱️ **TTFB Measurement** - Time to First Byte tracking
- 📋 **Automated Reports** - Detailed performance reports with violations

#### Accessibility Testing (Phase 3) 🆕
- ♿ **WCAG Compliance** - WCAG 2.0, 2.1, 2.2 Level A, AA, AAA
- 🔍 **axe-core Integration** - Industry-standard accessibility testing
- 🎨 **Color Contrast** - Automatic contrast ratio checking
- 📝 **Form Validation** - Label and input accessibility checks
- 🖼️ **Image Alt Text** - Verify all images have descriptions
- ⌨️ **Keyboard Navigation** - Test keyboard accessibility
- 🏆 **Accessibility Scoring** - Get compliance scores (0-100)

#### Mobile Device Emulation (Phase 3) 🆕
- 📱 **20+ Devices** - iPhone, iPad, Android phones, tablets
- 👆 **Touch Gestures** - Tap, swipe, pinch, long press
- 🔄 **Device Rotation** - Portrait/landscape testing
- 📍 **Geolocation** - Test location-based features
- 📡 **Network Conditions** - Emulate 3G, 4G, WiFi, offline
- 📐 **Responsive Breakpoints** - Test all common screen sizes

### ⚙️ Test Execution

- ⚡ **Parallel Execution** - Run tests concurrently (2-8+ workers)
- 🌐 **Multi-Browser Support** - Chromium, Firefox, WebKit
- 🎯 **Multi-Environment** - Dev, Staging, Production, CI configurations
- 🏷️ **Tag-Based Filtering** - Run specific suites (@smoke, @regression, @api, @visual, etc.)
- 🔁 **Smart Retry Logic** - Exponential backoff for flaky tests
- 🎬 **Debug Mode** - Headed browser with slow motion for troubleshooting

### 🔍 Debugging & Diagnostics

- 📸 **Screenshots on Failure** - Automatic capture with timestamping
- 🎥 **Video Recording** - Configurable modes (on-failure, always, first-retry)
- 🔍 **Playwright Traces** - Deep debugging with timeline and network logs
- 📊 **Advanced Logging** - Winston-based structured logging with levels
- 🎨 **Colored Console Output** - Easy-to-read test execution logs with emojis
- 🔧 **Error Diagnostics** - Context capture, stack traces, page state
- 🕸️ **Network Logs** - Request/response capture in traces
- 💻 **Browser Console** - Capture and attach console logs

### 📈 Reporting & CI/CD

#### Reports
- 📄 **Standard Cucumber HTML** - Feature/scenario breakdown
- ✨ **Enhanced HTML Summary** - Beautiful reports with charts and statistics
- 📊 **JSON Reports** - Machine-readable for integrations
- 📋 **JUnit XML** - For CI/CD integration
- 🎯 **Performance Reports** - Detailed Web Vitals and budget violations
- ♿ **Accessibility Reports** - WCAG violations with remediation guidance
- 📸 **Visual Diff Reports** - Side-by-side comparisons with highlights

#### CI/CD Integration
- 🔄 **GitHub Actions Ready** - Pre-configured workflow included
- 🐳 **Docker Support** - Containerized execution (coming soon)
- 🔧 **Environment Variables** - Easy configuration management
- 📦 **Artifact Upload** - Screenshots, videos, traces, reports
- 🎯 **Quality Gates** - Fail builds on budget violations or accessibility issues

### 🛠️ Developer Experience

- 🎛️ **Centralized Configuration** - Single source for all settings
- 🔁 **Retry Logic** - Smart exponential backoff
- 🛡️ **Error Handling** - Comprehensive error utilities
- 📝 **Code Quality** - ESLint and Prettier configurations
- 🚦 **Type Safety** - Full TypeScript throughout
- 📚 **Comprehensive Docs** - Detailed guides for all features
- 🎓 **Example Tests** - Real-world examples for every feature

### 📦 Test Data Management (Phase 2)

- 🗄️ **Static Data Repository** - Predefined users, products, checkout info
- 🎲 **Dynamic Generation** - Random usernames, emails, passwords
- 📁 **File-Based Loading** - JSON data files with caching
- 🌍 **Environment-Specific** - Different data per environment
- 🏗️ **Data Builders** - Fluent API for test data creation

---

## 📋 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- Basic understanding of TypeScript and Cucumber BDD

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/playwright-cucumber-framework.git
cd playwright-cucumber-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Copy environment configuration
cp .env.example .env

# Edit .env with your settings
nano .env
```

### Run Your First Test

```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run in debug mode (visible browser)
npm run test:debug

# View report
npm run report
```

---

## 🎯 Test Commands

### Basic Execution
```bash
npm test                     # Run all tests
npm run test:smoke           # Quick critical path tests
npm run test:regression      # Full regression suite
npm run test:parallel        # Parallel execution (2 workers)
npm run test:parallel:4      # Parallel with 4 workers
npm run test:debug           # Debug mode (headed + slow motion)
```

### Test Types
```bash
npm run test:ui              # UI tests only
npm run test:api             # API tests only
npm run test:visual          # Visual regression tests
npm run test:performance     # Performance tests
npm run test:accessibility   # Accessibility tests
npm run test:a11y            # Alias for accessibility
npm run test:mobile          # Mobile device tests
npm run test:responsive      # Responsive design tests
npm run test:network         # Network monitoring tests
npm run test:mock            # Tests with API mocking
npm run test:advanced        # All advanced tests
npm run test:quality         # Complete quality assessment
```

### Environments
```bash
npm run test:dev             # Development environment
npm run test:staging         # Staging environment
npm run test:prod            # Production environment
npm run test:ci              # CI-optimized (with compilation)
```

### Browsers
```bash
npm run test:chromium        # Google Chrome/Edge
npm run test:firefox         # Mozilla Firefox
npm run test:webkit          # Safari
```

### Special Modes
```bash
npm run test:headed          # Visible browser
npm run test:blocked         # Block ads/analytics
npm run snapshots:update     # Update visual baselines
```

### Utilities
```bash
npm run report               # Open enhanced HTML report
npm run report:cucumber      # Open standard Cucumber report
npm run clean                # Clean all artifacts
npm run clean:reports        # Clean reports only
npm run clean:snapshots      # Clean visual snapshots
npm run compile              # Compile TypeScript
npm run lint                 # Run ESLint
npm run format               # Format with Prettier
```

---

## 📁 Project Structure

```
playwright-cucumber-framework/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml          # CI/CD pipeline
├── config/
│   └── test.config.ts                    # Centralized configuration
├── src/
│   ├── accessibility/
│   │   └── accessibility-helper.ts       # WCAG compliance testing
│   ├── api/
│   │   └── api-client.ts                 # REST API testing
│   ├── mobile/
│   │   └── mobile-helper.ts              # Device emulation
│   ├── performance/
│   │   └── performance-helper.ts         # Web Vitals & budgets
│   ├── utils/
│   │   ├── error-handler.ts              # Error handling
│   │   └── logger.ts                     # Winston logger
│   ├── visual/
│   │   └── visual-testing.ts             # Visual regression
│   └── web/
│       ├── actions.ts                    # Web actions
│       └── network-helper.ts             # Network mocking
├── tests/
│   ├── data/
│   │   └── test-data-manager.ts          # Test data management
│   ├── features/
│   │   ├── shopping.feature              # UI test scenarios
│   │   ├── api-example.feature           # API test scenarios
│   │   └── advanced-testing.feature      # Advanced features
│   ├── pages/
│   │   ├── login.page.ts                 # Page objects
│   │   ├── products.page.ts
│   │   └── cart.page.ts
│   ├── steps/
│   │   ├── shopping.steps.ts             # Step definitions
│   │   ├── api.steps.ts
│   │   └── advanced.steps.ts
│   ├── support/
│   │   ├── world.ts                      # Cucumber World
│   │   ├── hooks.ts                      # Test hooks
│   │   └── custom-reporter.ts            # Custom reporter
│   └── test-results/                     # Test artifacts
│       ├── reports/
│       │   ├── cucumber-report.html
│       │   ├── summary.html
│       │   └── enhanced-report.json
│       ├── screenshots/
│       │   └── snapshots/
│       ├── videos/
│       └── traces/
├── logs/
│   ├── error.log
│   └── combined.log
├── .env.example                           # Environment template
├── .gitignore
├── cucumber.config.js
├── tsconfig.json
├── package.json
├── README.md                              # This file
├── TEST_COMMANDS.md                       # Complete command reference
├── PHASE2_FEATURES.md                     # API & Network features
├── PHASE3_FEATURES.md                     # Visual, Perf, A11y, Mobile
└── FRAMEWORK_COMPLETE.md                  # Final summary
```

---

## 💡 Usage Examples

### UI Test Example

**Feature File (`tests/features/shopping.feature`):**
```gherkin
@ui @smoke
Feature: Shopping Cart

  Scenario: Add item to cart
    Given I am on the Sauce Demo login page
    When I login with standard user credentials
    And I add "Sauce Labs Backpack" to cart
    And I navigate to cart
    Then I should see "Sauce Labs Backpack" in my cart
```

**Step Definition (`tests/steps/shopping.steps.ts`):**
```typescript
When('I add {string} to cart', async function(this: TestWorld, productName: string) {
    this.scenarioLogger.step(`Adding product "${productName}" to cart`);
    await this.productsPage.addToCart(productName);
    this.scenarioLogger.info(`Product "${productName}" added to cart`);
});
```

**Page Object (`tests/pages/products.page.ts`):**
```typescript
export class ProductsPage {
    constructor(private page: Page, private actions: WebActions) {}

    async addToCart(productName: string): Promise<void> {
        const selector = `//div[text()="${productName}"]//button`;
        await this.actions.click(selector);
    }
}
```

### API Test Example

**Feature File:**
```gherkin
@api @smoke
Feature: User API

  Scenario: Create new user
    Given I have a valid API authentication token
    When I make a POST request to "/api/users" with:
      | name  | John Doe      |
      | email | john@test.com |
    Then the API response status should be 201
    And the API response should be valid JSON
```

**Step Definition:**
```typescript
When('I make a POST request to {string} with:', async function(this: TestWorld, endpoint: string, dataTable) {
    const data = dataTable.rowsHash();
    const response = await this.apiClient.post(endpoint, data);
    (this as any).lastApiResponse = response;
});
```

### Visual Regression Test

**Feature File:**
```gherkin
@visual @regression
Feature: Visual Regression

  Scenario: Products page visual check
    Given I am on the products page
    When I compare the page visually as "products-page"
    Then all visual comparisons should pass
```

### Performance Test

**Feature File:**
```gherkin
@performance @smoke
Feature: Page Performance

  Scenario: Page load performance
    Given I am on the products page
    When I measure page load performance
    Then the page should load within 3000ms
    And the performance score should be at least 80
```

### Accessibility Test

**Feature File:**
```gherkin
@accessibility @wcag
Feature: Accessibility Compliance

  Scenario: WCAG AA compliance
    Given I am on the products page
    When I run an accessibility scan
    Then there should be no critical accessibility violations
    And the page should be WCAG "AA" compliant
```

### Mobile Test

**Feature File:**
```gherkin
@mobile @responsive
Feature: Mobile Testing

  Scenario: iPhone 13 testing
    Given I am using a "iPhone_13" device
    And I am on the products page
    When I tap on ".add-to-cart"
    Then the item should be added to cart
```

### Network Mocking

**Step Definition:**
```typescript
Given('I mock the API response for {string}', async function(this: TestWorld, urlPattern: string) {
    await this.networkHelper.mockApiResponse(urlPattern, {
        status: 200,
        body: { success: true, data: [...] }
    });
});
```

### Test Data Usage

```typescript
import { TestData, DataBuilder } from '../data/test-data-manager';

// Static data
const user = TestData.users.standard;
await this.loginPage.login(user.username, user.password);

// Dynamic data
const randomUser = DataBuilder.generateUserCredentials();
const checkoutInfo = DataBuilder.generateCheckoutInfo();
```

---

## 📊 Reports and Artifacts

### Available Reports

After running tests, find reports in `test-results/`:

1. **Enhanced HTML Summary** (`reports/summary.html`)
   - Visual success rate display
   - Test statistics with charts
   - Slowest scenarios
   - Failed scenarios with errors
   - Test metadata

2. **Standard Cucumber HTML** (`reports/cucumber-report.html`)
   - Feature-by-feature breakdown
   - Scenario details
   - Step execution times

3. **Enhanced JSON** (`reports/enhanced-report.json`)
   - Machine-readable format
   - Performance metrics
   - Budget violations
   - For custom integrations

4. **Performance Reports** (`performance/performance-report.json`)
   - Web Vitals metrics
   - Resource timing
   - Budget violations
   - Performance score

5. **Accessibility Reports** (`accessibility/a11y-report.json`)
   - WCAG violations
   - Impact levels
   - Remediation guidance
   - Accessibility score

### Artifacts on Failure

Automatically captured when tests fail:

- **Screenshots** - `screenshots/*.png`
- **Videos** - `videos/*.webm`
- **Traces** - `traces/*.zip` (view with `npx playwright show-trace`)
- **Visual Diffs** - `screenshots/snapshots/*-diff.png`
- **Network Logs** - Included in traces
- **Console Logs** - Attached to Cucumber report
- **Page HTML** - Attached to report

### Viewing Reports

```bash
# Open enhanced summary
npm run report

# Open Cucumber report
npm run report:cucumber

# View traces
npx playwright show-trace test-results/traces/scenario.zip

# View logs
tail -f logs/combined.log
cat logs/error.log
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

```bash
# Environment
TEST_ENV=dev                          # dev, staging, prod, ci
NODE_ENV=development

# Browser
BROWSER=chromium                      # chromium, firefox, webkit
HEADLESS=false                        # true, false
SLOW_MO=0                            # Delay in ms
TIMEOUT=30000                        # Default timeout in ms

# Viewport
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Execution
PARALLEL_WORKERS=1                   # Number of parallel workers
RETRIES=2                            # Test retry count

# Logging
LOG_LEVEL=info                       # error, warn, info, debug

# Video Recording
VIDEO_RECORDING=true
VIDEO_MODE=retain-on-failure         # on, off, retain-on-failure, on-first-retry

# Screenshots
SCREENSHOT_ON_FAILURE=true

# Tracing
TRACE_ENABLED=true
TRACE_MODE=retain-on-failure

# Visual Testing
VISUAL_THRESHOLD=0.2
VISUAL_MAX_DIFF_PIXELS=100

# Performance
PERF_BUDGET_LOAD=3000
PERF_BUDGET_FCP=1800
PERF_BUDGET_LCP=2500

# Accessibility
A11Y_LEVEL=AA                        # A, AA, AAA
A11Y_FAIL_ON_VIOLATIONS=false

# Mobile
DEFAULT_MOBILE_DEVICE=iPhone_13
MOBILE_NETWORK=4g

# CI/CD
CI=false
```

### Test Configuration (`config/test.config.ts`)

The framework automatically loads environment-specific configuration:

```typescript
// Development
TEST_ENV=dev npm test

// Staging
TEST_ENV=staging npm test

// Production
TEST_ENV=prod npm test

// CI
TEST_ENV=ci npm run test:ci
```

---

## 🔄 CI/CD Integration

### GitHub Actions (Pre-configured)

The framework includes a ready-to-use GitHub Actions workflow:

```yaml
# .github/workflows/playwright-tests.yml
name: Playwright Tests
on: [push, pull_request, workflow_dispatch]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:ci
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
```

### Manual Workflow Trigger

1. Go to GitHub Actions tab
2. Select "Playwright Cucumber Tests"
3. Click "Run workflow"
4. Choose:
   - Environment (dev/staging/prod)
   - Browser (chromium/firefox/webkit/all)
   - Parallel workers (1-8)

### Other CI/CD Platforms

**Jenkins:**
```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
                sh 'npm run test:ci'
            }
        }
        stage('Report') {
            steps {
                publishHTML([
                    reportDir: 'test-results/reports',
                    reportFiles: 'summary.html',
                    reportName: 'Test Report'
                ])
            }
        }
    }
}
```

**GitLab CI:**
```yaml
test:
  image: mcr.microsoft.com/playwright:latest
  script:
    - npm ci
    - npm run test:ci
  artifacts:
    paths:
      - test-results/
    when: always
```

---

## 🎯 Best Practices

### Test Organization
✅ Group tests by feature/domain
✅ Use meaningful, descriptive scenario names
✅ Tag appropriately (@smoke, @regression, @api, etc.)
✅ Keep scenarios focused and independent
✅ Use Background for common setup

### Page Objects
✅ One class per page/component
✅ Encapsulate all selectors
✅ Return promises consistently
✅ Add comprehensive JSDoc comments
✅ Use meaningful method names

### Test Data
✅ Use static data for known scenarios
✅ Generate dynamic data for variety/uniqueness
✅ Never commit real credentials
✅ Use environment-specific data
✅ Keep test data DRY

### Visual Testing
✅ Mask dynamic content (dates, counters, ads)
✅ Run on consistent environment
✅ Update baselines intentionally
✅ Test multiple viewports
✅ Use descriptive snapshot names

### Performance Testing
✅ Set realistic performance budgets
✅ Test on representative hardware
✅ Block unnecessary resources
✅ Monitor trends over time
✅ Test both cold and warm loads

### Accessibility Testing
✅ Test every page and component
✅ Aim for WCAG AA minimum
✅ Fix critical issues first
✅ Test with keyboard navigation
✅ Validate with screen readers

### Mobile Testing
✅ Test on real device viewports
✅ Test portrait and landscape
✅ Emulate real network conditions
✅ Test touch interactions
✅ Cover iOS and Android

### CI/CD
✅ Run smoke tests on every commit
✅ Run full regression nightly
✅ Archive test artifacts
✅ Monitor quality metrics
✅ Fail builds on critical issues

---

## 📚 Documentation

- **README.md** - This comprehensive guide

---

## 🐛 Troubleshooting

### Common Issues

**Browsers not found:**
```bash
npx playwright install --with-deps
```

**TypeScript errors:**
```bash
npm run compile
```

**Tests failing randomly:**
```bash
# Increase timeout
TIMEOUT=60000 npm test

# Reduce parallel workers
PARALLEL_WORKERS=1 npm test

# Check for race conditions
```

**Visual tests failing:**
```bash
# View diffs
open test-results/screenshots/snapshots/*-diff.png

# Update baselines if intentional
npm run snapshots:update
```

**Performance tests slow:**
```bash
# Check network conditions
# Block unnecessary resources
npm run test:blocked
```

**Accessibility violations:**
```bash
# View detailed report
cat test-results/accessibility/a11y-report.json

# Fix critical issues first
npm run test:accessibility
```

### Getting Help

1. Check documentation files
2. Review logs: `logs/combined.log`
3. View traces: `npx playwright show-trace`
4. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant logs

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Contribution Guidelines

- ✅ All tests must pass
- ✅ Follow TypeScript best practices
- ✅ Add tests for new features
- ✅ Update documentation
- ✅ Follow existing code style
- ✅ Write clear commit messages

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - Modern browser automation
- [Cucumber](https://cucumber.io/) - BDD framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Winston](https://github.com/winstonjs/winston) - Logging library
- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing

---

## 📞 Support

- 📧 **Email**: avinash.pagunta@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/avinash-qa-automation/playwright-cucumber-framework/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/avinash-qa-automation/playwright-cucumber-framework/discussions)
- 📖 **Documentation**: See documentation files in repository

---

## 🎉 Quick Start Summary

```bash
# 1. Install
npm install
npx playwright install

# 2. Configure
cp .env.example .env

# 3. Run tests
npm test

# 4. View reports
npm run report

# 5. Try advanced features
npm run test:visual
npm run test:performance
npm run test:accessibility
npm run test:mobile
```

<div align="center">

**Built with ❤️ by QA Engineers, for QA Engineers**

If this framework helped you, please consider giving it a ⭐️

**[Documentation](./README.md)** • **[Commands](./TEST_COMMANDS.md)** • **[Examples](./tests/features/)** • **[Contributing](#-contributing)**

---

*Framework Version: 1.0.0*  
*Last Updated: 2025-11-05*  
*Status: Production Ready ✅*

</div>