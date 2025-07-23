import { useState} from 'react'

const Blog = ({ blog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [displayed, setDisplayed] = useState(false)

  const displayStyle = { display: displayed ? '' : 'none' }

  const toggleDisplayed = () => {
    setDisplayed(!displayed)
  }

  const handleLike = () => {
    updateBlog(blog.id,{
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url, 
      likes: blog.likes+1
    })
    console.log("liked!")
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleDisplayed}>{displayed ? "hide" : "view"}</button>
      <div style={displayStyle}>
        {blog.url} <br/>
        likes {blog.likes} <button onClick={handleLike}>like</button> <br/>
        {blog.user.name}
      </div>
    </div> 
  ) 
}

export default Blog