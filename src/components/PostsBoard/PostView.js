/* eslint-disable jsx-a11y/anchor-is-valid */
// TODO remove eslint disable
import React, { Component } from "react";
import { Link } from "react-router-dom";
import CommentSection from "../Comment";
import { howLongAgoHumanReadable } from "../../utils";
import { selectors as postSelectors } from "../../redux/slices/postSlice";
import { selectCommentsByPostId } from "../../redux/slices/commentSlice";
import { selectTagsByPostId } from "../../redux/slices/tagsSlice";
import { connect } from "react-redux";
import {
    fetchById as fetchPostById,
    postVoted,
} from "../../redux/actions/actions";
import TagSection from "../Tags/TagSection";
import VoteContainer from "../Vote/VoteContainer";
import { selectVolume, volumeChanged } from "../../redux/slices/appSlice";

class PostView extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.element = null;

        this.state = {
            tagName: "",
            showFormAddTag: false,
        };

        this.props.fetchPostById(this.props.post.id);
        this.scrollToMyRef();
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

    handleChange = (e) => {
        this.setState({ tagName: e.target.value });
    };

    handleVolumeChange = (e) => {
        localStorage.setItem("volume", parseFloat(e.target.volume));
        this.props.changeVolume(parseFloat(e.target.volume));
    };

    componentDidUpdate() {
        var video = document.getElementById("media-video");
        if (video !== null && video !== undefined)
            video.volume = this.props.volume;
    }

    render() {
        var { nextPostID, previousPostID, post } = this.props;
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
                        id="media-video"
                        class="media-video"
                        src={"http://kejith.de:8080/videos/" + post.filename}
                        type="video/mp4"
                        autoplay=""
                        controls
                        loop
                        preload="auto"
                        volume={
                            this.props.volume !== null ? this.props.volume : 0
                        }
                        onVolumeChange={this.handleVolumeChange}
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
                            <VoteContainer
                                contentID={post.id}
                                voteState={post.upvoted}
                                voteAction={this.props.votePost}
                            />
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
                            <TagSection postID={post.id} />
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
        volume: state.app.volume,
    };
};

const mapDispatchToProps = {
    fetchPostById: fetchPostById,
    votePost: postVoted,
    changeVolume: volumeChanged,
};
export default connect(mapStateToProps, mapDispatchToProps)(PostView);
