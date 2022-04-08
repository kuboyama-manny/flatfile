import axios from 'axios'
import Authentication from 'logic/authentication'
import ResultSet from 'api/lib/result-set'

const { FLATFILE_API_BASE } = APP_CONFIG
const DEFAULT_PAGE_SIZE = 20

export default class APICollection {
  static get absoluteUrl () {
    if (!this.baseUrl) {
      throw new Error(`static baseUrl is not defined on ${this.name}`)
    }
    return `${FLATFILE_API_BASE}${this.baseUrl}`
  }

  static get config () {

    return {
      headers: {
        'Authorization': `Bearer ${Authentication.accessToken}`
      }
    }
  }

  static async handleResponse (promise, dataRequired=true) {
    try {
      const response = await promise
      this.validateResponse(response, dataRequired)
      return response.data
    } catch (error) {
      if (error.response) {
        this.validateResponse(error.response)
        throw error
      }
    }
  }

  static validateResponse (response, dataRequired=true) {
    if (response.status === 401) {
      Authentication.invalidateAccessToken()
      throw new Error('Access token expired')
    }

    if (response.status >= 400) {
      if (response.status === 422) {
          throw response;
      } else {
          throw new Error(`HTTP ${response.status}`)
      }
    }

    if (dataRequired && !response.data) {
      throw new Error('No data returned from request')
    }
  }

  static itemUrl (id) {
    if (!id) {
      throw new Error('id must be specified')
    }
    return `${this.absoluteUrl}/${id}`
  }

  static async create (payload) {
    if ('id' in payload) {
      throw new Error(`must not specify id when using ${this.name}.create()`)
    }
    const body = await this.handleResponse(
      axios.post(this.absoluteUrl, payload, this.config)
    )
    return body.data
  }

  static async delete (id) {
    const url = this.itemUrl(id)
    const body = await this.handleResponse(
      axios.delete(url, this.config),
      false
    )
    return body.data
  }

  static async get (id) {
    const url = this.itemUrl(id)
    const body = await this.handleResponse(
      axios.get(url, this.config)
    )
    return body.data
  }

  static async update (data) {
    const id = data.id
    const url = this.itemUrl(id)
    const body = await this.handleResponse(
      axios.patch(url, data, this.config)
    )
    return body.data
  }

  static async list (query={}, page=1, page_size=DEFAULT_PAGE_SIZE) {
    const makeRequest = async (params) => {
      return this.handleResponse(
        axios.get(this.absoluteUrl, { ...this.config, params })
      )
    }

    return ResultSet.getPage(makeRequest, query, page, page_size)
  }
}

window.api = {}
