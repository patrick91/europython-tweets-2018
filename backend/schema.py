import asyncio

import graphene

QUESTIONS = [
    "Do you know that PyCon Italy will be on the 19th of April 2018?",
    "Have you been to Florence?"
]


class Tweet(graphene.ObjectType):
    text = graphene.String()
    username = graphene.String()
    created_at = graphene.String()
    profile_image = graphene.String()


class Question(graphene.ObjectType):
    text = graphene.String()


class Query(graphene.ObjectType):
    all_questions = graphene.List(Question, language=graphene.String())
    i_throw_errors = graphene.String()

    def resolve_all_questions(root, info, language=None):
        if language is not None:
            raise ValueError("Sorry I can't filter by language right now.")

        return [Question(text=x) for x in QUESTIONS]

    def resolve_i_throw_errors(root, info):
        raise ValueError("This is done to show errors.")


class AnswerQuestion(graphene.Mutation):
    class Arguments:
        id = graphene.String()
        answer = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, id, answer):
        ok = False

        if answer == "42":
            ok = True

        return AnswerQuestion(ok=ok)


class Mutation(graphene.ObjectType):
    answer_question = AnswerQuestion.Field()


class Subscription(graphene.ObjectType):
    tweets = graphene.Field(Tweet)

    async def resolve_tweets(root, info):
        service = info.context['service']

        while True:
            if service._last_tweet:
                tweet = service._last_tweet

                yield Tweet(
                    text=tweet.text,
                    username=tweet.user.screen_name,
                    created_at=tweet.created_at,
                    profile_image=tweet.user.profile_image_url_https, )

            await asyncio.sleep(0.2)


schema = graphene.Schema(
    query=Query, mutation=Mutation, subscription=Subscription)
