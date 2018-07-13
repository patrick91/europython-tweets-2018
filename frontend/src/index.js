import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider, Subscription } from "react-apollo";
import gql from "graphql-tag";

import { client } from "./client";

import { TweetBubble } from "./components/tweet-bubble";

import "./styles.css";

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

class App extends React.Component {
  state = { currentTweet: 0 };

  componentDidMount() {
    window.setInterval(
      () =>
        this.setState(state => ({
          currentTweet: state.currentTweet + 1
        })),
      5000
    );
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Subscription subscription={TWEETS}>
          {({ data }) => {
            if (!data || !data.tweets) {
              console.log(data);

              return null;
            }

            return (
              <div>
                <TweetBubble tweet={data.tweets} />
              </div>
            );
          }}
        </Subscription>
      </ApolloProvider>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
