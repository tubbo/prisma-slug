# prisma-slug

Slug middleware for Prisma.

## Getting Started

Install the library:

```bash
yarn add prisma-slug
```

Then, include it in the file you use to instantiate your Prisma client:

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaSlug } from 'prisma-slug'

export const db = new PrismaClient()

db.use(PrismaSlug())
```

## Usage

The `PrismaSlug()` function outputs a middleware that will convert model
fields called `name` into a URL-safe slug and persist that to a field
called `slug` on the same model. You can customize how this works by
passing options into the function. For example, if you wanted to convert
`title` fields as well as `name`, you'd configure the middleware like
so:

```typescript
db.use(
  PrismaSlug({
    source(data) {
      return data.name ?? data.title
    },
  })
)
```

You can also configure the function used to generate the slug:

```typescript
import slug from 'slug'

db.use(
  PrismaSlug({
    slugify: slug,
  })
)
```

For a full list of options, view the documentation at
https://tubbo.github.io/prisma-slug.
