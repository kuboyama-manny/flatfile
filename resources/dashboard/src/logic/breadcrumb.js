const onBreadcrumbChangeCallbacks = []

export default class Breadcrumb {
  static register(item) {
    return new Breadcrumb([ item ])
  }

  static onBreadcrumbChange(callback) {
    onBreadcrumbChangeCallbacks.push(callback)
  }

  constructor(items) {
    this.items = items
    onBreadcrumbChangeCallbacks.forEach(callback => callback(items))
  }

  register(item) {
    return new Breadcrumb([ ...this.items, item ])
  }
}
