from flask_testing import TestCase
from application.app import app, db
from application.models import User
import os
from setup import basedir
import json


class BaseTestConfig(TestCase):
    default_user = {
        "email": "default@gmail.com",
        "password": "something2",
        "username": "default_user"
    }

    default_group = {
        "name": "default_group",
        "tag": "Test"
    }

    def create_app(self):
        app.config.from_object('config.TestingConfig')
        return app

    def setUp(self):
        self.app = self.create_app().test_client()
        db.create_all()
        res = self.app.post(
                "/api/create_user",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )

        self.token = json.loads(res.data.decode("utf-8"))["token"]
        res2 = self.app.post(
                "/api/get_token",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )
        res3 = self.app.post(
                "/api/create_group",
                data=json.dumps(self.default_group),
                content_type='application/json'
        )

    def tearDown(self):
        db.session.remove()
        db.drop_all()
