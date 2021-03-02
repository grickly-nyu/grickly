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

@app.route("/api/get_chatrooms", methods=["GET"])
def get_chartooms():
    result = dispatch(db.engine.execute("SELECT room_id, name FROM chatroom natural join participant where user_id =" + str(session['user_id'])))
    rooms = [{'room_id': row[0], 'name': row[1]} for row in result]
    for room in rooms:
        res = dispatch(db.engine.execute("SELECT distinct user.id, username FROM user join participant on user.id = participant.user_id where room_id ="+str(room['room_id'])))
        res = [ row[1] for row in res]
        room['members'] = res
    return jsonify(results = rooms)

@app.route("/api/get_room_members", methods=["POST"])
def get_room_members():
    incoming = request.get_json()
    res = dispatch(db.engine.execute("SELECT distinct user.id, username FROM user join participant on user.id = participant.user_id where room_id ="+str(incoming['room_id'])))
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
    res = dispatch(db.engine.execute("SELECT * FROM message where room_id = "+str(incoming['room_id']) ))
    messages = [{'user_id': row[1], 'sendTime': row[3], 'content': row[4]} for row in res]
    for message in messages:
        res = dispatch(db.engine.execute("SELECT username FROM user where id ="+str(message['user_id'])))
        res = [row[0] for row in res]
        message['username'] = str(res[0])
    return jsonify(results = messages)



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
    