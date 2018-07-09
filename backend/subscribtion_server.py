from graphql_ws.aiohttp import AiohttpSubscriptionServer


class MyWebSocketSubscriptionServer(AiohttpSubscriptionServer):
    def __init__(self, schema, service):
        self.service = service

        return super().__init__(schema)

    def get_graphql_params(self, *args, **kwargs):
        params = super().get_graphql_params(*args, **kwargs)

        params["context_value"] = {"service": self.service}

        return params
