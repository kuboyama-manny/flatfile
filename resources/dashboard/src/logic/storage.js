export default class Storage {
  constructor(key) {
    this.key = key
    this.localStorage = window.localStorage
  }

  get fullKey() {
    return `storage:${this.key}`
  }

  set(value) {
    const serializedValue = JSON.stringify(value)
    this.localStorage.setItem(this.fullKey, serializedValue)
  }

  get() {
    const serializedValue = this.localStorage.getItem(this.fullKey)
    if (typeof serializedValue === 'string') {
      return JSON.parse(serializedValue)
    }
    return null
  }

  clear() {
    this.localStorage.removeItem(this.fullKey)
  }

  exists() {
    return this.get() !== null
  }
}
