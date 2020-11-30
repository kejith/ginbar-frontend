import React, { Component } from "react";
import Comment from "./Comment";
import { connect } from "react-redux";
import CreateCommentForm from "./CreateCommentForm";

class CommentSection extends Component {
    render() {
        const { postId, commentIds } = this.props;
        if (commentIds === undefined) return <div></div>;

        return (
            <div id={"comment-section-" + postId} className="comment-section">
                <div className="comment-header">
                    <CreateCommentForm
                        postID={postId}
                        //onCreated={this.props.onCreated}
                    />
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
}



export default connect(null, null)(CommentSection);
