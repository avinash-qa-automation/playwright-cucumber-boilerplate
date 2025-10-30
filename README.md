# Playwright + Cucumber BDD Automation Framework

A production-ready test automation framework using Playwright and Cucumber BDD with TypeScript.

## 🚀 Features

- ✅ **Playwright** for reliable cross-browser automation
- ✅ **Cucumber BDD** for behavior-driven development
- ✅ **TypeScript** for type safety
- ✅ **Page Object Model** with class-based design
- ✅ **World Pattern** for proper test isolation
- ✅ **Parallel Execution** support
- ✅ **Multi-Environment** configuration (dev, staging, prod, ci)
- ✅ **Multi-Browser** support (Chromium, Firefox, WebKit)
- ✅ **Advanced Logging** with Winston
- ✅ **Error Handling** with diagnostics capture
- ✅ **Screenshots** on failure
- ✅ **Video Recording** with configurable modes
- ✅ **Playwright Traces** for debugging
- ✅ **HTML/JSON Reports** 
- ✅ **CI/CD Ready** with GitHub Actions
- ✅ **Docker Support** (coming soon)

## 📁 Project Structure

```
project-root/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml    # GitHub Actions CI/CD
├── config/
│   └── test.config.ts              # Centralized configuration
├── src/
│   ├── utils/
│   │   ├── logger.ts               # Winston logger
│   │   └── error-handler.ts        # Error handling utilities
│   └── web/
│       └── actions.ts              # Enhanced WebActions
├── tests/
│   ├── data/
│   │   └── test-data.ts            # Test data management
│   ├── features/
│   │   └── *.feature               # Gherkin feature files
│   ├── pages/
│   │   ├── login.page.ts           # Page objects
│   │   ├── products.page.ts
│   │   └── cart.page.ts
│   ├── steps/
│   │   └── *.steps.ts              # Step definitions
│   ├── support/
│   │   ├── world.ts                # Cucumber World
│   │   └── hooks.ts                # Before/After hooks
│   └── test-results/               # Test artifacts
│       ├── reports/
│       ├── screenshots/
│       ├── videos/
│       └── traces/
├── logs/                            # Application logs
├── .env.example                     # Environment variables template
├── .gitignore
├── cucumber.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## 🛠️ Setup

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-cucumber-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Create `.env` file from template:
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
```bash
TEST_ENV=dev
BROWSER=chromium
HEADLESS=false
```

## 🎯 Running Tests

### Basic Commands

```bash
# Run all tests (sequential)
npm test

# Run in development mode
npm run test:dev

# Run in staging environment
npm run test:staging

# Run in production environment
npm run test:prod

# Run with parallel execution (2 workers)
npm run test:parallel

# Run with 4 parallel workers
npm run test:parallel:4

# Run in CI mode (with pre-compilation)
npm run test:ci
```

### Browser-Specific Tests

```bash
# Run in Chromium
npm run test:chromium

# Run in Firefox
npm run test:firefox

# Run in WebKit
npm run test:webkit
```

### Tag-Based Execution

```bash
# Run smoke tests only
npm run test:smoke

# Run regression tests
npm run test:regression
```

### Debug Mode

```bash
# Run in headed mode (visible browser)
npm run test:headed

# Run with slow motion for debugging
npm run test:debug
```

## 🌍 Environment Configuration

The framework supports multiple environments through configuration files:

### Using Environment Variables

```bash
# Set environment
export TEST_ENV=staging

# Set browser
export BROWSER=firefox

# Enable headless mode
export HEADLESS=true

# Set parallel workers
export PARALLEL_WORKERS=4
```

### Configuration Options

| Variable | Description | Default | Options |
|----------|-------------|---------|---------|
| `TEST_ENV` | Target environment | `dev` | `dev`, `staging`, `prod`, `ci` |
| `BROWSER` | Browser to use | `chromium` | `chromium`, `firefox`, `webkit` |
| `HEADLESS` | Run in headless mode | `false` | `true`, `false` |
| `PARALLEL_WORKERS` | Number of parallel workers | `1` | `1-8` |
| `VIDEO_RECORDING` | Enable video recording | `true` | `true`, `false` |
| `VIDEO_MODE` | When to record videos | `retain-on-failure` | `on`, `off`, `retain-on-failure`, `on-first-retry` |
| `SCREENSHOT_ON_FAILURE` | Capture screenshots on failure | `true` | `true`, `false` |
| `TRACE_ENABLED` | Enable Playwright traces | `true` | `true`, `false` |
| `LOG_LEVEL` | Logging level | `info` | `error`, `warn`, `info`, `debug` |

## 📝 Writing Tests

### Feature Files (Gherkin)

Create feature files in `tests/features/`:

```gherkin
@ui @smoke
Feature: User Login

  Background:
    Given I am on the Sauce Demo login page

  Scenario: Successful login with valid credentials
    When I login with standard user credentials
    Then I should see the products page

  Scenario: Login with invalid credentials
    When I login with username "invalid_user" and password "wrong_pass"
    Then I should see an error message
