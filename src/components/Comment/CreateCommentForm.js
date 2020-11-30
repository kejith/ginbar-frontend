import React, { Component } from "react";
import { Button, Form, FormControl, FormGroup } from "react-bootstrap";

import { commentCreated } from "../../redux/actions/actions";
import { connect } from "react-redux";

export class CreateCommentForm extends Component {
    state = {};

    constructor(props) {
        super(props);

        this.state = {
            comment: "",
        };
    }

    handleChange = (e) => {
        this.setState({ comment: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.createCommentTest({
            postID: this.props.postID,
            content: this.state.comment,
        });
    };

    render() {
        const { comment } = this.state;
    
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup controlId="formContent">
                    <FormControl
                        as="textarea"
                        rows={1}
                        name="content"
                        className={comment !== "" ? "has-text" : ""}
                        placeholder="Kommentar schreiben..."
                        value={comment}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <Button variant="primary" type="submit" className="btn-sm">
                    <span className="btn-text">Senden</span>
                </Button>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {};
};

const mapDispatchToProps = {
    createCommentTest: commentCreated
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCommentForm);
