import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, FormControl } from "react-bootstrap";
import { selectTagsByPostId } from "../../redux/slices/tagsSlice";
import { Link } from "react-router-dom";
import isAuthenticated from "../User/withAuthentication";

class TagSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagName: "",
            showFormAddTag: false,
        };
    }

    addVotedClass(classes, currentVoteState, isUpvoteButton) {
        if (currentVoteState === 0) return classes;

        if (
            (isUpvoteButton && currentVoteState === 1) ||
            (!isUpvoteButton && currentVoteState === -1)
        ) {
            return classes + " voted";
        }

        return classes;
    }

    handleCreateTag = async (e) => {
        e.preventDefault();
        this.props.createTag({
            name: this.state.tagName,
            postID: this.props.post.id,
        });
    };

    handleTagVote = async (tagID, voteState) => {
        // when we hit the same vote button as the current state we want to
        // delete this vote

        var tag = this.props.tags.find((tag) => tag.id === tagID);
        if (tag.upvoted === voteState) voteState = 0;

        this.props.voteTag({
            postTagID: tagID,
            voteState,
        });
    };

    render() {
        const { tags, isAuthenticated } = this.props;
        const { showFormAddTag, tagName } = this.state;

        return (
            <div className="post-tags tags">
                <div className="tags-list">
                    {tags.map((tag) => (
                        <div key={tag.id} className="tag d-inline-block">
                            {tag.name}
                            <div
                                onClick={() => this.handleTagVote(tag.id, 1)}
                                className={this.addVotedClass(
                                    "tag-vote-up vote vote-up d-inline-block",
                                    tag.upvoted,
                                    true
                                )}
                            >
                                <i className="fa fa-plus"></i>
                            </div>

                            <div
                                onClick={() => this.handleTagVote(tag.id, -1)}
                                className={this.addVotedClass(
                                    "tag-vote-down vote vote-down d-inline-block",
                                    tag.upvoted,
                                    false
                                )}
                            >
                                <i className="fa fa-minus"></i>
                            </div>
                        </div>
                    ))}
                    {!showFormAddTag && isAuthenticated ? (
                        <Link
                            href=""
                            to=""
                            onClick={() =>
                                this.setState({
                                    showFormAddTag: true,
                                })
                            }
                        >
                            Tag hinzufügen
                        </Link>
                    ) : (
                        ""
                    )}
                </div>
                {showFormAddTag && isAuthenticated ? (
                    <div className="add-tag-container" key="createTagContainer">
                        <Form
                            className=" d-block"
                            onSubmit={this.handleCreateTag}
                        >
                            <FormControl
                                as="input"
                                type="text"
                                name="tag_name"
                                onChange={this.handleChange}
                                className={
                                    (tagName !== "" ? "has-text " : "") +
                                    "d-inline-block h-100 add-tag-input"
                                }
                                placeholder="Tag Name..."
                                defaultValue={tagName}
                            />
                            <Button
                                variant="primary"
                                type="submit"
                                className="btn-sm add-tag-btn h-100 d-inline-block"
                            >
                                <span className="btn-text">Add</span>
                            </Button>
                            <Button
                                variant="secondary"
                                className="btn-sm add-tag-btn h-100 d-inline-block"
                                onClick={() =>
                                    this.setState({
                                        showFormAddTag: false,
                                    })
                                }
                            >
                                <span className="btn-text">Cancel</span>
                            </Button>
                        </Form>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        tags: selectTagsByPostId(state, ownProps.postID),
    };
};

export default connect(mapStateToProps, null)(isAuthenticated(TagSection));
