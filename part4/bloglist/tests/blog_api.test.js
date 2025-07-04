const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testBlogs = require('./test_blogs')

const api = supertest(app)

describe('when there is initially blogs saved', () => {
  beforeEach(async() => {
      await Blog.deleteMany({})
      await Blog.insertMany(testBlogs.many)
  })

  test('all blogs are returned in json format', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, testBlogs.many.length)
  })

  test('blog identifier is named id', async () => {
    const response = await api.get('/api/blogs')

    assert.ifError(response.body.id)
    assert.strictEqual(response.body._id, undefined)
  })

  describe('adding a new blog',() => {
    test('succeeds with valid data', async () => {
      const newBlog = testBlogs.one

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notes = await Blog.find({})
      const notesAtEnd = notes.map(note => note.toJSON())
      assert.strictEqual(notesAtEnd.length, testBlogs.many.length + 1)

      const titles = notesAtEnd.map(n => n.title)
      assert(titles.includes('Go To Statement Not Considered Harmful'))
    })

    test('succeeds and defaults to zero likes with no like field', async () => {
      const newBlog = testBlogs.noLikes

      await api
        .post('/api/blogs')
        .send(newBlog)

      const resultBlog = await Blog.findOne({title: 'Go To Statement Considered Damaging'})

      assert.strictEqual(resultBlog.likes, 0)
    })

    test('returns a 400 error if it has no title or url', async () => {
      const newBlog = testBlogs.noTitle

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const newBlog2 = testBlogs.noUrl

      await api
        .post('/api/blogs')
        .send(newBlog2)
        .expect(400)
    })
  })

  describe('adding a new blog',() => {
    test('succeeds with status code 204 if id is valid', async () => {
      const startingBlogs = await Blog.find({})
      const toDelete = startingBlog[0]

      await api.delete('/api/notes${toDelete.id}')
        .expect(204)

      const endingBlogs = await Blog.find({})

      const contents = endingBlogs.map(n => n.content)
      assert(!contents.includes(toDelete.content))

      assert.strictEqual(endingBlogs.length,startingBlogs.length - 1)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const startingBlogs = await Blog.find({})

      await api.delete('a').expect(400)

      const endingBlogs = await Blog.find({})

      assert.strictEqual(endingBlogs.length,startingBlogs.length)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})