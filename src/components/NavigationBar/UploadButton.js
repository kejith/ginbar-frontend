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

class UploadButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    handleToggleModal = () => {
        this.setState({ show: !this.state.show });
    };

    handleChange = (e) => {
        switch (e.target.name) {
            case "url":
                this.setState({ url: e.target.value });
                break;

            default:
                break;
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        // let values = { url: this.state.url };

        const data = new FormData();
        data.append("URL", this.state.url);

        let requestOptions = {
            method: "POST",
            body: data,
            cors: "no-cors",
        };

        try {
            await fetch(
                "/api/post/create",
                requestOptions
            ).then((data) => console.log(data));
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const { show, url } = this.state;
        return (
            <div className="d-inline-block">
                <Button variant="primary" onClick={this.handleToggleModal}>
                    <span className="btn-icon-text">Upload</span>
                    <i className="fa fa-upload"></i>
                </Button>
                <Modal show={show} onHide={this.handleToggleModal}>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalHeader closeButton>
                            <ModalTitle>Upload</ModalTitle>
                        </ModalHeader>

                        <ModalBody>
                            <FormGroup controlId="formEmail">
                                <FormLabel>URL</FormLabel>
                                <FormControl
                                    type="text"
                                    name="url"
                                    placeholer="Enter Url"
                                    value={url}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="primary" type="submit">
                                <span className="btn-icon-text">Upload</span>
                                <i className="fa fa-upload"></i>
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default UploadButton;
