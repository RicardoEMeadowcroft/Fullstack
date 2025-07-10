const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const user = request.user
  
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'token invalid' })
  }
})

blogRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }

    blog.title = title ? title : blog.title
    blog.author = author ? author : blog.author
    blog.url = url ? url : blog.author
    blog.likes = likes ? likes : blog.likes
    
    const updated = await blog.save()
    response.json(updated)
    return updated
})

module.exports = blogRouter
