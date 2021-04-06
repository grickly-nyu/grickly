from testing_config import BaseTestConfig
from application.models import *
import json
from application.utils import *

class TestEvent(BaseTestConfig):
    test_event = {
        "room_id": 1,
        "event_name": "test_event",
        "location": "test_location",
        "start_time": "2021-03-27 07:32:00",
        "end_time": "2021-03-31 10:32:00",
        "description": "test_description"
    }

    def test_get_event(self):
        res = self.app.post(
                "/api/get_event",
                data=json.dumps(self.test_event),
                content_type='application/json'
        )
        self.assertEqual(json.loads(res.data.decode("utf-8"))["results"], {'description': '', 'end_time': '', 'event_name': '', 'location': '', 'start_time': ''})

    def test_create_event(self):
        res = self.app.post(
                "/api/create_event",
                data=json.dumps(self.test_event),
                content_type='application/json'
        )
        self.assertIsNotNone(json.loads(res.data.decode("utf-8"))["results"])
        res2 = self.app.post(
                "/api/get_event",
                data=json.dumps(self.test_event),
                content_type='application/json'
        )
        print("\r\n\r\n",json.loads(res2.data.decode("utf-8"))["results"])
        self.assertEqual(json.loads(res2.data.decode("utf-8"))["results"], {'description': 'test_description', 'end_time': 'Wed, 31 Mar 2021 10:32:00 GMT', 'event_name': 'test_event', 'location': 'test_location', 'start_time': 'Sat, 27 Mar 2021 07:32:00 GMT'})
    
    def test_delete_event(self):
        self.app.post(
            "/api/create_event",
            data=json.dumps(self.test_event),
            content_type='application/json'
        )
        self.app.post(
                "/api/delete_event",
                data=json.dumps(self.test_event),
                content_type='application/json'
        )
        res = self.app.post(
                "/api/get_event",
                data=json.dumps(self.test_event),
                content_type='application/json'
        )
        self.assertEqual(json.loads(res.data.decode("utf-8"))["results"], {'description': '', 'end_time': '', 'event_name': '', 'location': '', 'start_time': ''})

    def test_event_models(self):
        self.app.post(
            "/api/create_event",
            data=json.dumps(self.test_event),
            content_type='application/json'
        )
        self.assertTrue(Event.get_event_with_room_id(1))
    