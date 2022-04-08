import React, { Component } from 'react'
import { RSButton, RSInput, RSAlert, RSRadio } from 'reactsymbols-kit'
import styles from './styles.scss'

class UpdatePasswordForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        var formData = {
            busy: true,
            errors: {
                errors: {}
            },
            current_password: this.state.currentPassword || '',
            password: this.state.newPassword || '',
            password_confirmation: this.state.confirmNewPassword || '',
            successful: false
        };

        this.props.updatePassword(formData)
    };

    render () {
        const { updateNewPasswordError } = this.props;

        return (
            <div className={styles.formContainer}>
                <form onSubmit={this.handleSubmit}>
                    <div className={styles.inputGroup}>
                        <div>
                            <label className={styles.text}>Current password</label>
                            <RSInput type="password" placeholder="Enter your current password..." name="currentPassword" className={styles.textInput} onChange={(value) => this.setState({ currentPassword: value })} />
                            { updateNewPasswordError && <span style={{ marginLeft: '10px', color: '#dc3545', fontWeight: 500 }}>{updateNewPasswordError.errors.current_password && updateNewPasswordError.errors.current_password[0]}</span>}
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <div>
                            <label className={styles.text}>New password</label>
                            <RSInput type="password" placeholder="Enter a new password..." name="newPassword" className={styles.textInput} onChange={(value) => this.setState({ newPassword: value })} />
                            { updateNewPasswordError && <span style={{ marginLeft: '10px', color: '#dc3545', fontWeight: 500 }}>{updateNewPasswordError.errors.password && updateNewPasswordError.errors.password[0]}</span>}
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <div>
                            <label className={styles.text}>Confirm new password</label>
                            <RSInput type="password" placeholder="Confirm your new password..." name="confirmNewPassword" className={styles.textInput} onChange={(value) => this.setState({ confirmNewPassword: value })} />
                        </div>
                    </div>
                    <div className={styles.submitButton}>
                        <RSButton type="submit" className={styles.subButton} value='Update' />
                    </div>
                </form>
            </div>
        )
    }
}

export default UpdatePasswordForm
