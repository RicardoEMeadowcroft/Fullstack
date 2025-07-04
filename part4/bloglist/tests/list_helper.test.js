const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const testBlog = require('./test_blogs')


test('dummy returns one', () => {
  console.log(testBlog.one)

  const result = listHelper.dummy(testBlog.zero)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  
  test('of an empty list is zero', () => {
    const result = listHelper.totalLikes(testBlog.zero)
    assert.strictEqual(result, 0)
  })


  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(testBlog.one)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated light', () => {
    const result = listHelper.totalLikes(testBlog.many)
    assert.strictEqual(result, 36)
  })

})

describe('total likes', () => {
  
  test('of an empty list is zero', () => {
    const result = listHelper.totalLikes(testBlog.zero)
    assert.strictEqual(result, 0)
  })


  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(testBlog.one)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testBlog.many)
    assert.strictEqual(result, 36)
  })

})

describe('favorite blog', () => {

  const oneBlog =   {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }

  const manyBlog = {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  }
  
  test('of an empty list is undefined', () => {
    const result = listHelper.favoriteBlog(testBlog.zero)
    assert.deepStrictEqual(result, undefined)
  })


  test('when list has only one blog, equals that log', () => {
    const result = listHelper.favoriteBlog(testBlog.one)
    assert.deepStrictEqual(result, oneBlog)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(testBlog.many)
    assert.deepStrictEqual(result, manyBlog)
  })

})

describe('most blogs', () => {

  const oneBlog =   {
    author: 'Edsger W. Dijkstra',
    blogs: 1
  }

  const manyBlog = {
    author: "Robert C. Martin",
    blogs: 3
  }
  
  test('of an empty list is undefined', () => {
    const result = listHelper.mostBlogs(testBlog.zero)
    assert.deepStrictEqual(result, undefined)
  })


  test('when list has only one blog, equals a dict with blogs having value 1', () => {
    const result = listHelper.mostBlogs(testBlog.one)
    assert.deepStrictEqual(result, oneBlog)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(testBlog.many)
    assert.deepStrictEqual(result, manyBlog)
  })

})

describe('most likes', () => {

  const oneBlog =   {
    author: 'Edsger W. Dijkstra',
    likes: 5
  }

  const manyBlog = {
    author: "Edsger W. Dijkstra",
    likes: 17
  }
  
  test('of an empty list is undefined', () => {
    const result = listHelper.mostLikes(testBlog.zero)
    assert.deepStrictEqual(result, undefined)
  })


  test('when list has only one blog, equals a dict with blogs having value 1', () => {
    const result = listHelper.mostLikes(testBlog.one)
    assert.deepStrictEqual(result, oneBlog)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(testBlog.many)
    assert.deepStrictEqual(result, manyBlog)
  })

})