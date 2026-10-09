# Contributing to ExploreBharat

Thank you for contributing to ExploreBharat! We welcome contributions from developers, designers, tourism researchers, and open-source enthusiasts.

## Monorepo Workflow

1. Fork and clone the repository.
2. Install dependencies across workspaces:
   ```bash
   npm install
   ```
3. Compile shared packages:
   ```bash
   npm run build --workspace=@bharatyatra/types
   ```
4. Setup local database:
   ```bash
   cd packages/database
   npx prisma generate
   npx prisma db push
   npm run seed
   ```
5. Run the test suite before submitting a Pull Request:
   ```bash
   cd apps/api
   npm test
   ```
6. Ensure your commits follow conventional commit formats:
   - `feat: add wildlife safari slot management`
   - `fix: resolve mobile QR pass aspect ratio`
   - `docs: update ASI booking provider specs`
