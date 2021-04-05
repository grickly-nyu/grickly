from testing_config import BaseTestConfig
from application.models import User
from application.models import Chatroom
import json
from application.utils import auth


class TestMatch(BaseTestConfig):
    self.tag_p = {"tag": "Poker"}
    self.tag_s = {"tag": "Study"}
    self.tag_o = {"tag": "Outdoor"}
    self.tag_l = {"tag": "Life"}

    self.testrm_1 = {"room_id": "180"}
    self.testrm_2 = {"room_id": "185"}
    self.testrm_3 = {"room_id": "4"}

    def test_get_suggestions(self):
        token = self.app.post(
            "/api/get_token",
            data=json.dumps(self.default_user),
            content_type='application/json'
        )

        res = self.app.post(
            "/api/get_suggestions",
            data=json.dumps(self.tag_p),
            content_type='application/json'
        )
        res1 = self.app.post(
            "/api/get_suggestions",
            data=json.dumps(self.tag_s),
            content_type='application/json'
        )

        res2 = self.app.post(
            "/api/get_suggestions",
            data=json.dumps(self.tag_o),
            content_type='application/json'
        )
        self.assertEqual(res.status_code,200)
        self.assertEqual(res1.status_code,200)
        self.assertEqual(res2.status_code,200)

        res3 = self.app.post(
            "/api/get_suggestions",
            data=json.dumps(self.tag_l),
            content_type='application/json'
        )
        self.assertEqual(res2.status_code,204)

    def test_join_chatroom(self):
        token = self.app.post(
            "/api/get_token",
            data=json.dumps(self.default_user),
            content_type='application/json'
        )
        res = self.app.post(
            "/api/join_chatroom",
            data=json.dumps(self.testrm_1),
            content_type='application/json'
        )
        res1 = self.app.post(
            "/api/join_chatroom",
            data=json.dumps(self.testrm_2),
            content_type='application/json'
        )

        res2 = self.app.post(
            "/api/join_chatroom",
            data=json.dumps(self.testrm_3),
            content_type='application/json'
        )
        self.assertEqual(res.status_code,201)
        self.assertEqual(res1.status_code,201)
        self.assertEqual(res2.status_code,201)



