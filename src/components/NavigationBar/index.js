import React, { Component } from "react";
import UploadButton from "./UploadButton";
import Login from "../User/Login";
import isAuthenticated from "../Auth";
import { Logout } from "../User/Logout";
import { SignUp } from "../User/SignUp";
import { connect } from "react-redux";
import { selectLoginStatus } from "../../redux/slices/usersSlice";

export class NavigationBar extends Component {
    state = {};
    render() {
        const { user, isLoggedIn } = this.props;
        console.log(user);
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
                    <a className="navbar-brand" href="#1">
                        gin.bar
                    </a>
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <a
                                className="nav-link disabled"
                                href="#4"
                                tabIndex="-1"
                                aria-disabled="true"
                            >
                                {user !== null ? "Greetings, " + user.name : ""}
                            </a>
                        </li>
                    </ul>
                </div>

                {isLoggedIn ? (
                    <div className="text-right navbar-buttons-right">
                        <UploadButton />
                        <Logout onLogout={this.props.onLogout} />
                    </div>
                ) : (
                    ""
                )}
                {!isLoggedIn ? (
                    <div className="text-right navbar-buttons-right">
                        <SignUp />
                        <Login onLogin={this.props.onLogin} />
                    </div>
                ) : (
                    ""
                )}
            </nav>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: selectLoginStatus(state),
        user: state.users.currentUser,
    };
};

export default connect(mapStateToProps, null)(NavigationBar);
