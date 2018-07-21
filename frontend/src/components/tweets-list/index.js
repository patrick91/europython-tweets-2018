import React from "react";
import gql from "graphql-tag";

import { TweetBubble } from "../tweet-bubble";

const TWEETS = gql`
  subscription {
    tweets {
      id
      text
      username
      media {
        url: mediaUrlHttps
      }
    }
  }
`;

export class TweetsList extends React.Component {
  state = {
    tweets: []
  };

  componentDidMount() {
    this.props.client
      .subscribe({
        query: TWEETS
      })
      .subscribe({
        next: result => {
          if (result.data && result.data.tweets) {
            this.setState(state => {
              const tweet = result.data.tweets;
              let newTweets = [...state.tweets];

              if (newTweets.filter(x => x.id === tweet.id).length === 0) {
                if (newTweets.length >= 10) {
                  newTweets.pop();
                }

                newTweets = [tweet, ...newTweets];
              }

              return {
                tweets: newTweets
              };
            });
          }
        }
      });
  }

  render() {
    return this.state.tweets.map((tweet, index) => (
      <TweetBubble key={index} tweet={tweet} />
    ));
  }
}
