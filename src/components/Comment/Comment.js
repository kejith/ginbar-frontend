import React, { Component } from "react";
//import { UPVOTED, DOWNVOTED, IS_COMMENT } from "../PostsBoard/PostView";
import { selectors as commentSelectors } from "../../redux/slices/commentSlice";
import { commentVoted } from "../../redux/actions/actions";

import { connect } from "react-redux";
import VoteContainer from "../Vote/VoteContainer";
export class Comment extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        const { comment, createdCommentID } = this.props;
        if (createdCommentID === comment.id) {
            this.scrollToMyRef();
        }
    }

    scrollToMyRef = () => {
        if (this.ref.current) {
            window.scrollTo(0, this.ref.current.offsetTop - 50);
        }
    };

    addVotedClass(isUpvoted) {
        var { comment } = this.props;
        if (comment.upvoted === 0) return;

        if (
            (isUpvoted && comment.upvoted === 1) ||
            (!isUpvoted && comment.upvoted === -1)
        ) {
            return "voted";
        }

        return "";
    }

    handleVote = async (commentID, voteState) => {
        // when we hit the same vote button as the current state we want to
        // delete this vote
        if (this.props.comment.upvoted === voteState) voteState = 0;

        this.props.voteComment({
            commentID: commentID,
            voteState: voteState,
        });
    };

    render() {
        const { comment, createdCommentID } = this.props;
        if (comment === undefined) return <div></div>;

        var isCreated = createdCommentID === comment.id;
        var active = "";
        if (isCreated) active = "active";

        return (
            <div
                className={"comment-container vote-parent " + active}
                ref={this.ref}
            >
                <VoteContainer
                    contentID={comment.id}
                    voteState={comment.upvoted}
                    voteAction={this.props.voteComment}
                />

                <div className="comment-content">{comment.content}</div>
                <div className="comment-footer">
                    <span className="comment-author">{comment.user}</span>
                    <span className="comment-score">
                        {comment.score} Punkte
                    </span>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        comment: commentSelectors.selectById(state, ownProps.commentId),
        createdCommentID: state.comments.createdCommentID,
    };
};

const mapDispatchToProps = {
    voteComment: commentVoted,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
