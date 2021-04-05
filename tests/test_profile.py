from testing_config import BaseTestConfig
from application.models import User
import json
from application.utils import auth


class TestProfile(BaseTestConfig):
    def test_get_profile(self):
        res = self.app.post(
                "/api/get_token",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )

        res2 = self.app.post(
                "/api/get_profile",
                content_type='application/json'
        )

        self.assertEqual(res2.status_code,200)

    def test_modify_profile(self):
        res = self.app.post(
                "/api/get_token",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )
        
        res2 = self.app.post(
                "/api/modify_profile",
                data=json.dumps({"new_username":"test_new_username"}),
                content_type='application/json'
        )
        self.assertEqual(res2.status_code,201)

    def test_change_password(self):
        res = self.app.post(
                "/api/get_token",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )
        
        res2 = self.app.post(
                "/api/change-password",
                data=json.dumps({"old_password":"something2","new_password":"aA123*"}),
                content_type='application/json'
        )
        self.assertEqual(res2.status_code,201)

    def test_send_verification_email(self):
        
        res = self.app.post(
                "/api/send_verification_email",
                data=json.dumps({"email":self.default_user["email"]}),
                content_type='application/json'
        )
        self.assertEqual(res.status_code,200)