```

### Step Definitions

Create step definitions in `tests/steps/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWorld } from '../support/world';

Given('I am on the Sauce Demo login page', async function(this: TestWorld) {
    await this.loginPage.navigateToLogin();
});

When('I login with standard user credentials', async function(this: TestWorld) {
    await this.loginPage.login('standard_user', 'secret_sauce');
});

Then('I should see the products page', async function(this: TestWorld) {
    const isLoggedIn = await this.loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
});
```

### Page Objects

Create page objects in `tests/pages/`:

```typescript
import { Page } from '@playwright/test';
import { WebActions } from '../../src/web/actions';

export class LoginPage {
    constructor(
        private page: Page,
        private actions: WebActions
    ) {}

    async navigateToLogin(): Promise<void> {
        await this.actions.navigateTo('https://www.saucedemo.com/');
    }

    async login(username: string, password: string): Promise<void> {
        await this.actions.fill('#user-name', username);
        await this.actions.fill('#password', password);
        await this.actions.click('#login-button');
    }
}
```

## 📊 Reports and Artifacts

### Test Reports

After test execution, reports are available in:
- **HTML Report**: `test-results/reports/cucumber-report.html`
- **JSON Report**: `test-results/reports/cucumber-report.json`

Open HTML report:
```bash
npm run report
```

### Artifacts on Failure

When tests fail, the framework automatically captures:
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/`
- **Traces**: `test-results/traces/` (open with Playwright Trace Viewer)

### Opening Traces

```bash
npx playwright show-trace test-results/traces/<trace-file>.zip
```

### Logs

Application logs are stored in:
- **Error logs**: `logs/error.log`
- **Combined logs**: `logs/combined.log`

## 🔄 CI/CD Integration

### GitHub Actions

The framework includes a pre-configured GitHub Actions workflow that:
- Runs on push/pull requests
- Supports manual triggers with parameters
- Tests across multiple browsers
- Uploads artifacts (reports, screenshots, traces)
- Can be triggered with custom environment/browser combinations

### Manual Workflow Dispatch

1. Go to GitHub Actions tab
2. Select "Playwright Cucumber Tests"
3. Click "Run workflow"
4. Choose parameters:
   - Environment (dev/staging/prod)
   - Browser (chromium/firefox/webkit/all)
   - Parallel workers

### Local CI Simulation

```bash
# Simulate CI environment locally
npm run test:ci
```

## 🐛 Debugging

### Debug Mode

```bash
# Run with visible browser and slow motion
npm run test:debug
```

### Playwright Inspector

```bash
# Run with Playwright Inspector
PWDEBUG=1 npm test
```

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Cucumber Tests",
  "program": "${workspaceFolder}/node_modules/@cucumber/cucumber/bin/cucumber-js",
  "args": [
    "--require-module", "ts-node/register",
    "--require", "tests/steps/**/*.ts",
    "--require", "tests/support/**/*.ts"
  ],
  "env": {
    "HEADLESS": "false"
  }
}
```

## 📦 Maintenance

### Clean Artifacts

```bash
# Clean all generated files
npm run clean

# Clean reports only
npm run clean:reports
```

### Compile TypeScript

```bash
npm run compile
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

**Issue**: Tests fail with "Browser not found"
```bash
# Solution: Install browsers
npx playwright install
```

**Issue**: TypeScript errors
```bash
# Solution: Compile TypeScript
npm run compile
```

**Issue**: Port already in use
```bash
# Solution: Kill process or change port
lsof -ti:3000 | xargs kill -9
```

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation in `/docs`
- Review logs in `/logs` directory

---

**Happy Testing! 🚀**