import React, {Component} from "react";
import Close from "@material-ui/icons/Close";
import {Button} from "@material-ui/core";

export default class PopUpValidation extends Component {
    handleClick = () => {
        this.props.toggle();
    };

    render() {
        return (
            <div className="modal">
                <div className="modal_content">
                    <Button
                        variant="outlined"
                        color="secondary"
                        style={{
                            height: 50,
                            width: 500,
                            marginTop: 29,
                            marginLeft: 25,
                            fontSize: '15px'
                        }}
                        endIcon={<Close/>}
                        onClick={this.handleClick}
                    >Ensure all relevant fields are populated</Button>
                </div>
            </div>
        );
    }
}