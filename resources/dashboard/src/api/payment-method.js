import Collection from 'api/lib/collection'
import axios from 'axios'

const { SPARK_API_BASE } = APP_CONFIG

export default class Billing extends Collection {
  static baseUrl = `/settings/company`
  static baseUrlForCardInfo = '/settings/company/json'

  static get updateCardUrl () {
    if (!this.baseUrl) {
      throw new Error(`static baseUrl is not defined on ${this.name}`)
    }
    return `${SPARK_API_BASE}${this.baseUrl}`
  }

  static MainUrl (id) {
    if (!id) {
      throw new Error('id must be specified')
    }
    return `${this.updateCardUrl}/${id}/payment-method`
  }

  static async handleResponseForBilling (promise, dataRequired = true) {
    try {
      const response = await promise
      this.validateResponse(response, dataRequired)
      return response
    } catch (error) {
      if (error.response) {
        this.validateResponse(error.response)
        throw error
      }
    }
  }

  static get getCardInfosUrl () {
    if (!this.baseUrlForCardInfo) {
      throw new Error(`static baseUrl is not defined on ${this.name}`)
    }

    return `${SPARK_API_BASE}${this.baseUrlForCardInfo}`
  }

  static getCardInfosTeamUrl (id) {
    if (!id) {
      throw new Error('id must be specified')
    }
    return `${this.getCardInfosUrl}/${id}`
  }

  static async update (data) {
    const url = this.MainUrl(data.id)
    const body = await this.handleResponseForBilling(
      axios.put(url, data, this.config),
      false
    )
    return body
  }

  static async getCardInfos (data) {
    const url = this.getCardInfosTeamUrl(data)
    const body = await this.handleResponse(axios.get(url, this.config))
    return body
  }
}

window.api.Billing = Billing
