# Path Utilities Guide

This app uses `basePath: '/ponder'` configured in `next.config.ts`. This means all routes are automatically prefixed with `/ponder`.

## Usage Rules

### ✅ When to use `appPath()` or `getAppUrl()`

**Server-side `redirect()` only:**
```typescript
import { redirect } from "next/navigation";
import { appPath } from "@/lib/paths";

// In server components or route handlers
redirect(appPath("/auth/login")); // ✓ Redirects to /ponder/auth/login
```

**Email links and external URLs:**
```typescript
import { getAppUrl } from "@/lib/paths";

// For Supabase email redirects or any full URL needed
emailRedirectTo: getAppUrl("/auth/confirm"); // ✓ Returns https://domain.com/ponder/auth/confirm
```

### ❌ When NOT to use `appPath()`

**Client-side `router.push()`:**
```typescript
import { useRouter } from "next/navigation";

// ❌ WRONG - Double prefix!
router.push(appPath("/protected")); // Goes to /ponder/ponder/protected

// ✓ CORRECT - Next.js adds basePath automatically
router.push("/protected"); // Goes to /ponder/protected
```

**`<Link>` components:**
```typescript
import Link from "next/link";

// ❌ WRONG
<Link href={appPath("/protected")}>...</Link>

// ✓ CORRECT - Next.js adds basePath automatically
<Link href="/protected">...</Link>
```

## Why This Matters

Next.js automatically prepends `basePath` to:
- All `router.push()` calls
- All `<Link href>` values
- All asset imports
- All API routes

But it does NOT add basePath to:
- Server-side `redirect()` calls
- Manual URL construction
- External URLs

## Available Exports

```typescript
// The basePath constant
export const BASE_PATH = '/ponder';

// Add basePath to a path
export function appPath(path: string): string

// Get full URL with basePath (includes origin)
export function getAppUrl(path: string = ''): string
```

## Quick Reference

| Use Case | Use This |
|----------|----------|
| `router.push()` | Plain path: `"/protected"` |
| `<Link href>` | Plain path: `"/protected"` |
| Server `redirect()` | `appPath("/protected")` |
| Email links | `getAppUrl("/protected")` |
| Full URLs | `getAppUrl("/protected")` |
