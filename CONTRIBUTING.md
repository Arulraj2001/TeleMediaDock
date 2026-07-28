# Contributing to MediaDock

Thank you for contributing to MediaDock!

## Conventional Commit Standards
We enforce Conventional Commits for clear, automated changelog generation and versioning.

Format: `<type>(<scope>): <short description>`

### Commit Types:
* `feat`: A new user-facing feature.
* `fix`: A bug fix.
* `docs`: Documentation updates only.
* `style`: Formatting, missing semi-colons, etc. (no code logic change).
* `refactor`: Refactoring production code without changing behavior.
* `test`: Adding or correcting tests.
* `chore`: Updating build tasks, package manager configs, etc.

### Examples:
* `feat(extension): add custom filename template builder`
* `fix(validation): block path traversal dots in dynamic folder rules`
* `docs(privacy): update data flow audit table`

## Development Workflow
1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Ensure strict TypeScript types and zero ESLint errors: `pnpm run lint && pnpm run type-check`
3. Verify test coverage: `pnpm run test`
4. Submit a Pull Request following the PR template.
