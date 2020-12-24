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
import { fetchAll, postCreated } from "../../redux/actions/actions";
import { connect } from "react-redux";
import PostThumbnail from "../Posts/PostThumbnail";

class UploadButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            url: "",
            file: "",
            reposts: [],
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

    resetState() {
        this.setState({
            show: false,
            file: "",
            url: "",
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const res = await this.props.createPost({
            type: "url",
            url: this.state.url,
        });

        console.log(res);

        if (res.payload.status === "possibleDuplicatesFound") {
            this.setState({
                reposts: Object.values(res.payload.data.entities.posts),
            });
        } else {
            if (res.type === "posts/create/fulfilled") {
                this.resetState();
            }
        }
    };

    handleUploadSubmit = async (e) => {
        e.preventDefault();
        var fileData = document.querySelector('input[type="file"]').files[0];
        const res = await this.props.createPost({
            type: "upload",
            file: fileData,
        });

        if (res.type === "posts/create/fulfilled") {
            this.resetState();
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
                            <FormGroup className="upload-group">
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
                            <FormGroup className="upload-group">
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
                        <div className="reposts-found">
                            {this.state.reposts.length > 0 ? (
                                <div>Possible Reposts Found:</div>
                            ) : (
                                ""
                            )}
                            {this.state.reposts.map((post) => (
                                <PostThumbnail
                                    key={"postthumb-" + post.id}
                                    postId={post.id}
                                />
                            ))}
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapDispatchToProps = {
    loadNew: fetchAll,
    createPost: postCreated,
};
export default connect(null, mapDispatchToProps)(UploadButton);
