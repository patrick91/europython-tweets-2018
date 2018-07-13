import React from "react";
import htmlTweet from "html-tweet";

import { createBubble } from "./bubble";

import "./styles.css";

export class TweetBubble extends React.Component {
  svg = React.createRef();
  tweet = React.createRef();

  componentDidMount() {
    createBubble(this.svg.current, this.tweet.current);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tweet.id !== this.props.tweet.id) {
      createBubble(this.svg.current, this.tweet.current);
    }
  }

  render() {
    const { media, text, author } = this.props.tweet;
    return (
      <div className="tweet-wrapper">
        <svg ref={this.svg} />

        <div className="tweet" ref={this.tweet}>
          <p dangerouslySetInnerHTML={{ __html: htmlTweet()(text) }} />

          <strong>{author}</strong>
        </div>

        {media.length > 0 && <img src={media[0].url} />}
      </div>
    );
  }
}
