import React from "react";
import ReactDOM from "react-dom";

import { TweetBubble } from "./components/tweet-bubble";

import "./styles.css";

const tweets = [
  {
    id: 1,
    text: `In Rimini for #europython, keynoting tmrw!
    I'm holed up in my hotel room doing final prep and
    practice—looking forward to seeing everyone. 😁`,
    author: "@limedaring"
  },
  {
    id: 2,
    text: `super happy with the @europython schedule this
    year! and look at the keynote speakers! https://buff.ly/2IQ7rV2`,
    author: "@christianbarra",
    image: "https://source.unsplash.com/random"
  }
];

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
      <div>
        <TweetBubble tweet={tweets[this.state.currentTweet % tweets.length]} />
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
