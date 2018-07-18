from peony import EventStream, PeonyClient, events


class Client(PeonyClient):
    pass


@Client.event_stream
class UserStream(EventStream):
    def stream_request(self):
        return self.stream.statuses.filter.post(track="#europython,#ep2018")

    @events.on_tweet.handler
    def tweet(self, data):
        Client._last_tweet = data


client = Client(
    consumer_key='BzPbhv8OKHIoY60C3mleIf0xn',
    consumer_secret='ewqniOYqmyT0eSZHU0Rbwjc9PB2vMzClPmVscurthffGbj9Jbv',
    access_token='12693622-0TPSXIOPKNgze9651iFqnBG1h2WGOkqL55wMaHBtv',
    access_token_secret='Q1n9Q8E6z2MSbsVw80CZnA5oLv9jkFJ9SKt62CjMqLTyl'
)
