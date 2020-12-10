import React, { Component } from "react";
import PostThumbnail from "./PostThumbnail";
import PostView from "./PostView";

import {
    selectCurrentID,
    selectNextID,
    selectPreviousID,
} from "../../redux/slices/postSlice";

import { connect } from "react-redux";

class PostsBoardRow extends Component {
    render() {
        const {
            postsPerRow,
            postIds,
            currentPostID,
            nextPostID,
            previousPostID,
        } = this.props;

        // fill the rest of the row with empty elements if it's a short row
        // negative IDs will be empty

        for (var i = postIds.length; i < postsPerRow; i++) {
            postIds.push(-i);
        }

        var isCurrentInRow =
            postIds.findIndex((p) => p === currentPostID) !== -1;

        return (
            <div>
                <div className="row">
                    {postIds.map((postId) => (
                        <PostThumbnail
                            key={"postthumb-" + postId}
                            postId={postId}
                            onShowPost={this.props.onShowPost}
                        />
                    ))}
                </div>
                {isCurrentInRow ? (
                    <PostView
                        key={"post-view-" + currentPostID}
                        postID={currentPostID}
                        nextPostID={nextPostID !== 0 ? nextPostID : -1}
                        previousPostID={
                            previousPostID !== 0 ? previousPostID : -1
                        }
                        onShowNextPost={this.props.onShowNextPost}
                        onShowPreviousPost={this.props.onShowPreviousPost}
                    />
                ) : (
                    ""
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentPostID: selectCurrentID(state),
        nextPostID: selectNextID(state),
        previousPostID: selectPreviousID(state),
    };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PostsBoardRow);
