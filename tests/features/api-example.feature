@api
Feature: API Testing Examples
  As a QA engineer
  I want to test APIs
  So that I can verify backend functionality

  @api @smoke
  Scenario: GET request returns valid data
    Given I have a valid API authentication token
    When I make a GET request to "/api/users/1"
    Then the API response status should be 200
    And the API response should be valid JSON
    And the API response should contain:
      | id    | 1           |
      | name  | John Doe    |
      | email | john@example.com |

  @api
  Scenario: POST request creates new resource
    Given I have a valid API authentication token
    When I make a POST request to "/api/users" with:
      | name     | Jane Smith        |
      | email    | jane@example.com  |
      | role     | admin             |
    Then the API response status should be 201
    And the API response should be valid JSON

  @network
  Scenario: Verify network requests during UI interaction
    Given I am on the Sauce Demo login page
    When I start capturing network logs
    And I login with standard user credentials
    Then I should see a request to "inventory"
    And the request to "inventory" should have status 200

  @mock
  Scenario: Mock API response for testing
    Given I mock the API response for "/api/analytics"
    And I am on the products page
    When I add "Sauce Labs Backpack" to cart
    Then the mocked analytics should be called

  @block
  Scenario: Block third-party requests
    Given I block requests to "analytics.google.com"
    And I block requests to "fonts.googleapis.com"
    When I am on the Sauce Demo login page
    Then the page should load without analytics