import PrismaSlug from './'
import type { MiddlewareParams, PrismaAction } from './types'

const next = () => Promise.resolve({})

test('slugify name', () => {
  const middleware = PrismaSlug()
  const params: MiddlewareParams = {
    action: 'create' as PrismaAction,
    args: {
      data: {
        name: 'Foo Bar Baz',
      },
    },
    dataPath: [],
    runInTransaction: false,
  }

  middleware(params, next)

  expect(params.args.data.slug).toEqual('foo-bar-baz')
})

test('slugify custom field', () => {
  const middleware = PrismaSlug({
    source(data) {
      return data.title
    },
  })
  const params: MiddlewareParams = {
    action: 'create' as PrismaAction,
    args: {
      data: {
        title: 'Foo Bar Baz',
      },
    },
    dataPath: [],
    runInTransaction: false,
  }

  middleware(params, next)

  expect(params.args.data.slug).toEqual('foo-bar-baz')
})

test('use custom slugifier', () => {
  const middleware = PrismaSlug({
    slugify(value) {
      return `${value} Bat!`
    },
  })
  const params: MiddlewareParams = {
    action: 'create' as PrismaAction,
    args: {
      data: {
        title: 'Foo Bar Baz',
      },
    },
    dataPath: [],
    runInTransaction: false,
  }

  middleware(params, next)

  expect(params.args.data.slug).toEqual('Foo Bar Baz Bat!')
})
