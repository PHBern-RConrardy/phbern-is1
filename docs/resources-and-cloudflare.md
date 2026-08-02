# Resources, stable links, and Cloudflare Pages

The PPD projects separate freely distributable files from files that require
access control:

```text
resources_free/
resources_non_free/
```

This convention is understood by the PHBern link filters.

## Make resources part of the website

Add both directories to `_quarto.yml`:

```yaml
project:
  type: website
  resources:
    - resources_free/**
    - resources_non_free/**

website:
  site-url: "https://course.example.org"
```

The `site-url` value is the single source of truth for exported links.

## Link from a document

Use a normal relative link:

```markdown
[Lektionsplanung](resources_free/lektionsplanung.docx)

[Lizenzierter Artikel](resources_non_free/artikel.pdf)
```

In HTML, links remain relative to the website. In `phbern-typst` and
`phbern-docx`, the extension turns them into absolute links under
`website.site-url`.

For example:

```text
https://course.example.org/resources_free/lektionsplanung.docx
```

The Typst/PDF filter also places a lock marker before links whose normalized
path contains `resources_non_free/`.

This marker communicates intent; it does not enforce access control.

## Protect `resources_non_free/` on Cloudflare Pages

The extension bundles optional middleware:

```text
_extensions/PHBern-RConrardy/phbern/cloudflare/
├── allowed-ip-ranges.csv
├── restricted-resources.js
├── _routes.json
└── functions/
    └── _middleware.js
```

The extension's `_routes.json` and `functions/_middleware.js` are canonical
templates. Copy them into the course project when enabling protection:

- copy `cloudflare/_routes.json` to the project root as `_routes.json`;
- copy `cloudflare/functions/_middleware.js` to the project root as
  `functions/_middleware.js`.

The wrapper then looks like this:

```js
import { createRestrictedResourcesMiddleware } from "../_extensions/PHBern-RConrardy/phbern/cloudflare/restricted-resources.js";

export const onRequest = createRestrictedResourcesMiddleware();
```

Add `_routes.json` at the project root:

```json
{
  "version": 1,
  "include": ["/resources_non_free/*"],
  "exclude": []
}
```

Ensure deployment resources include the route file and IP list:

```yaml
project:
  resources:
    - _routes.json
    - _extensions/PHBern-RConrardy/phbern/cloudflare/allowed-ip-ranges.csv
    - resources_non_free/**
```

Configure the `RESTRICTED_PASSWORD` secret in Cloudflare Pages. Requests are
allowed when either:

- the `CF-Connecting-IP` address matches the configured IPv4 address or CIDR
  range; or
- HTTP Basic Authentication supplies the configured password.

The middleware sends `private, no-store` for accepted protected resources and
`no-store` for denied requests.

## Replace the example ranges

The bundled CSV contains example data:

```csv
range,description
147.87.0.0/16,Example PHBern-style institutional IPv4 range
203.0.113.42,Example single IPv4 address
```

Verify institutional ranges with the responsible network team before
deployment. The middleware currently supports IPv4 addresses and IPv4 CIDR
ranges.

## Security limitations

- The password comparison is intentionally small and does not provide user
  accounts, rate limiting, or audit logs.
- Basic Authentication must be used only over HTTPS.
- A lock marker in a PDF is informational and does not protect the target.
- Files published outside the protected route remain public.
- Test the deployed route from both an allowed and a disallowed network.

For sensitive or personally identifiable data, use an approved authenticated
document platform rather than static course-site middleware.
