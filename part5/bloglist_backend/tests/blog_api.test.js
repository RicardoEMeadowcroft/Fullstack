const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
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
    let token = undefined

    beforeEach(async() => {
      await User.deleteMany({})

      const newUser = {
        username: 'jsmith',
        password: '1234',
        name: 'John Smith'
      }
      await api
        .post('/api/users')
        .send(newUser)

      const login = {
        username: 'jsmith',
        password: '1234'
      }

      const loginResponse = await api
        .post('/api/login')
        .send(newUser)

      token = loginResponse.body.token
    })

    test('succeeds with valid data', async () => {
      const newBlog = testBlogs.one

      await api
        .post('/api/blogs')
        .set("Authorization", "Bearer " + token)
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
        .set("Authorization", "Bearer " + token)
        .send(newBlog)

      const resultBlog = await Blog.findOne({title: 'Go To Statement Considered Damaging'})

      assert.strictEqual(resultBlog.likes, 0)
    })

    test('returns a 400 error if it has no title or url', async () => {
      const newBlog = testBlogs.noTitle

      await api
        .post('/api/blogs')
        .set("Authorization", "Bearer " + token)
        .send(newBlog)
        .expect(400)

      const newBlog2 = testBlogs.noUrl

      await api
        .post('/api/blogs')
        .set("Authorization", "Bearer " + token)
        .send(newBlog2)
        .expect(400)
    })

    test('returns a 401 error if token is not present or invalid', async () => {
      const newBlog = testBlogs.noTitle

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const newBlog2 = testBlogs.noUrl

      await api
        .post('/api/blogs')
        .set("Authorization", "Bearer " + "a")
        .send(newBlog2)
        .expect(401)
    })
  })

  describe('deleting a new blog',() => {
    let token = undefined
    let toDelete = undefined

    beforeEach(async() => {
      await User.deleteMany({})

      const newUser = {
        username: 'jsmith',
        password: '1234',
        name: 'John Smith'
      }
      await api
        .post('/api/users')
        .send(newUser)

      const login = {
        username: 'jsmith',
        password: '1234'
      }

      const loginResponse = await api
        .post('/api/login')
        .send(login)

      token = loginResponse.body.token

      const postResponse = await api
        .post('/api/blogs')
        .set("Authorization", "Bearer " + token)
        .send (testBlogs.one)

      toDelete = postResponse.body
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const startingBlogs = await Blog.find({})

      await api.delete(`/api/blogs/${toDelete.id}`)
        .set("Authorization", "Bearer " + token)
        .expect(204)

      const endingBlogs = await Blog.find({})

      const titles = endingBlogs.map(n => n.title)
      assert(!titles.includes(toDelete.titles))

      assert.strictEqual(endingBlogs.length,startingBlogs.length - 1)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const startingBlogs = await Blog.find({})

      await api.delete(`/api/blogs/${1234}`)
        .set("Authorization", "Bearer " + token)
        .expect(400)

      const endingBlogs = await Blog.find({})

      assert.strictEqual(endingBlogs.length,startingBlogs.length)
    })

    
    test('fails with status code 401 if token is not added or is invalid', async () => {
      const startingBlogs = await Blog.find({})

      await api.delete(`/api/blogs/${toDelete.id}`)
        .expect(401)

      const endingBlogs1 = await Blog.find({})

      assert.strictEqual(endingBlogs1.length,startingBlogs.length)

      await api.delete(`/api/blogs/${toDelete.id}`)
        .set("Authorization", "Bearer " + "a")
        .expect(401)

      const endingBlogs2 = await Blog.find({})

      assert.strictEqual(endingBlogs2.length,startingBlogs.length)
    })

    test('fails with status code 401 if blog is not created by user', async () => {
      const secondUser = {
        username: 'jsmith2',
        password: '1234',
        name: 'John Smith II'
      }
      await api
        .post('/api/users')
        .send(secondUser)

      const secondLogin = {
        username: 'jsmith2',
        password: '1234'
      }

      const loginResponse = await api
        .post('/api/login')
        .send(secondLogin)

      wrongToken = loginResponse.body.token
      
      const startingBlogs = await Blog.find({})

      await api.delete(`/api/blogs/${toDelete.id}`)
        .set("Authorization", "Bearer " + wrongToken)
        .expect(401)

      const endingBlogs = await Blog.find({})

      assert.strictEqual(endingBlogs.length,startingBlogs.length)
    })
  })

  

  describe('updating a blog\'s likes',() => {
    test('succeeds with valid like amount', async () => {
      const Blogs = await Blog.find({})
      const toModify = Blogs[0]

      await api.put(`/api/blogs/${toModify.id}`)
        .send({likes: 1})
        .expect(200)

      const newBlogs = await Blog.find({})
      const modified = newBlogs[0]

      assert.strictEqual(modified.likes, 1)
    })

    test('fails with status code 400 if like isn\'t number or negative', async () => {
      const Blogs = await Blog.find({})
      const toModify = Blogs[0]

      await api.put(`/api/blogs/${toModify.id}`)
        .send({likes: 'a'})
        .expect(400)

      await api.put(`/api/blogs/${toModify.id}`)
        .send({likes: -1})
        .expect(400)
    })

    test('fails with status code 400 if id doesn\'t exist', async () => {
      await api.put(`/api/blogs/${1234}`)
        .send({likes: 1})
        .expect(400)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})