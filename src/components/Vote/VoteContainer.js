import React, { Component } from "react";
import { connect } from "react-redux";

export const VoteState = {
    Unvoted: 0,
    Upvoted: 1,
    Downvoted: -1,
};

/**
 * VoteContainer handles Voting behaviour and Dispatches voting Results
 * into the Redux store via the given Action
 *
 * @param {function} voteAction The Action used to dispatch the voting Result
 * @param {int} contentID Identifies the content that is voted
 * @param {int} voteState Represents the current vote state
 * @extends {Component}
 */
export class VoteContainer extends Component {
    isVoted(buttonVoteState) {
        var { voteState } = this.props;
        if (voteState !== VoteState.Unvoted && voteState === buttonVoteState)
            return true;
        return false;
    }

    handleVote = async (newVoteState) => {
        const { contentID, voteState, voteAction } = this.props;
        // when we hit the same vote button as the current state we want to
        // delete this vote
        if (voteState === newVoteState) newVoteState = VoteState.Unvoted;

        if (typeof voteAction === "function") {
            voteAction({
                contentID,
                voteState: newVoteState,
            });
        } else {
            console.error(
                "VoteContainer.js: Dispatchable Action has to be of type Function"
            );
        }
    };

    render() {
        const { className, children } = this.props;
        return (
            <div className={"vote-container " + (className ? className : "")}>
                {children}
                <UpVote
                    voteHandler={this.handleVote}
                    className="vote vote-up "
                    isVoted={this.isVoted(VoteState.Upvoted)}
                >
                    <i className="fa fa-plus"></i>
                </UpVote>
                <DownVote
                    voteHandler={this.handleVote}
                    className="vote vote-down "
                    isVoted={this.isVoted(VoteState.Downvoted)}
                >
                    <i className="fa fa-minus"></i>
                </DownVote>
            </div>
        );
    }
}

/**
 * Vote implements a Button that triggers a vote with a Given State
 *
 * @param {*} {
 *     contentID,
 *     voteHandler,
 *     isVoted,
 *     className,
 *     children,
 *     voteType,
 * }
 * @param {function} voteHandler function that handles the OnClick Event
 * @param {bool} isVoted boolean that indicates if this Vote Type was already voted
 * @param {int} voteState int that represents which type of vote the button should represent
 *
 */
export const Vote = ({
    voteHandler,
    isVoted,
    voteState,
    className,
    children,
}) => (
    <div
        onClick={() => {
            voteHandler(voteState);
        }}
        className={className + (isVoted ? " voted " : "")}
    >
        {children}
    </div>
);

export const UpVote = (props) => (
    <Vote voteState={VoteState.Upvoted} {...props}></Vote>
);
export const DownVote = (props) => (
    <Vote voteState={VoteState.Downvoted} {...props}></Vote>
);

export default connect(null, null)(VoteContainer);
