from testing_config import BaseTestConfig
from application.models import *
import json
from application.utils import *

class TestChatroom(BaseTestConfig):
    test_group = {
        "name": "test_group",
        "tag": "Poker",
    }
    test_group2 = {
        "name": "test_group2",
        "tag": "Study",
    }
    some_user = {
        "email": "one@gmail.com",
        "password": "something1",
        "username": "test_user1"
    }

    def test_create_group(self):
        res = self.app.post(
                "/api/create_group",
                data=json.dumps(self.test_group),
                content_type='application/json'
        )
        self.assertEqual(json.loads(res.data.decode("utf-8"))["results"], 2)
        self.assertEqual(res.status_code, 200)
        res = self.app.post(
                "/api/create_group",
                data=json.dumps(self.test_group2),
                content_type='application/json'
        )
        self.assertEqual(json.loads(res.data.decode("utf-8"))["results"], 3)

    def test_get_chatrooms(self):
        res = self.app.get(
                "/api/get_chatrooms",
                content_type='application/json'
        )
        self.assertEqual(json.loads(res.data.decode("utf-8"))["results"], [{'members': ['default_user'], 'name': 'default_group', 'room_id': 1}])
    
    def test_get_room_members(self):
        res = self.app.post(
                "/api/get_room_members",
                data=json.dumps({"room_id": 1}),
                content_type='application/json'
        )
        self.assertEqual(json.loads(res.data.decode("utf-8"))["results"], [{'user_id': 1, 'username': 'default_user'}])
    
    def test_get_messages(self):
        res = self.app.post(
                "/api/get_messages",
                data=json.dumps({"room_id": 1}),
                content_type='application/json'
        )
        self.assertEqual(json.loads(res.data.decode("utf-8"))["results"], [])

    def test_leave_group(self):
        res = self.app.post(
                "/api/leave_group",
                data=json.dumps({"room_id": 1}),
                content_type='application/json'
        )
        res2 = self.app.get(
                "/api/get_chatrooms",
                content_type='application/json'
        )
        self.assertEqual(json.loads(res2.data.decode("utf-8"))["results"], [])
    
    def test_models(self):
        user = User.get_user_with_email_and_password(
                        self.default_user["email"],
                        self.default_user["password"])
        self.assertTrue(Chatroom.get_chatroom_with_user_id(user.id))
        self.assertTrue(Chatroom.get_room_members_with_room_id(1))
        self.assertTrue(Chatroom.get_chatroom_with_room_id(1))
    
    