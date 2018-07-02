import React from 'react';
import moment from 'moment';

import Page from '../components/page';
import Login from '../components/login';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            identityJwt: null,
            identityJwtExpiry: null
        };

        this.updateUserSession = this.updateUserSession.bind(this);
        this.checkUserSessionExpiry = this.checkUserSessionExpiry.bind(this);
    }

    componentDidMount() {
        const existingUserSession = JSON.parse(localStorage.getItem("userSession"));
        this.updateUserSession(existingUserSession);
    }

    updateUserSession(identityJwt) {
        if (!identityJwt) return this._clearAppState();
        localStorage.setItem("userSession", JSON.stringify(identityJwt));
        this.setState({
            user: this._loadUser(identityJwt.jwt),
            identityJwt: identityJwt.jwt,
            identityJwtExpiry: moment(identityJwt.expiresAt)
        });
    }

    checkUserSessionExpiry() {
        const currentTime = new Date();
        if (currentTime > this.state.identityJwtExpiry) {
            this._clearAppState();
        }
    }

    _loadUser(identityJwt) {
        const jwtSections = identityJwt.split('.');
        const decodedBase64 = window.atob(jwtSections[1]);
        return JSON.parse(decodedBase64).context.user;
    }

    _clearAppState() {
        this.setState({
            user: null,
            identityJwt: null,
            identityJwtExpiry: null
        });
        localStorage.removeItem("userSession");
    }

    render() {
        let defaultComponent = null;
        if (this.state.identityJwt)
            defaultComponent = <Page
                user={this.state.user}
                updateUserSessionHandler={this.updateUserSession}
                checkUserSessionExpiry={this.checkUserSessionExpiry} />;
        else
            defaultComponent = <Login headerText="Login" updateUserSessionHandler={this.updateUserSession} />

        return (
            <React.Fragment>
                { defaultComponent }
            </React.Fragment>
        );       
    }
}

export default App;