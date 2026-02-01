import { describe, it, expect } from 'vitest'
import { isDev, isProd, API_BASE_URL, APP_CONFIG } from './env'

describe('Environment Configuration', () => {
  it('should have correct app config', () => {
    expect(APP_CONFIG.title).toBe('电商管理后台')
    expect(APP_CONFIG.version).toBe('1.0.0')
    expect(APP_CONFIG.description).toBe('现代化电商管理系统')
  })

  it('should have API base URL defined', () => {
    expect(API_BASE_URL).toBeDefined()
    expect(typeof API_BASE_URL).toBe('string')
  })

  it('should have environment flags defined', () => {
    expect(typeof isDev).toBe('boolean')
    expect(typeof isProd).toBe('boolean')
  })
})