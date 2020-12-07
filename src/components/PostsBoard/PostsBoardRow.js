import React, { Component } from "react";
import PostThumbnail from "./PostThumbnail";

class PostsBoardRow extends Component {
    render() {
        const { postsPerRow, postIds } = this.props;

        // fill the rest of the row with empty elements if it's a short row
        // negative IDs will be empty

        console.log(postIds);

        for (var i = postIds.length; i < postsPerRow; i++) {
            postIds.push(-i);
        }

        return (
            <div className="row">
                {postIds.map((postId) => (
                    <PostThumbnail
                        key={"postthumb-" + postId}
                        postId={postId}
                        onShowPost={this.props.onShowPost}
                    />
                ))}
            </div>
        );
    }
}

export default PostsBoardRow;
