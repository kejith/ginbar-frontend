/* eslint-disable jsx-a11y/anchor-is-valid */
// TODO remove eslint disable
import React, { Component } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import CommentSection from "../Comment";
import { howLongAgoHumanReadable } from "../../utils";
import { connect } from "react-redux";
import { selectors as postSelectors } from "../../redux/slices/postSlice";
import { selectCommentsByPostId } from "../../redux/slices/commentSlice";
import { selectTagsByPostId } from "../../redux/slices/tagsSlice";
import {
    fetchById as fetchPostById,
    postVoted,
    postTagVoted,
    postTagCreated,
} from "../../redux/actions/actions";
import withAuthentication from "../User/withAuthentication";

export const UPVOTED = 1;
export const DOWNVOTED = -1;

export const IS_POST = 1;
export const IS_COMMENT = 2;

class PostView extends Component {
    state = {};
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.element = null;

        this.state = {
            tagName: "",
            showFormAddTag: false,
        };

        this.props.fetchPostById(this.props.post.id);
    }

    componentDidMount() {
        this.scrollToMyRef();
    }

    scrollToMyRef = () => {
        if (this.ref.current)
            window.scrollTo(0, this.ref.current.offsetTop - 50);
    };

    handleCommentCreated = (createdComment) => {
        let newComments = [...this.state.comments];
        newComments.push(createdComment);
        this.setState({ comments: newComments });
    };

    handleVote = async (postID, voteState) => {
        // when we hit the same vote button as the current state we want to
        // delete this vote
        if (this.props.post.upvoted === voteState) voteState = 0;

        this.props.votePost({
            postID: postID,
            voteState: voteState,
        });
    };

    handleCreateTag = async (e) => {
        e.preventDefault();
        this.props.createTag({
            name: this.state.tagName,
            postID: this.props.post.id,
        });
    };

    handleChange = (e) => {
        this.setState({ tagName: e.target.value });
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

    render() {
        var { nextPostID, previousPostID, post, fetchState, tags } = this.props;
        var { tagName, showFormAddTag } = this.state;
        var commentsLoaded =
            fetchState === "fulfilled" && post.comments !== null;
        var stringHowLongAgo = howLongAgoHumanReadable(
            new Date(post.created_at)
        );

        var contentType = post.content_type.split("/");
        var media;
        switch (contentType[0]) {
            case "image":
                media = (
                    <img
                        alt="fickdich"
                        className="img-fluid"
                        src={"http://kejith.de:8080/images/" + post.filename}
                    />
                );
                break;
            case "video":
                media = (
                    <video
                        class="media-video"
                        src={"http://kejith.de:8080/videos/" + post.filename}
                        type="video/mp4"
                        autoplay=""
                        controls
                        loop
                        preload="auto"
                    ></video>
                );
                break;

            default:
                break;
        }

        return (
            <div
                ref={this.ref}
                className="post-view"
                id={"post-" + post.id}
                href="post"
            >
                <div className="post-media-container">
                    <div className="text-center post-media">
                        {nextPostID !== -1 ? (
                            <Link
                                to={"/post/" + nextPostID}
                                className="post-thumbnail "
                                onClick={() => this.props.onShowNextPost()}
                            >
                                <div className="post-next">
                                    <i className="fa fa-chevron-right"></i>
                                </div>
                            </Link>
                        ) : (
                            ""
                        )}
                        {previousPostID !== -1 ? (
                            <Link
                                to={"/post/" + this.props.previousPostID}
                                className="post-thumbnail "
                                onClick={() => this.props.onShowPreviousPost()}
                            >
                                <div className="post-prev">
                                    <i className="fa fa-chevron-left"></i>
                                </div>
                            </Link>
                        ) : (
                            ""
                        )}
                        {media}
                    </div>
                    <div className="post-footer ">
                        <div className="vote-parent d-inline-block">
                            <div className="post-vote vote-container">
                                <div
                                    onClick={() => this.handleVote(post.id, 1)}
                                    className={this.addVotedClass(
                                        "post-vote-up vote vote-up ",
                                        post.upvoted,
                                        true
                                    )}
                                >
                                    <i className="fa fa-plus"></i>
                                </div>
                                <div
                                    onClick={() => this.handleVote(post.id, -1)}
                                    className={this.addVotedClass(
                                        "post-vote-down vote vote-down ",
                                        post.upvoted,
                                        false
                                    )}
                                >
                                    <i className="fa fa-minus"></i>
                                </div>
                            </div>
                            <span className="score vote-score">
                                {post.score}
                            </span>
                        </div>
                        <div className="post-details d-inline-block">
                            <a className="time" href="">
                                vor {stringHowLongAgo}
                            </a>
                            <span className="time"> von </span>
                            <a className="user" href="">
                                {post.user}
                            </a>
                            {post.url !== "" ? (
                                <span className="post-source">
                                    <i className="fa fa-link"></i>{" "}
                                    <a href={post.url}>
                                        {new URL(post.url).hostname}
                                    </a>
                                </span>
                            ) : (
                                ""
                            )}
                            <div className="post-tags tags">
                                <div className="tags-list">
                                    {tags.map((tag) => (
                                        <div
                                            key={tag.id}
                                            className="tag d-inline-block"
                                        >
                                            {tag.name}
                                            <div
                                                onClick={() =>
                                                    this.handleTagVote(
                                                        tag.id,
                                                        1
                                                    )
                                                }
                                                className={this.addVotedClass(
                                                    "tag-vote-up vote vote-up d-inline-block",
                                                    tag.upvoted,
                                                    true
                                                )}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </div>

                                            <div
                                                onClick={() =>
                                                    this.handleTagVote(
                                                        tag.id,
                                                        -1
                                                    )
                                                }
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
                                    {!showFormAddTag ? (
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
                                {showFormAddTag ? (
                                    <div
                                        className="add-tag-container"
                                        key="createTagContainer"
                                    >
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
                                                    (tagName !== ""
                                                        ? "has-text "
                                                        : "") +
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
                                                <span className="btn-text">
                                                    Add
                                                </span>
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
                                                <span className="btn-text">
                                                    Cancel
                                                </span>
                                            </Button>
                                        </Form>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <CommentSection
                    onCreated={this.handleCommentCreated}
                    onVote={this.handleVote}
                    postId={post.id}
                    commentIds={post.comments}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        fetchState: state.posts.fetchState,
        post: postSelectors.selectById(state, ownProps.postID),
        comments: selectCommentsByPostId(state, ownProps),
        tags: selectTagsByPostId(state, ownProps.postID),
    };
};
const mapDispatchToProps = {
    fetchPostById: fetchPostById,
    votePost: postVoted,
    voteTag: postTagVoted,
    createTag: postTagCreated,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withAuthentication(PostView));
