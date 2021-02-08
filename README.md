# grickly
Grickly, a brand new way for you to enjoy life event

## React application with Express server

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Then an Express server was added in the `server` directory. The server is proxied via the `proxy` key in `package.json`.

## Using this project

Make sure you have [Node.JS](https://nodejs.org/en/download/). Note: we're working on Node version `12.20.1`. Newer versions may require managing package dependencies to properly run.

Clone the project. Navaigate to the directory with terminal then install the dependencies by running the following command.

```bash
npm install
```
Make sure you get a `.env` file from one of the other devs in order to get all of the environment variables you will need for the app.

You can start the server on its own with the command:

```bash
npm run server
```

Run the React application on its own with the command:

```bash
npm start
```

Run both applications together with the command:

```bash
npm run dev
```

The React application will run on [port 3000](https://localhost:3000) and the server [port 3001](https://localhost:3001).
