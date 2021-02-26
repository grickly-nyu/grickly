from flask import request, render_template, jsonify, url_for, redirect, g, session
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from .models import *
from index import app, db, socketio
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
from sqlalchemy import text
from datetime import datetime
from threading import Lock

thread = None
thread_lock = Lock()

def dispatch(result):
    return [row for row in result]

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"],
        username=incoming["username"]
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )

@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        session['user_id'] = user.id
        session['username'] = user.username
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403

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
    