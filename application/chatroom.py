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

@app.route("/api/create_group", methods=["POST"])
def create_group():
    incoming = request.get_json()
    chatroom = Chatroom(
        name = incoming['name'],
        tag = incoming['tag'],
    )
    db.session.add(chatroom)
    db.session.commit()
    participant = Participant(
        user_id = session['user_id'],
        room_id = chatroom.room_id,
    )
    db.session.add(participant)
    db.session.commit()
    return jsonify(results = chatroom.room_id)

@app.route("/api/leave_group", methods=["POST"])
def leave_group():
    incoming = request.get_json()
    Participant.delete_participant_with_user_id_and_room_id(session['user_id'], incoming['room_id'])
    return jsonify(results = incoming['room_id'])

@app.route("/api/get_chatrooms", methods=["GET"])
def get_chartooms():
    result = dispatch(Chatroom.get_chatroom_with_user_id(session['user_id']))
    rooms = [{'room_id': row[0], 'name': row[1]} for row in result]
    for room in rooms:
        res = dispatch(Chatroom.get_room_members_with_room_id(room['room_id']))
        res = [ row[1] for row in res]
        room['members'] = res
    return jsonify(results = rooms)

@app.route("/api/delete_group", methods=["POST"])
def delete_group():
    incoming = request.get_json()
    Chatroom.delete_chatroom_with_room_id(incoming['room_id'])
    return jsonify(results = incoming['room_id'])

@app.route("/api/get_room_members", methods=["POST"])
def get_room_members():
    incoming = request.get_json()
    res = dispatch(Chatroom.get_room_members_with_room_id(incoming['room_id']))
    members = [{'user_id': row[0], 'username': row[1]} for row in res]
    return jsonify(results = members)

@app.route("/api/send_message", methods=["POST"])
def send_message():
    incoming = request.get_json()
    message = Message(
        user_id = session['user_id'],
        room_id = incoming["room_id"],
        sendTime = datetime.now(),
        content = incoming["content"]
    )
    db.session.add(message)
    db.session.commit()
    return jsonify(
        content = incoming["content"]
    )

@app.route("/api/get_messages", methods=["POST"])
def get_messages():
    incoming = request.get_json()
    messages = Message.get_messages_from_room_id(incoming['room_id'])
    messages = [{'user_id': message.user_id, 'sendTime': message.sendTime, 'content': message.content} for message in messages]
    print(messages)
    for message in messages:
        user = User.get_user_with_user_id(message['user_id'])
        message['username'] = str(user.username)
    return jsonify(results = messages)

@app.route("/api/delete_messages", methods=["POST"])
def delete_messages():
    incoming = request.get_json()
    Message.delete_messages_from_room_id(incoming['room_id'])
    return jsonify(results = incoming['room_id'])

@socketio.on('send message')
def recieved_message(json, methods=['GET', 'POST']):
    json['username'] = session['username']
    socketio.emit('server message', json) 
    message = Message(
        user_id = session['user_id'],
        room_id = json["room_id"],
        sendTime = datetime.now(),
        content = json["content"]
    )
    db.session.add(message)
    db.session.commit()
    