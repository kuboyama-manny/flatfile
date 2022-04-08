import Collection from 'api/lib/collection'

export default class EndUser extends Collection {
  static baseUrl = '/v1/end-users'

  // static async getFrom (id, batchId) {
  //   return this.get(`${id}?batch_id=${batchId}`)
  // }
}

window.api.EndUser = EndUser
