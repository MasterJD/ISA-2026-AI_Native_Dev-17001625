import { describe, expect, it } from 'vitest'
import App from './App'

describe('App grader smoke', () => {
  it('exports a defined root component', () => {
    expect(App).toBeTruthy()
  })
})