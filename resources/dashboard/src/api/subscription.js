import Collection from 'api/lib/collection'
import axios from 'axios';

const { SPARK_API_BASE } = APP_CONFIG

export default class Subscription extends Collection {
    static baseUrl = `/settings/company`;
    static baseUrlForPlans = `/spark/plans`;

    static get getPlansUrl () {
        if (!this.baseUrlForPlans) {
            throw new Error(`static baseUrl is not defined on ${this.name}`)
        }
        return `${SPARK_API_BASE}${this.baseUrlForPlans}`
    }

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
        return `${this.updateCardUrl}/${id}/subscription`
    }

    static async getPlans () {
        const url = this.getPlansUrl;
        const body = await this.handleResponse(
            axios.get(url, this.config));
        return body
    }

    static async handleResponseForSubscription (promise, dataRequired=true) {
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

    static async subscribePlan(data) {
        const url = this.MainUrl(data.id);
        const body = await this.handleResponseForSubscription(
            axios.post(url, data, this.config),
            false
        )
        return body
    }

    static async updatePlan(data) {
        const url = this.MainUrl(data.id);
        const payload = { plan: data.plan }
        const body = await this.handleResponseForSubscription(
            axios.put(url, payload, this.config),
            false
        )
        return body
    }
}

window.api.Subscription = Subscription;