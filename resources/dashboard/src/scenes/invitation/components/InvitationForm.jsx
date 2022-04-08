import React, { Component } from 'react'
import { RSButton, RSInput } from 'reactsymbols-kit'
import styles from './styles.scss'

class InvitationForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
          emailAddress: ''
        };

        this.onChangeEmailAddress = this.onChangeEmailAddress.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        nextProps.successAlert && this.setState({ emailAddress: '' })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        var formData = {
            busy: true,
            email: this.state.emailAddress,
            role: 'member',
            successful: false,
            errors: {
                errors: {}
            }
        };

        this.props.sendInvitationToEmail(formData);

    };

    onChangeEmailAddress(value) {
        this.setState({ emailAddress: value })
    };

    render () {
        const { sendInvitationUsersError, sendInvitationUsersLoading } = this.props;

        return (
            <div className={styles.formContainer}>
                <form onSubmit={this.handleSubmit}>
                    <div className={styles.formInput}>
                        <label id="email" className={styles.inputTitle}>Email address</label>
                        <div className={styles.inputText}>
                            <RSInput type="email" id="email" placeholder="Email address..." name="email" required={true} onChange={(value) => this.onChangeEmailAddress(value)} />
                            <span>{ sendInvitationUsersError && sendInvitationUsersError.data.errors.email[0] }</span>
                        </div>
                        <div className={styles.formSubmit}>
                            <RSButton type="submit" value={sendInvitationUsersLoading === true ? <i className="fa fa-spinner" aria-hidden="true" /> : 'Send Invitation' } />
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default InvitationForm
