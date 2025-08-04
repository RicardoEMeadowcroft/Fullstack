import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const newUser = JSON.parse(loggedUserJSON)
      setUser(newUser)
      blogService.setToken(newUser.token)
      console.log(newUser)
    }
    else {
      setUser(null)
      blogService.setToken(null)
    }
  }, [])

  const login = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      console.log(user)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      console.log(exception)
      notificationRef.current.setNotification('wrong username or password', true)
    }
  }

  const handleLogout = (event) => {
    if (window.localStorage.getItem('loggedNoteappUser')) {
      window.localStorage.removeItem('loggedNoteappUser')
    }
    else {
      notificationRef.current.setNotification('user already logged out', true)
    }
    blogService.setToken(null)
    setUser(null)
  }

  const loginPart = () => (
    <div>
      <h2>blogs</h2>
      <LoginForm login = {login} />
    </div>
  )

  const createBlog = async (blogObject) => {
    if (!window.localStorage.getItem('loggedNoteappUser')) {
      notificationRef.current.setNotification('user already logged out', true)
      blogService.setToken(null)
      setUser(null)
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...returnedBlog, 'user': user }))
      notificationRef.current.setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} has been added`, false)
    } catch (error) {
      notificationRef.current.setNotification('invalid blog or session', true)
    }
  }

  const updateBlog = async (id,blogObject) => {
    if (!window.localStorage.getItem('loggedNoteappUser')) {
      notificationRef.current.setNotification('user already logged out', true)
      blogService.setToken(null)
      setUser(null)
    }

    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id === id ? { ...returnedBlog, 'user': blog.user } : blog))
      notificationRef.current.setNotification(`added like to ${returnedBlog.title}`, false)
    } catch (error) {
      notificationRef.current.setNotification('invalid blog or session', true)
    }
  }

  const deleteBlog = async (id) => {
    if (!window.localStorage.getItem('loggedNoteappUser')) {
      notificationRef.current.setNotification('user already logged out', true)
      blogService.setToken(null)
      setUser(null)
    }

    try {
      const returnedBlog = await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      notificationRef.current.setNotification('blog was deleted', false)
    } catch (error) {
      notificationRef.current.setNotification('invalid blog or session', true)
    }
  }

  const blogPart = () => (
    <div>
      <h2>blogs</h2>

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button> </p>

      <h2>create new </h2>

      <Togglable buttonLabel='new blog'>
        <BlogForm createBlog={createBlog}/>
      </Togglable>

      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>
      )}
    </div>
  )

  const notificationRef = useRef()

  return (
    <div>
      <Notification ref={notificationRef}/>
      {user === null ? loginPart() : blogPart()}
    </div>
  )
}

export default App