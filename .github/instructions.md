# Copilot Instructions for Playwright Test Framework

## Project Context
This is a comprehensive Playwright testing library supporting web, API, BDD, and Mocha testing.

## Code Style Guidelines
- Use TypeScript strict mode
- Follow async/await patterns
- Use descriptive variable names
- Add JSDoc comments for public methods
- Export types and interfaces
- Use factory patterns for object creation

## When Adding New Features
1. Create in appropriate src/ subdirectory
2. Export from src/index.ts
3. Add TypeScript types/interfaces
4. Include error handling with custom errors
5. Add logging with appropriate level
6. Create example in tests/ directory
7. Update README.md with usage
8. Add unit tests if applicable

## Testing Patterns
- Use Page Object Model for web tests
- Keep step definitions reusable
- Use fixtures for test data
- Implement proper cleanup in afterEach
- Add tags for test categorization

## Error Handling
- Always use try-catch for async operations
- Log errors with context
- Throw custom error types
- Attach screenshots on failures

## Performance
- Reuse browser contexts when possible
- Implement connection pooling for API
- Use Promise.all for parallel operations
- Clean up resources in finally blocks

## Commit Message Format
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- test: Test additions/changes
- refactor: Code refactoring