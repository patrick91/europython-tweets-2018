import asyncio
import json

import aiohttp_cors
from aiohttp import web
from graphql import format_error

from schema import schema
from subscribtion_server import MyWebSocketSubscriptionServer
from template import render_graphiql
from twitter import client


async def graphql_view(request):
    payload = await request.json()
    response = await schema.execute(
        payload.get("query", ""), return_promise=True
    )

    data = {}

    if response.errors:
        data["errors"] = [format_error(e) for e in response.errors]

    if response.data:
        data["data"] = response.data

    jsondata = json.dumps(data)

    return web.Response(
        text=jsondata, headers={"Content-Type": "application/json"}
    )


async def graphiql_view(request):
    return web.Response(
        text=render_graphiql(), headers={"Content-Type": "text/html"}
    )


async def subscriptions(request):
    ws = web.WebSocketResponse(protocols=("graphql-ws",))
    await ws.prepare(request)

    await subscription_server.handle(ws)

    return ws


app = web.Application()
app.router.add_get("/subscriptions", subscriptions)
app.router.add_get("/graphiql", graphiql_view)
app.router.add_get("/graphql", graphql_view)
app.router.add_post("/graphql", graphql_view)

cors = aiohttp_cors.setup(
    app,
    defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True, expose_headers="*", allow_headers="*"
        )
    },
)

for route in list(app.router.routes()):
    cors.add(route)


subscription_server = MyWebSocketSubscriptionServer(schema, client)


asyncio.ensure_future(client.run_tasks())

if __name__ == "__main__":
    web.run_app(app, port=8000)
