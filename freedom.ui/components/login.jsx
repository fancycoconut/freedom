// Based on examples:
// https://react.semantic-ui.com/layouts/login
// https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/layouts/LoginLayout.js
import React from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

import styles from './login.css'
import LoginApi from '../api/login-api';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMessage: null,
            loggingInFlag: false
        };

        this.loginClient = new LoginApi();
        this.processLogin = this.processLogin.bind(this);
        this.usernameChanged = this.usernameChanged.bind(this);
        this.passwordChanged = this.passwordChanged.bind(this);
    }

    componentDidMount() {
        document.title = "Login | Freedom";
    }

    usernameChanged(event) {
        this.setState({ username: event.target.value });
    }

    passwordChanged(event) {
        this.setState({ password: event.target.value });
    }

    processLogin() {
        if (this.state.username === "" || this.state.password === "") return;
        const that = this;
        this.setState({ loggingInFlag: true });

        this.loginClient.login(this.state.username, this.state.password).then(jwt => {
            that.props.updateUserSessionHandler(jwt);
        },
        err => {
            that.setState({ 
                loggingInFlag: false,
                errorMessage: err.errorMessage
            });
            that.props.updateUserSessionHandler(null);
        });
    }

    render() {
        return (
            <div className="login-form">
                <Grid className="login-form-grid" verticalAlign="middle" textAlign="center">
                    <Grid.Column className="login-form-column">
                        <Header as="h1" textAlign="center">{this.props.headerText || "Freedom"}</Header>
                        <Form size="large">
                            <Segment>
                                {
                                    this.state.errorMessage ? 
                                        <Message className="login-err-msg--left" negative>{this.state.errorMessage}</Message> : null
                                }

                                <Form.Input fluid type="text" icon="user" iconPosition="left" placeholder="Username..." value={this.state.username} onChange={this.usernameChanged} />
                                <Form.Input fluid type="password" icon="lock" iconPosition="left" placeholder="Password..." value={this.state.password} onChange={this.passwordChanged} />

                                <Button fluid size="large" loading={this.state.loggingInFlag} onClick={this.processLogin}>Login</Button> 
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Login;