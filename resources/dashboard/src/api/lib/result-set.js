export default class ResultSet {
  constructor (makeRequest, query, records, meta) {
    this.makeRequest = makeRequest
    this.query = query
    this.records = records
    this.meta = meta
  }

  static async getPage (makeRequest, query, page, page_size) {
    const result = await makeRequest({ ...query, page_size, page })
    return new ResultSet(makeRequest, query, result.data, result.meta)
  }

  get currentPage () {
    return this.meta.current_page
  }

  get lastPage () {
    return this.meta.last_page
  }

  get pageSize () {
    return parseInt(this.meta.per_page)
  }

  get totalCount () {
    return this.meta.total
  }

  get range () {
    return [ this.meta.from, this.meta.to ]
  }

  get hasNextPage () {
    return this.meta.to < this.meta.total
  }

  get nextPage () {
    if (!this.hasNextPage) {
      throw new Error('Out of bounds: no next page available')
    }
    return ResultSet.getPage(this.makeRequest, this.query, this.page + 1, this.pageSize)
  }

  get hasPrevPage () {
    return this.meta.from > 1
  }

  get prevPage () {
    if (!this.hasPrevPage) {
      throw new Error('Out of bounds: no previous page available')
    }
    return ResultSet.getPage(this.makeRequest, this.query, this.page - 1, this.pageSize)
  }

  hasPage (pageNumber) {
    return this.meta.per_page * (pageNumber - 1) < this.meta.total
  }

  page (pageNumber) {
    if (!this.hasPage(pageNumber)) {
      throw new Error(`Out of bounds: page ${pageNumber} not available`)
    }
    return ResultSet.getPage(this.makeRequest, this.query, pageNumber, this.pageSize)
  }

  goto (id) {
    throw new Error('Not yet implemented')
  }
}
