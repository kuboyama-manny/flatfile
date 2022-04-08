import Collection from 'api/lib/collection'

export default class Row extends Collection {
  static baseUrl = '/v1/rows'

  static async listFrom (batch_id) {
    return this.list({batch_id}, 1, 1000000)
  }
}

window.api.Row = Row
