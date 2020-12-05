import React, { Component } from "react";
import PostsBoardRow from "./PostsBoardRow";
import PostView from "./PostView";
import { connect } from "react-redux";
import { readPostIdFromUrl, getDimensionsOfElement } from "../../utils/";
import InfiniteScroll from "react-infinite-scroller";

import {
    postSlice,
    selectLastID,
    selectPostEntities,
    selectPostIds,
    selectTotalPosts,
} from "../../redux/slices/postSlice";

import { fetchAll } from "../../redux/actions/actions";

class PostsBoard extends Component {
    postWidth = 150;
    previousY = 0;

    constructor(props) {
        super(props);

        this.lastKeyPressed = 0;

        this.state = {
            width: 0,
            height: 0,
            postsPerRow: 1,
        };

        this.props.changeCurrentPost(parseInt(readPostIdFromUrl()));
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    /**
     * Calculate and updates the Current Dimensions of the PostBoard and
     * the amount of Elements per Row in the Board
     * @memberof PostsBoard
     */
    updateDimensions() {
        var dimensions = getDimensionsOfElement("body");
        this.setState(dimensions);
        this.elementsPerRow = Math.floor(this.state.width / this.postWidth);
    }

    componentWillMount() {
        this.updateDimensions();

        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }

    componentDidMount() {
        this.loadPosts();
        window.addEventListener("popstate", this.popStateListener.bind(this));
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener(
            "popstate",
            this.popStateListener.bind(this)
        );
        window.removeEventListener("resize", this.updateDimensions);
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    }

    popStateListener(e) {
        this.props.changeCurrentPost(parseInt(readPostIdFromUrl()));
    }

    shouldComponentUpdate(nextProps, nextState) {
        // when amount of posts changes rerender
        if (this.props.totalPosts !== nextProps.totalPosts) return true;
        // when the post that is currently viewed is changed rerender
        // TODO: potentialy performance save here
        if (this.props.currentPostShown !== nextProps.currentPostShown) {
            return true;
        }
        // When the amount of posts per row changes due to resizing the window
        // we only want to render it once at the breakpoint and not every
        // resizing event
        var postsPerRow = Math.floor(this.state.width / this.postWidth);
        var postsPerRowNext = Math.floor(nextState.width / this.postWidth);
        if (postsPerRow !== postsPerRowNext) return true;
        // we do not need to rerender
        return false;
    }

    /**
     * Loads the Posts from the Redux Store
     *
     * @memberof PostsBoard
     */
    loadPosts = async () => {
        await this.props.fetchPosts({ lastID: this.props.lastID });
    };

    /**
     * Get the Current ID
     *
     * @return The ID of the current Post
     * @memberof PostsBoard
     */
    currentPost() {
        const { posts, currentPostShown } = this.props;
        return posts[currentPostShown];
    }

    /**
     * Handles Keypresses
     *
     * 27: Escape
     * 37: Left Arrow
     * 39: Right Arrow
     *
     * @param Event that triggred the handle e
     * @memberof PostsBoard
     */
    onKeyPressed(e) {
        if (this.state.currentPostShown <= 0) return;

        switch (e.keyCode) {
            case 39:
                this.handleShowNextPost();
                break;
            case 37:
                this.handleShowPreviousPost();
                break;
            case 27:
                this.props.changeCurrentPost(0);
                break;
            default:
                break;
        }
    }

    /**
     * Handles an Event where a specific Post should be shown
     *
     * @param {int} postID
     * @memberof PostsBoard
     */
    handleOnShowPost = (postID) => {
        const { currentPostShown } = this.props;

        // if the current shown post is clicked again we
        // reset the id to 0 so postview will not be rendered
        // current postview will be closed
        if (currentPostShown === postID) {
            this.props.changeCurrentPost(0);
            //window.history.pushState("", "", "/");
        } else {
            //window.history.pushState("", "", "/post/" + postID);
            this.props.changeCurrentPost(postID);
        }
    };

    /**
     * Handles an Event to show the Next Post and pushes a new State
     * to the window.history
     *
     * @memberof PostsBoard
     */
    handleShowNextPost = () => {
        const { changeCurrentPost } = this.props;
        var nextPostId = this.getNextPostId();
        if (nextPostId !== 0) {
            //window.history.pushState("", "", "/post/" + nextPostId);
            changeCurrentPost(nextPostId);
        }
    };

    /**
     * Returns the ID of the next Post or 0 when there is none
     * return {int} nextPostId
     * @memberof PostsBoard
     */
    getNextPostId = () => {
        const { postsIds, currentPostShown } = this.props;
        var currentIndex = postsIds.indexOf(currentPostShown);
        if (currentIndex !== undefined && currentIndex < postsIds.length - 1) {
            var nextPostId = postsIds[currentIndex + 1];
            return nextPostId;
        } else {
            return 0;
        }
    };

    /**
     * Handles an Event to show the previous Post and pushes a new State
     * to the window.history
     *
     * @memberof PostsBoard
     */
    handleShowPreviousPost = () => {
        const { changeCurrentPost } = this.props;

        var previousPostId = this.getPreviousPostId();
        if (previousPostId > 0) {
            //window.history.pushState("", "", "/post/" + previousPostId);
            changeCurrentPost(previousPostId);
        }
    };

    /**
     * Returns the ID of the previous post or 0 if there is none
     * return {int} previousPostId
     * @memberof PostsBoard
     */
    getPreviousPostId = () => {
        const { postsIds, currentPostShown } = this.props;
        var currentIndex = postsIds.indexOf(currentPostShown);
        if (currentIndex !== undefined && currentIndex > 0) {
            var previousPostId = postsIds[currentIndex - 1];
            return previousPostId;
        } else {
            return 0;
        }
    };

    render() {
        const { currentPostShown, postsIds } = this.props;
        const elementsPerRow = Math.floor(this.state.width / this.postWidth);

        // fallback if posts are not loaded
        if (this.props.status !== "fulfilled") {
            return <div></div>;
        }

        // currentPostArrayIndex = postsIds[currentPostShown];
        // fill board with rows of postPerRow * posts
        let rows = [];
        for (var i = 0, j = postsIds.length; i < j; i += elementsPerRow) {
            // slice of the posts for the row
            var rowSlice = postsIds.slice(i, i + elementsPerRow);
            // create next row
            rows.push(
                <PostsBoardRow
                    key={"postrow-" + i}
                    postIds={rowSlice}
                    postsPerRow={elementsPerRow}
                    onShowPost={this.handleOnShowPost}
                />
            );

            // if the current post id is between [i, i+elementsPerRow[ than
            // the current post is in this row
            var res = rowSlice.indexOf(currentPostShown);
            if (res !== -1) {
                var currentPost = this.currentPost();
                var nextPostId = this.getNextPostId();
                var previousPostId = this.getPreviousPostId();
                var postView = (
                    <PostView
                        key={"post-view-" + currentPost.id}
                        postID={currentPost.id}
                        nextPostID={nextPostId !== 0 ? nextPostId : -1}
                        previousPostID={
                            previousPostId !== 0 ? previousPostId : -1
                        }
                        onShowNextPost={this.handleShowNextPost}
                        onShowPreviousPost={this.handleShowPreviousPost}
                    />
                );
                rows.push(postView);
            }
        }

        return (
            <div id="content" key="content-1" className="container-fluid px-0">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadPosts}
                    hasMore={true}
                    loader={
                        <div className="loader" key={0}>
                            Loading ...
                        </div>
                    }
                >
                    {rows.map((row) => row)}
                </InfiniteScroll>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        posts: selectPostEntities(state),
        postsIds: selectPostIds(state),
        totalPosts: selectTotalPosts(state),
        lastID: selectLastID(state),
        previousPostId: state.posts.previous,
        nextPostId: state.posts.next,
        status: state.posts.fetchState,
        currentPostShown: state.posts.current,
    };
}

const mapDispatchToProps = {
    fetchPosts: fetchAll,
    changeCurrentPost: postSlice.actions.currentPostChanged,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsBoard);
