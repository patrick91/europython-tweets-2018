import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider, ApolloConsumer } from "react-apollo";

import { client } from "./client";

import { TweetsList } from "./components/tweets-list";

import "./styles.css";

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ApolloConsumer>
          {client => <TweetsList client={client} />}
        </ApolloConsumer>
      </ApolloProvider>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
