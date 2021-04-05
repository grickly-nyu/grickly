import os

from setup import basedir


class BaseConfig(object):
    SECRET_KEY = "SO_SECURE"
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "mysql://doadmin:rtrjvssd4s8bpp14@grickly-nyu-do-user-8731753-0.b.db.ondigitalocean.com:25060/grickly"
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class TestingConfig(object):
    """Development configuration."""
    TESTING = True
    DEBUG = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = "mysql://doadmin:rtrjvssd4s8bpp14@grickly-nyu-do-user-8731753-0.b.db.ondigitalocean.com:25060/test"
    DEBUG_TB_ENABLED = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False
