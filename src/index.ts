import slugify from 'slugify'
import type { Middleware, MiddlewareParams, PrismaAction } from './types'

type Options = {
  /**
   * The function to use for generating the source text to slugify.
   * The string returned from this function will be used to generate the
   * slug that is saved to the database.
   *
   * By default, this will return the `.name` key of the passed-in
   * object.
   */
  source: (data: Record<string,any>) => string | Promise<string>

  /**
   * The function that is used to generate the slug for a given
   * source string.
   *
   * By default, this uses `slugify()`.
   */
  slugify: (source: string) => string | Promise<string>

  /**
   * Actions that this middleware will apply on. By default, this is
   * "create" and "update".
   */
  actions: PrismaAction[]

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

const DEFAULTS: Options = {
  source(params) {
    return params.args.data.name
  },

  slugify,

  actions: ['create', 'update'],

  onError(error) {
    console.error(error)
  }
}

export type PrismaSlugOptions = Partial<Options>

/**
 * Create a Prisma middleware that generates slugs in a field called
 * `slug` for models that have a field called `name`.
 *
 * @param options - Optional configuration for the middleware
 */
export default function PrismaSlug(options?: PrismaSlugOptions): Middleware {
  const {
    source,
    slugify,
    actions,
    onError,
    onDone,
  } = { ...DEFAULTS, ...options }

  if (!source) throw new TypeError('Invalid source() function')
  if (!slugify) throw new TypeError('Invalid slugify() function')
  if (!actions) throw new TypeError('Middleware must have actions')

  return async (params, next) => {
    if (actions.includes(params.action)) {
      try {
        const src = await source(params)

        if (src) {
          params.args.data.slug = await slugify(src)
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
