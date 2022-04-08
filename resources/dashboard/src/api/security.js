import Collection from 'api/lib/collection'
import axios from 'axios'

const { SPARK_API_BASE } = APP_CONFIG

export default class Security extends Collection {
    static baseUrl = `/settings/password`;

    static get updatePasswordUrl () {
        if (!this.baseUrl) {
            throw new Error(`static baseUrl is not defined on ${this.name}`)
        }
        return `${SPARK_API_BASE}${this.baseUrl}`
    }

    static async handleResponseForSecurity (promise, dataRequired=true) {
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

    static async updateCurrentPassword(data) {
        const url = this.updatePasswordUrl;
        const body = await this.handleResponseForSecurity(
            axios.put(url, data, this.config),
            false
        );
        return body
    }
}

window.api.Security = Security;