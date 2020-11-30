import React, { Component } from "react";
import { Button } from "react-bootstrap";

export class Logout extends Component {
    state = {};
    render() {
        return (
            <div className="d-inline-block">
                <Button variant="primary" onClick={this.props.onLogout}>
                    <i className="fa fa-sign-out"></i>
                </Button>
            </div>
        );
    }
}
