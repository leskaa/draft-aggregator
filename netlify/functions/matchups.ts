import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GraphQLClient, gql } from "graphql-request";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const endpoint = 'https://api.stratz.com/graphql';
  const token = process.env.STRATZ_API_KEY;
  const heroId = event.path
    .replace('/.netlify/functions/matchups/', '')
    .replace(/\//gim, '');

  const graphqlClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const query = gql`
    {
      heroStats {
        matchUp(
          heroId: ${heroId},
          bracketBasicIds: [LEGEND_ANCIENT, DIVINE_IMMORTAL],
          orderBy: 2,
          matchLimit: 50,
          take: 200
        ) {
          heroId,
          with {
            heroId2,
            matchCount,
            winCount
          }
          vs {
            heroId2,
            matchCount,
            winCount
          }
        }
      }
    }
  `

  try {
    const response = await graphqlClient.request(query);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
};

export { handler };
