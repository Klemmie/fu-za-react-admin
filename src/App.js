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
                    <CompanySearch
                        content={content}
                    />
            </div>
        );
    }
}

export default App;