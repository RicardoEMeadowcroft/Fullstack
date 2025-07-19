const collection = require('lodash/collection')
const blog = require("../models/blog")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined
  return blogs.reduce((prev, curr) => curr.likes > prev.likes? curr : prev) 
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined
  const blogNumbers = collection.countBy(blogs, 'author')
  let result = { author: '', blogs: 0 }
  Object.entries(blogNumbers).forEach(([author, amount]) => { 
    if (amount >= result.blogs) {
      result.author = author
      result.blogs = amount
    }
  })
  return result
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined
  const blogAuthors = collection.groupBy(blogs, 'author')
  let result = { author: '', likes: 0 }
  Object.entries(blogAuthors).forEach(([author, authorBlogs]) => { 
    const amount = totalLikes(authorBlogs)
    if (amount >= result.likes) {
      result.author = author
      result.likes = amount
    }
  })
  return result
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }