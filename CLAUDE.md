# Claude Code Instructions for AstroInitial

## CSS & Styling

- Use modern CSS with `@layers` for organization and cascade management
- **Never use `!important`** — solve specificity issues through proper layer organization
- Follow CUBE CSS methodology where applicable
- Organize styles using logical layers (e.g., reset, tokens, components, utilities)

## Project Structure

- Components are organized by semantic categories:
  - `@components/global/` - Layout components (Header, Footer, Basehead, etc.)
  - `@components/schema/` - JSON-LD schema components
  - Other component subdirectories for feature-specific components
- Use `@config/` for configuration files
- Use `@utils/` for shared utility functions (e.g., `breadcrumbHelper.ts`)
- Use path aliases consistently (defined in tsconfig.json)

## Code Quality

- Component imports and variables should be used; remove unused code
- Run `pnpm biome check` to catch linting issues before committing
- Biome may flag legitimate unused imports during development — fix them when implementing the component

## Development Workflow

- Use `pnpm dev` to run the development server
- For background mode: `astro dev --background` — manage with `astro dev stop`, `astro dev status`, `astro dev logs`
- Use path aliases for all imports (e.g., `@components/`, `@layouts/`, `@types`)

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## JSON-LD Schema

Schema components live in `@components/schema/`, one component per schema type.

**Already implemented:**

- `WebsiteJsonLD.astro` — site-wide `WebSite` with optional `SearchAction`
- `BreadcrumbJsonLD.astro` — `BreadcrumbList` driven by `breadcrumbHelper.ts`
- `SiteNavigationJsonLD.astro` — `SiteNavigationElement` from `siteMetadata` nav items

**Target coverage for a full site** (add as needed per site type):

- `WebPageJsonLD.astro` — base `WebPage`; extend to `AboutPage`, `ContactPage`, `FAQPage` etc. for typed pages
- `OrganizationJsonLD.astro` — `Organization` or `LocalBusiness` with address, contact, and social profiles
- `ArticleJsonLD.astro` — `Article` or `BlogPosting` for content/blog pages (author, dates, image)
- `PersonJsonLD.astro` — `Person` for portfolio or personal sites
- `ProductJsonLD.astro` — `Product` with `Offer` for e-commerce pages
- `FAQJsonLD.astro` — `FAQPage` with `Question`/`Answer` pairs

Each component should accept only the props it needs and be mounted in the relevant layout or page `<head>`, not globally unless the schema applies site-wide.

## Git & GitHub

- **Never commit unless explicitly instructed** — always ask before creating commits
- **Never use Claude as a contributor** — all commits should be authored by the project owner only
- Only create commits when the user explicitly requests it
