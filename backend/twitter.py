import collections

from peony import EventStream, PeonyClient, events


class Client(PeonyClient):
    last_tweets = collections.deque(maxlen=10)


@Client.event_stream
class UserStream(EventStream):
    def stream_request(self):
        return self.stream.statuses.filter.post(
            follow="15324940,2300068776",
            track="#europython"
        )

    @events.on_tweet.handler
    def tweet(self, data):
        Client.last_tweets.append(data)


client = Client(
    consumer_key='BzPbhv8OKHIoY60C3mleIf0xn',
    consumer_secret='ewqniOYqmyT0eSZHU0Rbwjc9PB2vMzClPmVscurthffGbj9Jbv',
    access_token='12693622-0TPSXIOPKNgze9651iFqnBG1h2WGOkqL55wMaHBtv',
    access_token_secret='Q1n9Q8E6z2MSbsVw80CZnA5oLv9jkFJ9SKt62CjMqLTyl'
)
