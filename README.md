# SimpleChat-API

SimpleChat-API is a simple ExpressJs-based API for [SimpleChat App](https://github.com/lqt93/simple-chat-app)
It uses MongoDB as its database.

### Download

```sh
git clone https://github.com/lqt93/simple-chat-api.git
```

### Require

SimpleChat-API requires NodeJs v10.0 and above.

## Installation

\*\* The instruction uses [Yarn](https://yarnpkg.com/en/) as default, you can either use yarn or npm.

```sh
cd simple-chat-api
yarn install
```

### Running

Add process.env variables by creating an ".env" file in the root folder:

```sh
DB_URI=your_mongodb_uri
PORT=your_desire_port
```

- You must always set DB_URI which is the link to your mongodb database to run the api.
- If you dont set the PORT in .env file, by default, it would be 8000.

Run api by:

```sh
yarn start
```

### License

MIT
