import React, { Component } from "react";
import UploadButton from "./UploadButton";
import Login from "../User/Login";
import { Logout } from "../User/Logout";
import { SignUp } from "../User/SignUp";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withAuthentication from "../User/withAuthentication";
import { fetchAll, searchSent } from "../../redux/actions/actions";
import { Button, Form } from "react-bootstrap";

export class NavigationBar extends Component {
    state = {search: ""};

    handleSearch = async (e) => {
        e.preventDefault();
        
        var promise = await this.props.search(this.state.search);
        console.log(promise);
        
    };

    handleChange = (e) => {
        this.setState({ search: e.target.value });
    };

    render() {
        const { currentUser, isAuthenticated } = this.props;

        return (
            <nav
                id="main-navbar"
                className="navbar navbar-expand-lg navbar-dark"
            >
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarTogglerDemo01"
                    aria-controls="navbarTogglerDemo01"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarTogglerDemo01"
                >
                    <Link
                        className="navbar-brand"
                        onClick={() => this.props.loadNew({})}
                        to="/"
                    >
                        gin.bar
                    </Link>
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <a
                                className="nav-link disabled"
                                href="#4"
                                tabIndex="-1"
                                aria-disabled="true"
                            >
                                {currentUser !== null
                                    ? "Greetings, " + currentUser.name
                                    : ""}
                            </a>
                        </li>
                    </ul>

                    {/* <Form onSubmit={this.handleSearch} method="post" className="navbar-form navbar-right" role="search">
                        <div className="input-group">
                        <input 
                            name="s" 
                            type="text" 
                            className="form-control" 
                            placeholder="Search this site" 
                            onChange={this.handleChange}
                        />
                        <span className="input-group-btn">
                            <Button type="submit" className="btn btn-default">
                                <i className="fa fa-search" style={{"color": "white"}}></i>
                            </Button>
                        </span>
                        </div>
                    </Form> */}

                </div>

                {isAuthenticated ? (
                    <div className="text-right navbar-buttons-right">
                        <UploadButton />
                        <Logout onLogout={this.props.onLogout} />
                    </div>
                ) : (
                    <div className="text-right navbar-buttons-right">
                        <SignUp />
                        <Login onLogin={this.props.onLogin} />
                    </div>
                )}
            </nav>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {};
};

const dispatchToProps = {
    loadNew: fetchAll,
    search: searchSent
};

export default connect(
    mapStateToProps,
    dispatchToProps
)(withAuthentication(NavigationBar));
