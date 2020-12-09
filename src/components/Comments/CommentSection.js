import React, { Component } from "react";
import Comment from "./Comment";
import { connect } from "react-redux";
import CreateCommentForm from "./CreateCommentForm";
import withAuthentication from "../User/withAuthentication";

class CommentSection extends Component {
    render() {
        const { postId, isAuthenticated } = this.props;
        var { commentIds } = this.props;

        if (commentIds === undefined || commentIds === null) commentIds = [];

        var commentSection = <div></div>;
        if (isAuthenticated) {
            commentSection = (
                <div
                    id={"comment-section-" + postId}
                    className="comment-section"
                >
                    <div className="comment-header">
                        <CreateCommentForm postID={postId} />
                    </div>
                    {Object.values(commentIds).map((commentId) => (
                        <Comment
                            key={commentId}
                            onVote={this.props.onVote}
                            commentId={commentId}
                        />
                    ))}
                </div>
            );
        }

        return commentSection;
    }
}

export default connect(null, null)(withAuthentication(CommentSection));
