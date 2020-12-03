import React, { Component } from "react";
import {
    Modal,
    Button,
    ModalBody,
    ModalTitle,
    Form,
    FormGroup,
    FormLabel,
    FormControl,
    FormText,
} from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";

class UploadButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            url: "",
            file: "",
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
            case "file":
                this.setState({ file: e.target.value });
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
                "http://kejith.de:8080/api/post/create",
                requestOptions
            ).then((data) => console.log(data));
        } catch (err) {
            console.log(err);
        }
    };

    handleUploadSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        var fileData = document.querySelector('input[type="file"]').files[0];
        data.append("file", fileData);

        let requestOptions = {
            cors: "no-cors",
            method: "POST",
            body: data,
        };

        try {
            await fetch(
                "http://kejith.de:8080/api/post/upload",
                requestOptions
            ).then((data) => console.log(data));
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const { show, url, file } = this.state;
        return (
            <div className="d-inline-block">
                <Button variant="primary" onClick={this.handleToggleModal}>
                    <span className="btn-icon-text">Upload</span>
                    <i className="fa fa-upload"></i>
                </Button>
                <Modal show={show} onHide={this.handleToggleModal}>
                    <ModalHeader closeButton>
                        <ModalTitle>Upload</ModalTitle>
                    </ModalHeader>

                    <ModalBody>
                        <Form
                            className="upload-form"
                            onSubmit={this.handleSubmit}
                        >
                            <FormGroup
                                className="upload-group"
                                controlId="formURL"
                            >
                                <FormLabel>URL</FormLabel>
                                <FormControl
                                    type="text"
                                    name="url"
                                    placeholer="Enter URL..."
                                    value={url}
                                    onChange={this.handleChange}
                                />
                                <FormText>
                                    Here you can create a new post by specifying
                                    a URL.
                                </FormText>
                            </FormGroup>
                            <Button
                                className="btn-sm"
                                variant="primary"
                                type="submit"
                            >
                                <span className=" btn-icon-text">Upload</span>
                                <i className="fa fa-upload"></i>
                            </Button>
                        </Form>
                        <Form
                            className="upload-form"
                            onSubmit={this.handleUploadSubmit}
                        >
                            <FormGroup
                                className="upload-group"
                                controlId="formFile"
                            >
                                <FormLabel>Upload File</FormLabel>
                                <FormControl
                                    type="file"
                                    name="file"
                                    id="file-upload-input"
                                    placeholer="Select a File..."
                                    value={file}
                                    onChange={this.handleChange}
                                />
                                <FormText>
                                    Or upload a new file from the computer
                                </FormText>
                            </FormGroup>
                            <Button
                                className="btn-sm"
                                variant="primary"
                                type="submit"
                            >
                                <span className="btn-icon-text">Upload</span>
                                <i className="fa fa-upload"></i>
                            </Button>
                        </Form>
                    </ModalBody>

                    {/* <ModalFooter>
                        <Button variant="primary" type="submit">
                            <span className="btn-icon-text">Upload</span>
                            <i className="fa fa-upload"></i>
                        </Button>
                    </ModalFooter> */}
                </Modal>
            </div>
        );
    }
}

export default UploadButton;
