# Grickly #

[![Build Status](https://travis-ci.org/grickly-nyu/grickly.svg?branch=main)](https://travis-ci.org/grickly-nyu/grickly)

Grickly is the senior design project for Ge, Hengning, Kejian, Lujie, and Sicong at New York University. It is a proof of concept for a new way of socializing for active participants of life events. The user can be matched to events, form his/her interest groups, and hang out with different kinds of people round the world. More details about the project can be found in project management document under `documents` of this repository. 

The application is built with a Flask JWT Backend, a React/Redux Front-End, and Material UI framework.

## Procedures to Run the Project Locally

### Create DB
```sh
$ export DATABASE_URL="postgresql://username:password@localhost/mydatabase"
or
$ export DATABASE_URL="mysql://username:password@localhost/mydatabase"
or
$ export DATABASE_URL="sqlite:///your.db"
```

(More about connection strings in this [flask config guide](http://flask-sqlalchemy.pocoo.org/2.1/config/).)

```
$ python manage.py create_db
$ python manage.py db upgrade
$ python manage.py db migrate
```

To update database after creating new migrations, use:

```sh
$ python manage.py db upgrade
```
### Install Back-End Requirements
```sh
$ pip install -r requirements.txt
```

### Install Front-End Requirements
```sh
$ cd static
$ npm install
```

### Run Back-End

```sh
$ python manage.py runserver
```

### Test Back-End

```sh
$ python test.py --cov-report=term --cov-report=html --cov=application/ tests/
```

### Run Front-End

```sh
$ cd static
$ npm start
```

### Build Front-End

```sh
$ npm run build:production
```

## New to MySQL? 

If you decide on MySQL, install the free community edition of [MySQL](https://dev.mysql.com/downloads/mysql/) and [MySQL Workbench](https://www.mysql.com/products/workbench/).

1. Start MySQL from the System Preferences.
2. Open MySQL Workbench and [create a database](http://stackoverflow.com/questions/5515745/create-a-new-database-with-mysql-workbench) called mydatabase but don't create the tables since python will do that for you.
3. Install the MySQL connector for Python, add the `DATABASE_URL` configuration, and create the database and tables.

```
$ sudo pip install mysql-connector-python-rf
$ export DATABASE_URL="mysql+mysqlconnector://username:password@localhost/mydatabase"
$ python manage.py create_db
```

Note: you do not need to run "python manage.py db upgrade" or "python manage.py db migrate" if its your first go at it.

4. Run Back-End.

```
$ python manage.py runserver
```

If all goes well, you should see ```* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)``` followed by a few more lines in the terminal.

5. Open a new tab to the same directory and run the front end.

```
$ cd static
$ npm install
$ npm start
```

6. Open your browser to http://localhost:3000/register and setup your first account.
7. Enjoy! By this point, you should be able to create an account and login without errors. 

Languages and Tools required for the project:

* Python 2.7+ or 3.x
* Pytest
* Heroku
* Flask
* React
* Redux
* React-Router 2.0
* React-Router-Redux
* Babel 6
* SCSS processing
* Webpack
