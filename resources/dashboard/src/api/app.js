import Collection from 'api/lib/collection'
import axios from 'axios';

const { SPARK_API_BASE } = APP_CONFIG;

export default class App extends Collection {
    static baseUrl = `/user/current`;
    static addTeamBaseUrl = `/settings/company`;
    static baseLicenseUrl = `/api/v1/licenses`

    static get getAllTeamsUrl () {
        if (!this.baseUrl) {
            throw new Error(`static baseUrl is not defined on ${this.name}`)
        }
        return `${SPARK_API_BASE}${this.baseUrl}`
    }

    static get getAllLicenseListUrl () {
        if (!this.baseLicenseUrl) {
          throw new Error(`static baseUrl is not defined on ${this.name}`)
        }
        return `${SPARK_API_BASE}${this.baseLicenseUrl}`
    }

    static mapQueryString (queryParam) {
      const esc = encodeURIComponent
      if (!queryParam) {
        throw new Error('queryParam must be specified')
      }
      return Object.keys(queryParam).map(k => `${esc(k)}=${esc(queryParam[k])}`).join('&')
    }

    static MainLicenseUrl (url, queryParam) {
        const queryString = this.mapQueryString(queryParam)
        if (!queryParam) {
          throw new Error('queryParam must be specified')
        }
        return `${url}?${queryString}`
    }

    static get  addTeamUrl () {
        if (!this.baseUrl) {
            throw new Error(`static baseUrl is not defined on ${this.name}`)
        }
        return `${SPARK_API_BASE}${this.addTeamBaseUrl}`
    }

    static async handleResponseForSwitch (promise, dataRequired=true) {
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

    static async getAllTeam () {
        const url = this.getAllTeamsUrl;
        const body = await this.handleResponse(
            axios.get(url, this.config));
        return body
    }

    static async addOneTeam (data) {
        const url = this.addTeamUrl;
        const body = await this.handleResponseForSwitch(
            axios.post(url, data, this.config),
            false
        );
        return body
    }

    static async getAllLicenseUsers (queryParam) {
        const url = this.MainLicenseUrl(this.getAllLicenseListUrl, queryParam);
        const body = await this.handleResponse(
          axios.get(url, this.config));
        return body
    }
}

window.api.App = App;