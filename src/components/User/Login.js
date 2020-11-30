import React, { Component } from "react";
import {
    Modal,
    Button,
    ModalBody,
    ModalFooter,
    ModalTitle,
    Form,
    FormGroup,
    FormLabel,
    FormControl,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            name: "",
            password: "",
        };
    }

    handleChange = (e) => {
        switch (e.target.name) {
            case "name":
                this.setState({ name: e.target.value });
                break;

            case "password":
                this.setState({ password: e.target.value });
                break;

            default:
                break;
        }
    };

    handleToggleModal = () => {
        this.setState({ show: !this.state.show });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        // let values = { url: this.state.url };

        const data = new FormData();
        data.append("name", this.state.name);
        data.append("password", this.state.password);

        let requestOptions = {
            method: "POST",
            body: data,
        };

        try {
            const response = await fetch("/api/user/login", requestOptions);
            const data = await response.json();
            if (response.status === 200) {
                this.props.onLogin(data);
            }
        } catch (err) {}
    };

    render() {
        const { show, name, password } = this.state;
        return (
            <div className="d-inline-block">
                <Button variant="primary" onClick={this.handleToggleModal}>
                    <span className="btn-icon-text">Sign In</span>
                    <i className="fa fa-sign-in"></i>
                </Button>
                <Modal show={show} onHide={this.handleToggleModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalHeader closeButton>
                            <ModalTitle>Sign In</ModalTitle>
                        </ModalHeader>

                        <ModalBody>
                            <FormGroup controlId="formName">
                                <FormLabel>Name</FormLabel>
                                <FormControl
                                    type="text"
                                    name="name"
                                    placeholer="Name..."
                                    value={name}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup controlId="formPassword">
                                <FormLabel>Password</FormLabel>
                                <FormControl
                                    type="password"
                                    name="password"
                                    placeholer="Password..."
                                    value={password}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="primary" type="submit">
                                <span className="btn-icon-text">Sign In</span>
                                <i className="fa fa-sign-in"></i>
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Login;
