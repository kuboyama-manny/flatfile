import Collection from 'api/lib/collection'
import axios from 'axios';

const { SPARK_API_BASE } = APP_CONFIG

export default class Invitation extends Collection {
    static baseUrl = `/settings/company`;
    static deleteUrlForEmail = `/settings/invitations`;

    static get getMailedUsersUrl () {
        if (!this.baseUrl) {
            throw new Error(`static baseUrl is not defined on ${this.name}`)
        }
        return `${SPARK_API_BASE}${this.baseUrl}`
    }

    static get deleteEmailUrl () {
        if (!this.deleteUrlForEmail) {
            throw new Error(`static baseUrl is not defined on ${this.name}`)
        }
        return `${SPARK_API_BASE}${this.deleteUrlForEmail}`
    }

    static get deleteMemberUrl () {
        if (!this.baseUrl) {
            throw new Error(`static baseUrl is not defined on ${this.name}`)
        }
        return `${SPARK_API_BASE}${this.baseUrl}`
    }

    static mailedUserUrl (id) {
        if (!id) {
            throw new Error('id must be specified')
        }
        return `${this.getMailedUsersUrl}/${id}/invitations`
    }

    static DeleteUserUrl (id) {
        if (!id) {
            throw new Error('id must be specified')
        }
        return `${this.deleteEmailUrl}/${id}`
    }

    static DeleteSelectedMemberUrl (teamId, memberId) {
        if (!teamId || !memberId) {
            throw new Error('id must be specified')
        }
        return `${this.deleteMemberUrl}/${teamId}/members/${memberId}`
    }

    static async getMailedUsers (id) {
        const url = this.mailedUserUrl(id);
        const body = await this.handleResponse(
            axios.get(url, this.config));
        return body
    }

    static async handleResponseForInvitation (promise, dataRequired=true) {
        try {
            const response = await promise;
            this.validateResponse(response, dataRequired);
            return response
        } catch (error) {
            if (error.response) {
                this.validateResponse(error.response);
                throw error
            }
        }
    }

    static async sendInvitationToEmail(data) {
        const url = this.mailedUserUrl(data.id);
        const body = await this.handleResponseForInvitation(
            axios.post(url, data.data, this.config),
            false
        );
        return body
    }

    static async deleteEmail(data) {
        const url = this.DeleteUserUrl(data);
        const body = await this.handleResponseForInvitation(
            axios.delete(url, this.config),
            false
        );
        return body
    }

    static async deleteSelectedMember(data) {
        const url = this.DeleteSelectedMemberUrl(data.teamId, data.memberId);
        const body = await this.handleResponseForInvitation(
            axios.delete(url, this.config),
            false
        );
        return body
    }
}

window.api.Invitation = Invitation;
