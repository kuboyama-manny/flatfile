import Collection from 'api/lib/collection'

export default class DataModel extends Collection {
  static baseUrl = '/v1/models'
}

window.api.DataModel = DataModel
