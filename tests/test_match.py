from testing_config import BaseTestConfig
from application.models import User
from application.models import Chatroom
import json
from application.utils import auth


class TestMatch(BaseTestConfig):
    self.tagP = {"tag": "Poker"}
    self.tagS = {"tag": "Study"}
    self.tagO = {"tag": "Outdoor"}
    self.tagL = {"tag": "Life"}

    def test_get_suggestions(self):
        token = self.app.post(
            "/api/get_token",
            data=json.dumps(self.default_user),
            content_type='application/json'
    )

        res = self.app.post(
            "/api/get_suggestions",
            data=json.dumps(self.tagP),
            content_type='application/json'
        )
        res1 = self.app.post(
            "/api/get_suggestions",
            data=json.dumps(self.tagS),
            content_type='application/json'
        )

        res2 = self.app.post(
            "/api/get_suggestions",
            data=json.dumps(self.tagO),
            content_type='application/json'
        )       
        self.assertEqual(res.status_code,200)
        self.assertEqual(res1.status_code,200)
        self.assertEqual(res2.status_code,200)  
        
        res3 = self.app.post(
            "/api/get_suggestions",
            data=json.dumps(self.tagL),
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
            data=json.dumps({"room_id": "180"}),
            content_type='application/json'
        )
        res1 = self.app.post(
            "/api/join_chatroom",
            data=json.dumps({"room_id": "185"}),
            content_type='application/json'
        )    

        res2 = self.app.post(
            "/api/join_chatroom",
            data=json.dumps({"room_id": "4"}),
            content_type='application/json'
        )    
        self.assertEqual(res.status_code,201) 
        self.assertEqual(res1.status_code,201)
        self.assertEqual(res2.status_code,201)  


