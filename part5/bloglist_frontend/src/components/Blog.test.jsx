import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, expect } from 'vitest'

describe('<Blog />', () => {

  let container
  let mockUpdate

  beforeEach(() => {
    const user = {
      name: 'Test User'
    }

    const blog = {
      title: 'Test Blog',
      author: 'John Smith',
      url: 'TestBlog.com',
      likes: 5,
      user: user
    }

    mockUpdate = vi.fn()

    container = render( <Blog blog={blog} user={user} updateBlog={mockUpdate}/> ).container

  })

  test('renders only visible information', () => {

    const element = screen.getByText('Test Blog John Smith')
    expect(element).toBeDefined

    const element2 = screen.getByText('TestBlog.com likes 5', { exact: false })
    expect(element2).toBeDefined

    const div = container.querySelector('.collapsible')
    expect(div).toHaveStyle('display: none')

  })

  test('renders url and likes when view button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.collapsible')
    expect(div).toHaveStyle('display: block')
  })

  test('calls like handler twice if like button is clicked twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockUpdate.mock.calls).toHaveLength(2)
  })

})