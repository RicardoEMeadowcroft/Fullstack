import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

test('form calls event handler with correct props', async () => {
  const mockCreate = vi.fn()
  const user = userEvent.setup()

  const container = render( <BlogForm createBlog={mockCreate} /> ).container

  const title = container.querySelector('#blog-form-title')
  const author = container.querySelector('#blog-form-author')
  const url = container.querySelector('#blog-form-url')
  const sendButton = screen.getByText('create')

  await user.type(title, 'Test Blog')
  await user.type(author, 'Test Author')
  await user.type(url, 'Test Url')
  await user.click(sendButton)

  expect(mockCreate.mock.calls).toHaveLength(1)
  expect(mockCreate.mock.calls[0][0]).toStrictEqual({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'Test Url'
  })
})