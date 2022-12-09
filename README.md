# draft-aggregator

Aggregate matchup and metagame data to recommend hero picks in a quick and easily digestible way.

## Data Sources

- **Counters** - [Stratz GraphQL API](https://stratz.com/api)
- **Synergies** - [Stratz GraphQL API](https://stratz.com/api)
- **Professional Picks/Bans** - [OpenDota](https://www.opendota.com/)
- **Public Ranked Winrate** - [OpenDota](https://www.opendota.com/)

## Development Guide

1. Run `npm install`
2. Create a `.env` file in the root project directory with the following environment variables.
    1. `STRATZ_API_KEY`
3. Run `npm install -g netlify-cli` to install the netlify CLI
4. Run `npm run backend:dev` to start the local netlify function server
5. Run `npm run dev` to start the vite developemnt server

## File Structure

- **/netlify/functions** - Contains each of the Netlify / AWS Lambda functions
- **/src** - Source code for the client-rendered React application
