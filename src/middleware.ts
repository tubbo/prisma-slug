import slugify from 'slugify'
import type { Middleware, MiddlewareParams } from './types'

/**
 * Options that can be passed into the `PrismaSlug()` function.
 */
export type PrismaSlugOptions = {
  /**
   * The function to use for generating the source text to slugify.
   * The string returned from this function will be used to generate the
   * slug that is saved to the database.
   *
   * By default, this will return the `.name` key of the passed-in
   * object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: (data: Record<string, any>) => string | Promise<string>

  /**
   * The function that is used to generate the slug for a given
   * source string.
   *
   * By default, this uses `slugify()`.
   */
  slugify: (
    source: string,
    params: MiddlewareParams
  ) => string | Promise<string>

  /**
   * Determine whether to generate a slug for this particular record. By
   * default, this ensures that the `params.action` is either "create" or
   * "delete".
   */
  willGenerate: (params: MiddlewareParams) => boolean

  /**
   * Configure what happens when an error occurs generating a slug or
   * finding the source.
   *
   * By default, the error is printed to STDERR.
   */
  onError: (error: unknown) => void

  /**
   * Additional logic to perform after the slug has been generated.
   */
  onDone?: (params: MiddlewareParams) => void
}

const DEFAULTS: PrismaSlugOptions = {
  source(params) {
    return params.args.data.name
  },

  slugify(source) {
    return slugify(source)
  },

  willGenerate(params) {
    return ['create', 'update'].includes(params.action)
  },

  onError(error) {
    console.error(error)
  },
}

/**
 * Create a Prisma middleware that generates slugs in a field called
 * `slug` for models that have a field called `name`.
 *
 * @param options - Optional configuration for the middleware
 */
export function PrismaSlug(options?: Partial<PrismaSlugOptions>): Middleware {
  const { source, slugify, willGenerate, onError, onDone } = {
    ...DEFAULTS,
    ...options,
  }

  return async (params, next) => {
    if (willGenerate(params)) {
      try {
        const src = await source(params)

        if (src) {
          params.args.data.slug = await slugify(src, params)
        }
      } catch (error) {
        onError(error)
      } finally {
        if (onDone) {
          onDone(params)
        }
      }
    }

    return next(params)
  }
}
