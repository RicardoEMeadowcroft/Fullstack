const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'John Smith',
        username: 'jsmith',
        password: 'password'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'jsmith', 'password')
      await expect(page.getByText('John Smith logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'jsmith', 'wrong')

   	 	const errorDiv = page.locator('.error')
    	await expect(errorDiv).toContainText('wrong username or password')

      await expect(page.getByText('John Smith logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page, 'jsmith', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
			await createBlog(page,'A new blog', 'John Smith', 'www.example.com')
			
			await expect(page.getByText('a new blog A new blog by John Smith has been added')).toBeVisible()

			await expect(page.getByText('A new blog John Smith')).toBeVisible()

			await page.getByText('A new blog John Smith').getByRole('button', {name: 'view'}).click()

			await expect(page.getByText('www.example.com', {exact: false})).toBeVisible()	
    })

		test('a new blog can be liked', async ({ page }) => {
			await createBlog(page,'A new blog', 'John Smith', 'www.example.com')

			await page.getByText('A new blog John Smith').getByRole('button', {name: 'view'}).click()

			await expect(page.getByText('likes 0', {exact: false})).toBeVisible()		

			await page.getByText('A new blog John Smith').getByRole('button', {name: 'like'}).click()

			await expect(page.getByText('likes 1', {exact: false})).toBeVisible()		
    })
	
		test('a blog created by the user can be deleted', async ({ page }) => {
			page.on('dialog', async confirm => {
							expect(confirm.message()).toBe('Remove blog A new blog by John Smith')
							confirm.accept()
						})

			await createBlog(page,'A new blog', 'John Smith', 'www.example.com')

			await page.getByText('A new blog John Smith').getByRole('button', {name: 'view'}).click()

			await page.getByText('A new blog John Smith').getByRole('button', {name: 'remove'}).click()
			
			await expect(page.getByText('A new blog John Smith')).not.toBeVisible()

			await expect(page.getByText('blog was deleted')).toBeVisible()
    })

		test('the option to delete only appears on blogs created by the user', async ({ page, request}) => {
			await createBlog(page,'A new blog', 'John Smith', 'www.example.com')

			await page.getByText('A new blog John Smith').getByRole('button', {name: 'view'}).click()

			await expect(page.getByText('A new blog John Smith').getByRole('button', {name: 'remove'})).toBeVisible()

			await page.getByRole('button', {name: 'logout'}).click()

			await request.post('/api/users', {
				data: {
					name: 'Jane Smith',
					username: 'jsmith2',
					password: 'password'
				}
			})

			await loginWith(page, 'jsmith2', 'password')

			await page.getByText('A new blog John Smith').getByRole('button', {name: 'view'}).click()

			await expect(page.getByText('A new blog John Smith').getByRole('button', {name: 'remove'})).not.toBeVisible()
    })

		test('blogs are listed in order of likes', async ({ page }) => { 
			await createBlog(page,'A blog with 3 likes', 'John Smith', 'www.example.com')
			await createBlog(page,'A blog with 0 likes', 'John Smith', 'www.example.com')
			await createBlog(page,'A blog with 2 likes', 'John Smith', 'www.example.com')
			await createBlog(page,'A blog with 1 like', 'John Smith', 'www.example.com')

			let blog0 = page.getByText('A blog with 0 likes John Smith')
			let blog1 = page.getByText('A blog with 1 like John Smith')
			let blog2 = page.getByText('A blog with 2 likes John Smith')
			let blog3 = page.getByText('A blog with 3 likes John Smith')

			await blog0.getByRole('button', {name: 'view'}).click()
			await blog1.getByRole('button', {name: 'view'}).click()
			await blog2.getByRole('button', {name: 'view'}).click()
			await blog3.getByRole('button', {name: 'view'}).click()

			await blog1.getByRole('button', {name: 'like'}).click()
			await blog1.getByText('likes 1', { exact: false }).waitFor()

			await blog2.getByRole('button', {name: 'like'}).click()
			await blog2.getByText('likes 1', { exact: false }).waitFor()
			await blog2.getByRole('button', {name: 'like'}).click()
			await blog2.getByText('likes 2', { exact: false }).waitFor()

			await blog3.getByRole('button', {name: 'like'}).click()
			await blog3.getByText('likes 1', { exact: false }).waitFor()
			await blog3.getByRole('button', {name: 'like'}).click()
			await blog3.getByText('likes 2', { exact: false }).waitFor()
			await blog3.getByRole('button', {name: 'like'}).click()
			await blog3.getByText('likes 3', { exact: false }).waitFor()

			let blogList = page.getByTestId('blog-element')

			expect(blogList.nth(0)).toContainText('A blog with 3 likes')
			expect(blogList.nth(1)).toContainText('A blog with 2 likes')
			expect(blogList.nth(2)).toContainText('A blog with 1 like')
			expect(blogList.nth(3)).toContainText('A blog with 0 likes')
		})
		
  })

})