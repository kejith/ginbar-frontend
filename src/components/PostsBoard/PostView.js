/* eslint-disable jsx-a11y/anchor-is-valid */
// TODO remove eslint disable
import React, { Component } from "react";
import { Link } from "react-router-dom";
import CommentSection from "../Comment";
import { howLongAgoHumanReadable } from "../../utils";
import { connect } from "react-redux";
import {
    fetchById as fetchPostById
} from "../../redux/actions/actions";
import { selectors as postSelectors } from "../../redux/slices/postSlice";

import { selectCommentsByPostId } from "../../redux/slices/commentSlice";

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

    handleVote = async (
        contentID,
        voteID,
        isPostNotComment,
        isUpvoted,
        isUpdate = false
    ) => {
        // TODO replace each ID with content_id to uniform
        // fetch
        let data = new FormData();
        switch (isPostNotComment) {
            case IS_POST:
                data.append("post_id", contentID);
                data.append("is_post_not_comment", IS_POST);
                break;
            case IS_COMMENT:
                data.append("comment_id", contentID);
                data.append("is_post_not_comment", IS_COMMENT);
                break;
            default:
                return; // unexpected behavior => abort
        }

        data.append("upvoted", isUpvoted);

        if (isUpdate) {
            data.append("vote_id", voteID);
        }

        this.props.upsertVote({
            formData: data,
            isUpdate: isUpdate,
        });
    };

    render() {
        var { nextPostID, previousPostID, post, fetchState } = this.props;
        var commentsLoaded = fetchState === "fulfilled" && post.comments !== null;
        var stringHowLongAgo = howLongAgoHumanReadable(
            new Date(post.CreatedAt)
        );


        return (
            <div
                ref={this.ref}
                className="post-view"
                id={"post-" + post.id}
                href="post"
            >
                <div className="post-media">
                    {nextPostID !== -1 ? (
                        <Link
                            to={"/post/" + nextPostID}
                            className="post-thumbnail "
                            onClick={() => this.props.onShowNextPost()}
                        >
                            <div className="post-next"><i className="fa fa-chevron-right"></i></div>
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
                            <div className="post-prev"><i className="fa fa-chevron-left"></i></div>
                        </Link>
                    ) : (
                        ""
                    )}
                    <div className="text-center post-media">
                        <img
                            alt="fickdich"
                            className="img-fluid"
                            src={"http://kejith.de:8080/images/" + post.image}
                        />
                    </div>
                    <div className="post-footer ">
                        <div className="vote-parent d-inline-block">
                            <div className="post-vote vote-container">
                                <div
                                    onClick={() =>
                                        this.handleVote(
                                            post.id,
                                            IS_POST,
                                            UPVOTED
                                        )
                                    }
                                    className="post-vote-up vote vote-up"
                                >
                                    <i className="fa fa-plus"></i>
                                </div>
                                <div
                                    onClick={() =>
                                        this.handleVote(
                                            post.id,
                                            IS_COMMENT,
                                            DOWNVOTED
                                        )
                                    }
                                    className="post-vote-down vote vote-down"
                                >
                                    <i className="fa fa-minus"></i>
                                </div>
                            </div>
                            <span className="score vote-score">239</span>
                        </div>
                        <div className="post-details d-inline-block">
                            <a className="time" href="">
                                vor {stringHowLongAgo}
                            </a>
                            <span className="time"> von </span>
                            <a className="user" href="">
                                {post.user}
                            </a>
                            <span className="post-source">
                                <i className="fa fa-link"></i>{" "}
                                <a href={post.url}>
                                    {new URL(post.url).hostname}
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
                {commentsLoaded ? (
                    <CommentSection
                        onCreated={this.handleCommentCreated}
                        onVote={this.handleVote}
                        postId={post.id}
                        commentIds={post.comments}
                    />
                ) : (
                    <div className="comment-section text-center ">
                        <div>
                            <span className="loading-comments-message">
                                Kommentare werden geladen
                            </span>
                        </div>
                        <div className="loading">
                            <i className="fa fa-spinner fa-spin"></i>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        fetchState: state.posts.fetchState,
        post: postSelectors.selectById(state, ownProps.postID),
        comments: selectCommentsByPostId(state, ownProps),
    };
};
const mapDispatchToProps = {
    fetchPostById: fetchPostById
};
export default connect(mapStateToProps, mapDispatchToProps)(PostView);
