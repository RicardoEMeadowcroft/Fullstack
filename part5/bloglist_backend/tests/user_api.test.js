const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const startUsers = [
    {
        username: 'hellas',
        password: 'password1',
        name: 'Arto Hellas'
    },
    {
        username: 'mluukkai',
        password: 'password2',
        name: 'Matti Luukkaninen'
    },
]

describe('when there is initially users saved', () => {
  beforeEach(async() => {
      await User.deleteMany({})
      await User.insertMany(startUsers)
  })

  test('all users are returned in json format', async () => {
    const response = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, startUsers.length)
  })

  describe('adding a new user',() => {
    test('succeeds with valid data', async () => {
      const newUser = {
        username: 'jsmith',
        password: '1234',
        name: 'John Smith'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const users = await User.find({})
      const usersAtEnd = users.map(user => user.toJSON())
      assert.strictEqual(usersAtEnd.length, startUsers.length + 1)

      const usernames = usersAtEnd.map(n => n.username)
      assert(usernames.includes('jsmith'))
    })

    test('returns a 400 error if the username already exists in the database', async () => {
      const newUser2 = {
        username: 'hellas',
        password: 'default',
        name: 'John Hellas'
      }

      await api
        .post('/api/users')
        .send(newUser2)
        .expect(400)
    })

    test('returns a 400 error if the username or password are less than 3 letters', async () => {
      const newUser3 = {
        username: 'he',
        password: 'default',
        name: 'John He'
      }

      await api
        .post('/api/users')
        .send(newUser3)
        .expect(400)

      const newUser4 = {
        username: 'jsmith',
        password: 'aa',
        name: 'John Smith'
      }

      await api
        .post('/api/users')
        .send(newUser4)
        .expect(400)
    })
  })

  /*describe('deleting a new blog',() => {
    test('succeeds with status code 204 if id is valid', async () => {
      const startingBlogs = await Blog.find({})
      const toDelete = startingBlogs[0]

      await api.delete(`/api/blogs/${toDelete.id}`)
        .expect(204)

      const endingBlogs = await Blog.find({})

      const titles = endingBlogs.map(n => n.title)
      assert(!titles.includes(toDelete.titles))

      assert.strictEqual(endingBlogs.length,startingBlogs.length - 1)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const startingBlogs = await Blog.find({})

      await api.delete(`/api/blogs/${1234}`).expect(400)

      const endingBlogs = await Blog.find({})

      assert.strictEqual(endingBlogs.length,startingBlogs.length)
    })
  })*/

  
  after(async () => {
    await mongoose.connection.close()
  })
})