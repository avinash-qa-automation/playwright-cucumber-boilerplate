@ui @regression
Feature: Sauce Demo Shopping Experience

Scenario: User can login and add items to cart
    Given I am on the Sauce Demo login page
    When I login with standard user credentials
    Then I should see the products page
    When I add "Sauce Labs Backpack" to cart
    And I add "Sauce Labs Bike Light" to cart
    Then I should see 2 items in the cart

Scenario: User can complete checkout process
    Given I am on the Sauce Demo login page
    And I login with standard user credentials
    When I add "Sauce Labs Backpack" to cart
    And I navigate to cart
    And I proceed to checkout
    And I fill checkout information with following details:
        | firstName | lastName | postalCode |
        | John      | Doe      | 12345      |
    And I complete the purchase
    Then I should see the confirmation message