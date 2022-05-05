/**
 * @private
 */
export type PrismaAction =
  | 'findUnique'
  | 'findMany'
  | 'findFirst'
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'executeRaw'
  | 'queryRaw'
  | 'aggregate'
  | 'count'
  | 'runCommandRaw'

/**
 * These options are being passed in to the middleware as "params".
 *
 * @private
 */
export type MiddlewareParams<ModelName = string> = {
  /**
   * The name of the Prisma model the operation is running on.
   */
  model?: ModelName

  /**
   * Method used to trigger this request.
   */
  action: PrismaAction

  /**
   * The arguments passed into Prisma.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any

  /**
   * Where Prisma will be updating.
   */
  dataPath: string[]

  /**
   * Whether this is running in a transaction.
   */
  runInTransaction: boolean
}

/**
 * Type definition for Prisma middleware functions.
 *
 * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
 *
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware<T = any> = (
  params: MiddlewareParams,
  next: (params: MiddlewareParams) => Promise<T>
) => Promise<T>
