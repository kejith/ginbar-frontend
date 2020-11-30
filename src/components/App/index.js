import "./App.css";
import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import PostsBoard from "../PostsBoard";
import NavigationBar from "../NavigationBar";
import isAuthenticated from "../Auth";

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
    }

    handleLogin = (data) => {
        localStorage.setItem("user", data.data);
        this.setState({ user: data.data });
    };

    handleLogout = async (data) => {
        await fetch("/api/user/logout", { method: "POST" }).then((data) => {
            if (!isAuthenticated()) {
                localStorage.removeItem("user");
                this.setState({ user: "" });
            }
        });
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

export default App;
