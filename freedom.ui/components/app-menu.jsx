import React from 'react';
import { Menu, Container, Dropdown } from 'semantic-ui-react';

class AppMenu extends React.Component {
    constructor(props) {
        super(props);

        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        this.props.updateUserSessionHandler(null);
    }

    render() {
        return (
            <React.Fragment>
                <Menu as="nav" fixed="top" inverted={true}>
                    <Container>
                        <Menu.Item as="a" header={true}>Freedom</Menu.Item>
                        <Menu.Item as="a" header={true}>Settings</Menu.Item>

                        <Menu.Menu position="right">
                            <Dropdown item simple text={ "Hello " + this.props.user.firstName + "!" }>
                                <Dropdown.Menu>
                                    <Dropdown.Item as="a">Edit Details</Dropdown.Item>
                                    <Dropdown.Item as="a" onClick={this.logOut}>Log Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                        
                    </Container>
                </Menu>
            </React.Fragment>
        );
    }
}

export default AppMenu;