# Grickly #

[![Build Status](https://travis-ci.org/grickly-nyu/grickly.svg?branch=main)](https://travis-ci.org/grickly-nyu/grickly)
[![Coverage Status](https://coveralls.io/repos/github/grickly-nyu/grickly/badge.svg?branch=main&service=github)](https://coveralls.io/github/grickly-nyu/grickly?branch=main)

Grickly is the senior design project for Ge, Hengning, Kejian, Lujie, and Sicong at New York University. It is a proof of concept for a new way of socializing for active participants of life events. The user can be matched to events, form his/her interest groups, and hang out with different kinds of people round the world. More details about the project can be found in project management document under `documents` of this repository. 

The application is built with a Flask JWT Backend, a React/Redux Front-End, and Material UI framework.

## Run the Project Locally Using Makefile

Before you use Makefile, make sure you have the a local `.env` file and all the variables are correctly stored.

To setup the project, use:

```sh
$ make setup
```

After you setup the project, you should be able to run Grickly. To run the project, use:

```sh
$ make run
```

If all goes well, you should see ```* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)``` followed by a few more lines in the terminal.
Open your browser to http://localhost:3000/ and play with Grickly. Enjoy!

### Test, Doc, and Prod Using Makefile

To test the project, use:

```sh
$ make test
```

To doc the project, use:

```sh
$ make doc
```

To prod the project, use:

```sh
$ make prod
```

## Languages and Tools required for the project:

* Python 2.7+ or 3.x
* Pytest
* Flask
* React
* Redux
* React-Router 2.0
* React-Router-Redux
* Babel 6
* SCSS processing
* Webpack
