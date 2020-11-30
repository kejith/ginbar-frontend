/* eslint-disable jsx-a11y/anchor-is-valid */
// TODO remove eslint disable
import React, { Component } from "react";
import { Link } from "react-router-dom";
import CommentSection from "../Comment";
import { howLongAgoHumanReadable } from "../../utils";
import { connect } from "react-redux";
import {
    fetchById as fetchPostById,
    postVoted,
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

    handleVote = async (postID, voteState) => {
        // when we hit the same vote button as the current state we want to
        // delete this vote
        if (this.props.post.upvoted === voteState) voteState = 0;

        this.props.votePost({
            postID: postID,
            voteState: voteState,
        });
    };

    addVotedClass(isUpvoted) {
        var { post } = this.props;
        if (post.upvoted === 0) return;

        if (
            (isUpvoted && post.upvoted === 1) ||
            (!isUpvoted && post.upvoted === -1)
        ) {
            return "voted";
        }

        return "";
    }

    render() {
        var { nextPostID, previousPostID, post, fetchState } = this.props;
        var commentsLoaded =
            fetchState === "fulfilled" && post.comments !== null;
        var stringHowLongAgo = howLongAgoHumanReadable(
            new Date(post.created_at)
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
                                    onClick={() => this.handleVote(post.id, 1)}
                                    className={
                                        "post-vote-up vote vote-up " +
                                        this.addVotedClass(true)
                                    }
                                >
                                    <i className="fa fa-plus"></i>
                                </div>
                                <div
                                    onClick={() => this.handleVote(post.id, -1)}
                                    className={
                                        "post-vote-down vote vote-down " +
                                        this.addVotedClass(false)
                                    }
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
    fetchPostById: fetchPostById,
    votePost: postVoted,
};
export default connect(mapStateToProps, mapDispatchToProps)(PostView);
