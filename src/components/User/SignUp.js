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

export class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            name: "",
            email: "",
            password: "",
        };
    }

    handleChange = (e) => {
        switch (e.target.name) {
            case "name":
                this.setState({ name: e.target.value });
                break;

            case "email":
                this.setState({ email: e.target.value });
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

        const data = new FormData();
        data.append("name", this.state.name);
        data.append("email", this.state.email);
        data.append("password", this.state.password);

        let requestOptions = {
            method: "POST",
            body: data,
        };

        try {
            const response = await fetch("/api/user/create", requestOptions);
            if (response.status === 200) {
                this.setState({ show: false });
            }
        } catch (err) {}
    };

    render() {
        const { show, name, email, password } = this.state;
        return (
            <div className="d-inline-block">
                <Button variant="primary" onClick={this.handleToggleModal}>
                    <span className="btn-icon-text">Sign Up</span>
                    <i className="fa fa-user-plus"></i>
                </Button>
                <Modal show={show} onHide={this.handleToggleModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalHeader closeButton>
                            <ModalTitle>Sign Up</ModalTitle>
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
                            <FormGroup controlId="formName">
                                <FormLabel>E-Mail</FormLabel>
                                <FormControl
                                    type="text"
                                    name="email"
                                    placeholer="E-Mail..."
                                    value={email}
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
                                <span className="btn-icon-text">Sign Up</span>
                                <i className="fa fa-user-plus"></i>
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default SignUp;
