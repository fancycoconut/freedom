import React from 'react';
import { Menu, Container } from 'semantic-ui-react';

class Page extends React.Component {

    render() {
        return (
            <div>
                <Menu as="nav" fixed="top" inverted={true}>
                    <Container>
                        <Menu.Item as="a" header={true}>Freedom</Menu.Item>
                        <Menu.Item as="a">Settings</Menu.Item>
                    </Container>
                </Menu>

                <div>
                </div>

                <footer>
                </footer>
            </div>
        );
    }
}

export default Page;