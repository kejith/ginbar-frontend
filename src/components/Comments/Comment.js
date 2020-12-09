import React, { Component } from "react";
//import { UPVOTED, DOWNVOTED, IS_COMMENT } from "../PostsBoard/PostView";
import { selectors as commentSelectors } from "../../redux/slices/commentSlice";
import { commentVoted } from "../../redux/actions/actions";

import { connect } from "react-redux";
import VoteContainer from "../Vote/VoteContainer";
import styled, { keyframes } from "styled-components";
import { flash } from "react-animations";
import { ConditionalWrapper } from "../../utils/";

const bounceAnimation = keyframes`${flash}`;
const BouncyDiv = styled.div`
    animation: 2s ${bounceAnimation};
`;

export class Comment extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        const { comment, createdCommentID } = this.props;
        if (createdCommentID === comment.id) {
            this.scrollToMyRef();
        }
    }

    componentDidUpdate() {
        const { comment, createdCommentID } = this.props;
        if (createdCommentID === comment.id) {
            this.scrollToMyRef();
        }
    }

    scrollToMyRef = () => {
        window.scrollTo(0, this.myRef.current.offsetTop);
        // var id = "created-comment-" + this.props.comment.id;
        // const yOffset = 0;
        // const element = document.getElementById(id);
        // const y = element.getBoundingClientRect().bottom + yOffset;
        // window.scrollTo({ top: y, behavior: "smooth" });
    };

    scrollToCreatedComment = () => {};

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

        console.log(comment);

        return (
            <ConditionalWrapper
                condition={isCreated}
                wrapper={(children) => (
                    <BouncyDiv ref={this.myRef}>{children}</BouncyDiv>
                )}
            >
                <div
                    id={"created-comment-" + comment.id}
                    className={"comment-container vote-parent "}
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
            </ConditionalWrapper>
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
