# prisma-slug

A slugification middleware for Prisma. It generates slugs for your
models by using other model attributes with logic that you can define.
It's bundled with the excellent [slugify][] package and comes with
reasonable defaults to let you define your Prisma schema without
worrying about how you're going to generate URL-safe slugs.

## Getting Started

Install the library:

    yarn add prisma-slug

Then, include it in the file you use to instantiate your Prisma client:

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaSlug } from 'prisma-slug'

const db = new PrismaClient()

db.use(PrismaSlug())

export default db
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
    source(params) {
      return params.args.data.name ?? params.args.data.title
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

Both the `source()` and `slugify()` functions can return promises as
well.

For a full list of options, view the documentation at
https://tubbo.github.io/prisma-slug/modules.html#PrismaSlugOptions.

### Configuring Slugify Options

To configure [slugify][], define PrismaSlug's `slugify()` function and
pass in the options like so:

```typescript
import slugify from 'slugify'

db.use(
  PrismaSlug({
    slugify(value) {
      return slugify(value, {
        /* ...your options... */
      })
    },
  })
)
```

### Unique Slugs

Customize the `slugify()` function to keep generating slugs until it
finds one that's unique:

```typescript
import { camelCase } from 'camel-case'
import slugify from 'slugify'

db.use(
  PrismaSlug({
    async slugify(source, params) {
      const method = camelCase(params.model)
      const collection = db[method]
      let slug = slugify(source)
      let attempt = 0

      while ((await collection.count({ where: { slug } })) > 0) {
        attempt += 1
        slug = `${slug}-${attempt}`
      }

      return slug
    },
  })
)
```

## Development

This project uses Yarn Plug'n'Play and Zero-Installs, meaning you don't
need to run `yarn install` to begin developing. However, depending on
your editor you may need to install an [editor SDK][].

To run tests:

    yarn test

To run lint checks:

    yarn lint

To run type checks:

    yarn types

You can build the library by running:

    yarn build

And tear it down:

    yarn clean

Upon committing, your code will be automatically formatted and your
commit message checked to make sure it follows the [conventional
commits][] standard. All pull requests have tests, lint checks,
formatting checks, type checks, and package security checks run against
them.

[slugify]: https://www.npmjs.com/package/slugify
[editor sdk]: https://yarnpkg.com/getting-started/editor-sdks
[conventional commits]: https://www.conventionalcommits.org/en/v1.0.0/
