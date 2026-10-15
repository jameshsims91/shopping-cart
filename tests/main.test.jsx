import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router'
import routes from '../src/routes'

vi.mock('react-dom/client', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    createRoot: vi.fn(actual.createRoot),
  }
})

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    RouterProvider: vi.fn(actual.RouterProvider),
  }
})

describe('main entry point', () => {
  let container
  let root

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    container = document.getElementById('root')
    root = createRoot(container)
  })

  test('mounts the application in the root element', async () => {
    await act(async () => {
      root.render(
        <StrictMode>
          <RouterProvider router={routes} />
        </StrictMode>
      )
    })

    expect(container).toBeInTheDocument()
    expect(container.querySelector('nav')).toBeInTheDocument()
    expect(container.querySelector('main')).toBeInTheDocument()
  })

  afterEach(() => {
    act(() => {
      root.unmount()
    })
  })
})
