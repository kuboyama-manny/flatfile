import Collection from 'api/lib/collection'

export default class Batch extends Collection {
  static baseUrl = '/v1/batches'
}

window.api.Batch = Batch
