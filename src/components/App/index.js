import "./App.css";
import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import PostsBoard from "../Posts/PostBoard";
import NavigationBar from "../Navigation/NavigationBar";
import isAuthenticated from "../Auth";
import { connect } from "react-redux";
import { userChecked, userLoggedOut } from "../../redux/actions/actions";
import { volumeChanged } from "../../redux/slices/appSlice";

class App extends React.Component {
    constructor(props) {
        super(props);

        if (isAuthenticated()) {
            this.state = {
                user: localStorage.getItem("user"),
            };
        } else {
            this.state = {
                user: "",
            };
        }

        this.props.changeVolume(
            parseFloat(localStorage.getItem("volume") || 0)
        );
    }

    componentDidMount() {
        this.props.checkUser();
    }

    handleLogin = (data) => {
        localStorage.setItem("user", data.data);
        this.setState({ user: data.data });
    };

    handleLogout = async (data) => {
        this.props.logout();
    };

    render() {
        return (
            <Router>
                <div className="App">
                    <NavigationBar
                        user={this.state.user}
                        onLogin={this.handleLogin}
                        onLogout={this.handleLogout}
                    />
                    <Router>
                        <Route path="/" component={PostsBoard} />
                    </Router>
                </div>
            </Router>
        );
    }
}

const mapDispatchToProps = {
    checkUser: userChecked,
    logout: userLoggedOut,
    changeVolume: volumeChanged,
};
export default connect(null, mapDispatchToProps)(App);
