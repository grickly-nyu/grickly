from flask import request, render_template, jsonify, url_for, redirect, g, session
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from .models import *
from index import app, db, socketio
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
from sqlalchemy import text
from datetime import datetime

def dispatch(result):
    return [row for row in result]

@app.route("/api/get_event", methods=["POST"])
def get_event():
    incoming = request.get_json()
    event = Event.get_event_with_room_id(incoming['room_id'])
    if event:
        results = {'event_name': event.name, 'location': event.location, 'start_time': event.start_time, 'end_time': event.end_time, 'description': event.description}
    else:
        results = {'event_name': "", 'location': "", 'start_time': "", 'end_time': "", 'description': ""}
    return jsonify(results = results)

@app.route("/api/create_event", methods=["POST"])
def create_event():
    incoming = request.get_json()
    try:
        start_time = incoming['start_time'][:-1].replace('T', ' '),
    except:
        start_time = None
    try:
        end_time = incoming['end_time'][:-1].replace('T', ' '),
    except:
        end_time = None
    event = Event(
        room_id = incoming['room_id'],
        name = incoming['event_name'],
        location = incoming['location'],
        start_time =  start_time,
        end_time = end_time,
        description = incoming['description']
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(results = event.room_id)

@app.route("/api/delete_event", methods=["POST"])
def delete_event():
    incoming = request.get_json()
    Event.delete_event_with_room_id(incoming['room_id'])
    return jsonify(results = incoming['room_id'])