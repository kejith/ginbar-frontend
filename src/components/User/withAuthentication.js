import React from "react";
import { connect } from "react-redux";
import { selectLoginStatus } from "../../redux/slices/usersSlice";

/**
 * Is a higher Order Component to deliver generalized Authentication Information
 * to abstract some of the logic
 *
 * @param {React.Component} WrappedComponent
 * @return {React.Component} the wrapped Component
 */
const withAuthentication = (Component) => {
    class AuthenticatedHOC extends React.Component {
        render() {
            return <Component {...this.props} />;
        }
    }

    const mapStateToProps = (state) => {
        return {
            isAuthenticated: selectLoginStatus(state),
            currentUser: state.users.currentUser,
        };
    };

    return connect(mapStateToProps, null)(AuthenticatedHOC);
};

export default withAuthentication;
