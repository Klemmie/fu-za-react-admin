import './App.css';

import React, {Component} from 'react';
import CompanySearch from "./CompanySearch";

class App extends Component {
    state = {
        content: []
    };

    render() {
        const {content} = this.state;

        return (
            <div className="App">
                <div className="ui text container">
                    <CompanySearch
                        content={content}
                    />
                </div>
            </div>
        );
    }
}

export default App;