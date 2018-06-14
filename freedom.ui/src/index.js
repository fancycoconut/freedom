import React from 'react';
import ReactDOM from 'react-dom';

import styles from './styles/freedom.css';
import Page from '../components/page';

class App extends React.Component {
    render() {
        return <Page />;        
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);