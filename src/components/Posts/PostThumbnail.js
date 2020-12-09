import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { selectors } from "../../redux/slices/postSlice";

const thumbnailUrl = "http://kejith.de:8080/images/thumbnails/";

class PostThumbnail extends Component {
    previousCurrent = 0;

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.current === this.props.postId ||
            this.props.current === this.props.postId
        )
            return true;
        return false;
    }

    render() {
        const { post, postId } = this.props;
        // only create an Element when pid !== 0 so we can will the rest of a row
        // with an empty .col element
        var element;
        if (post !== undefined) {
            if (post.id === this.props.current) {
                element = (
                    <Link
                        to={"/"}
                        className="post-thumbnail"
                        onClick={() => this.props.onShowPost(post.id)}
                    >
                        <img
                            alt="thumbnail"
                            className="img-fluid w-100"
                            src={thumbnailUrl + post.thumbnail_filename}
                            loading="lazy"
                        />
                    </Link>
                );
            } else {
                element = (
                    <Link
                        to={"/post/" + post.id}
                        className="post-thumbnail"
                        onClick={() => this.props.onShowPost(post.id)}
                    >
                        <img
                            alt="thumbnail"
                            className="img-fluid w-100"
                            src={thumbnailUrl + post.thumbnail_filename}
                            loading="lazy"
                        />
                    </Link>
                );
            }
        }

        return (
            <div
                key={postId}
                id={"post-" + postId}
                className="col post-container"
            >
                {element}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        post: selectors.selectById(state, ownProps.postId),
        current: state.posts.current,
    };
}

export default connect(mapStateToProps, null)(PostThumbnail);
