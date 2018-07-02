import React from 'react';
import { Container } from 'semantic-ui-react';

import AppMenu from '../components/app-menu';



class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFeature: null
        };

        this.loadFeature = this.loadFeature.bind(this);
    }

    componentDidMount() {

    }

    loadFeature(feature) {
        this.props.checkUserSessionExpiry();
        this.setState({ currentFeature: feature });
    }

    render() {
        return (
            <div>
                <AppMenu user={this.props.user}
                    loadFeature={this.loadFeature}
                    updateUserSessionHandler={this.props.updateUserSessionHandler} />

                <div className="page-feature">
                    <Container>{this.state.currentFeature}</Container>                    
                </div>
            </div>
        );
    }
}

export default Page;