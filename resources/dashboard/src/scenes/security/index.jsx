import React, { Component } from 'react'
import Breadcrumb from 'logic/breadcrumb'
import { RSButton, RSInput, RSAlert, RSRadio } from 'reactsymbols-kit'
import SecurityActions from './actions'
import CardContainer from 'elements/card'
import UpdatePasswordForm from 'scenes/security/components/UpdatePasswordForm'
import styles from './styles.scss'

class Security extends Component {
    constructor (props) {
        super(props)
    }

    componentDidMount() {
        this.breadcrumb = Breadcrumb.register({
            icon: 'pt-icon-th-list',
            name: 'Security',
            href: '/security'
        });
    }

    render () {
        const { updatePassword, updateNewPassword, updateNewPasswordError } = this.props;

        return (
            <div className={styles.container}>
                <CardContainer title="Update password">
                    <RSAlert
                        visible={typeof updateNewPassword === 'object'}
                        style={{ backgroundColor: '#d5edda', width: '80%', margin: '0 auto' }}>
                        <p style={{ color: '#155724', fontSize: '1rem', fontWeight: '500' }}>Your password has been updated!</p>
                    </RSAlert>
                    <UpdatePasswordForm updatePassword={updatePassword} updateNewPasswordError={updateNewPasswordError && updateNewPasswordError.data} />
                </CardContainer>
            </div>
        )
    }
}

export default SecurityActions.connect(Security)
