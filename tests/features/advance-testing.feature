@advanced
Feature: Advanced Testing Features
  As a QA engineer
  I want to perform visual, performance, accessibility, and mobile testing
  So that I can ensure high quality standards

  @visual @regression
  Scenario: Visual regression testing
    Given I am on the Sauce Demo login page
    When I login with standard user credentials
    Then I should see the products page
    When I compare the page visually as "products-page"
    Then all visual comparisons should pass

  @visual
  Scenario: Visual testing with masked elements
    Given I am on the products page
    When I compare the page with masked elements ".inventory_item_price,.shopping_cart_badge" as "products-masked"
    Then all visual comparisons should pass

  @visual
  Scenario: Element visual comparison
    Given I am on the products page
    When I compare element ".inventory_item:first-child" visually as "first-product"
    Then all visual comparisons should pass

  @performance @smoke
  Scenario: Page load performance
    Given I am on the Sauce Demo login page
    When I measure page load performance
    Then the page should load within 3000ms
    And the First Contentful Paint should be within 1800ms

  @performance
  Scenario: Performance budget validation
    Given I am on the products page
    When I measure page load performance
    And I check the performance budget
    And I generate a performance report
    Then the performance score should be at least 70

  @accessibility @wcag
  Scenario: WCAG 2.1 AA Compliance
    Given I am on the Sauce Demo login page
    When I run an accessibility scan
    Then there should be no critical accessibility violations
    And the page should be WCAG "AA" compliant

  @accessibility
  Scenario: Comprehensive accessibility checks
    Given I am on the products page
    When I run an accessibility scan
    And I check color contrast
    And I check form labels
    And I check image alt text
    Then the accessibility score should be at least 85

  @mobile @responsive
  Scenario: Mobile device testing
    Given I am using a "iPhone_13" device
    And I am on the Sauce Demo login page
    When I login with standard user credentials
    Then I should see the products page

  @mobile
  Scenario: Responsive design testing
    Given I am on the products page
    When I test responsive breakpoints
    Then the page should render correctly at all breakpoints

  @mobile
  Scenario: Device rotation testing
    Given I am using a "iPad" device
    And I am on the products page
    When I rotate the device
    Then the page should adapt to landscape orientation

  @mobile @network
  Scenario: Mobile network conditions
    Given I am using a "iPhone_13" device
    When I emulate "slow-3g" network
    And I am on the Sauce Demo login page
    Then the page should load successfully

  @mobile
  Scenario: Touch interactions
    Given I am using a "iPhone_13" device
    And I am on the products page
    When I tap on ".inventory_item:first-child button"
    Then the item should be added to cart

  @quality @comprehensive
  Scenario: Complete quality assessment
    Given I am on the Sauce Demo login page
    When I login with standard user credentials
    And I run a complete quality check
    Then all quality metrics should pass

  @visual @responsive
  Scenario: Visual testing across devices
    Given I am on the products page
    When I set the viewport to 375x667
    And I compare the page visually as "mobile-products"
    And I set the viewport to 1920x1080
    And I compare the page visually as "desktop-products"
    Then all visual comparisons should pass

  @performance @mobile
  Scenario: Mobile performance testing
    Given I am using a "Pixel_5" device
    When I emulate "4g" network
    And I am on the products page
    And I measure page load performance
    Then the page should load within 5000ms

  @accessibility @mobile
  Scenario: Mobile accessibility
    Given I am using a "iPhone_SE" device
    And I am on the products page
    When I run an accessibility scan
    Then there should be no critical accessibility violations
    And the accessibility score should be at least 80