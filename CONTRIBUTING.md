# Contributing to D2D

Thank you for your interest in contributing to D2D! This guide will help you get started.

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Convex](https://www.convex.dev/) account (for backend functionality)

## Development Setup

1. **Fork and clone** the repository:

   ```bash
   git clone https://github.com/<your-username>/d2d-compiler.git
   cd d2d-compiler
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values (Convex URL, auth keys, etc.).

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Running Tests

```bash
npm test
```

Tests use [Vitest](https://vitest.dev/) and are located in `tests/`. The test suite covers the deterministic pipeline (extractor, classifier, architect, spatial graph, grid detection) and integration scenarios.

## Making Changes

1. Create a feature branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes. Follow the existing code style:

   - TypeScript strict mode
   - Functional components with hooks
   - Pipeline phases as pure functions

3. Write or update tests for your changes.

4. Ensure all tests pass and the build succeeds:
   ```bash
   npm test
   npm run build
   ```

## Submitting a Pull Request

1. Push your branch and open a PR against `main`.
2. Fill out the PR template.
3. Ensure CI checks pass.
4. A maintainer will review your PR.

## Code Style

- **TypeScript** — Strict mode, no `any` types in pipeline code.
- **Components** — React functional components with hooks.
- **Styling** — Tailwind CSS utility classes.
- **Tests** — Vitest with descriptive test names.

## Reporting Issues

Use the [issue templates](.github/ISSUE_TEMPLATE/) to report bugs or request features.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
