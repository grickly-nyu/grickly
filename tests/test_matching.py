from testing_config import BaseTestConfig
from application.models import User
from application.models import Chatroom
import json
from application.utils import auth


class TestMatch(BaseTestConfig):
    test_group = {
        "name": "test_group",
        "tag": "Poker",
    }
    test_group2 = {
        "name": "test_group2",
        "tag": "Study",
    }

    tag_p = {"query_tag": "Poker"}
    tag_s = {"query_tag": "Study"}
    tag_o = {"query_tag": "Outdoor"}
    tag_l = {"query_tag": "Life"}
    tag_t = {"query_tag": "Test"}

    testrm_1 = {"room_id": 1}
    testrm_2 = {"room_id": 185}
    testrm_3 = {"room_id": 4}

    def test_get_suggestions(self):
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
            data=json.dumps(self.tag_t),
            content_type='application/json'
        )
        self.assertEqual(res2.status_code,200)


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

    # def test_join_chatroom(self):
    #     res = self.app.post(
    #         "/api/join_chatroom",
    #         data=json.dumps(self.testrm_1),
    #         content_type='application/json'
    #     )
        # res1 = self.app.post(
        #     "/api/join_chatroom",
        #     data=json.dumps(self.testrm_2),
        #     content_type='application/json'
        # )

        # res2 = self.app.post(
        #     "/api/join_chatroom",
        #     data=json.dumps(self.testrm_3),
        #     content_type='application/json'
        # )
        # self.assertEqual(res.status_code,201)
        # self.assertEqual(res1.status_code,201)
        # self.assertEqual(res2.status_code,201)



