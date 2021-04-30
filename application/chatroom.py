"""module chatroom
    APIs that enables real time chatting through multiple clients.
"""
from datetime import datetime
from flask import request, jsonify, session
from flask_socketio import SocketIO
from application.models import User, Chatroom, Participant, Message
from index import app, db, socketio

def dispatch(result):
    """DB result parser"""
    return [row for row in result]

@app.route("/api/create_group", methods=["POST"])
def create_group():
    """ Create a group with name and tag
    :param name: The name of the group that will be shown on matching and chatroom page
    :param tag: The tag of the group that will be shown and categorized on matching page
    """
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
    """ Leave the group by removing the current user from the group
    :param room_id: the room_id of the group
    """
    incoming = request.get_json()
    Participant.delete_participant_with_user_id_and_room_id(session['user_id'], incoming['room_id'])
    return jsonify(results = incoming['room_id'])

@app.route("/api/get_chatrooms", methods=["GET"])
def get_chartooms():
    """ Get all chatrooms that the user is in
    """
    result = dispatch(Chatroom.get_chatroom_with_user_id(session['user_id']))
    rooms = [{'room_id': row[0], 'name': row[1]} for row in result]
    for room in rooms:
        res = dispatch(Chatroom.get_room_members_with_room_id(room['room_id']))
        res = [ row[1] for row in res]
        room['members'] = res
    return jsonify(results = rooms)

@app.route("/api/delete_group", methods=["POST"])
def delete_group():
    """ Remove the group from the table and the event and messages the group has
    :param room_id: the room_id of the group
    """
    incoming = request.get_json()
    Chatroom.delete_chatroom_with_room_id(incoming['room_id'])
    return jsonify(results = incoming['room_id'])

@app.route("/api/get_room_members", methods=["POST"])
def get_room_members():
    """ Get all the room members in the current chatroom/group
    :param room_id: the room_id of the group
    """
    incoming = request.get_json()
    res = dispatch(Chatroom.get_room_members_with_room_id(incoming['room_id']))
    members = [{'user_id': row[0], 'username': row[1]} for row in res]
    return jsonify(results = members)

@app.route("/api/send_message", methods=["POST"])
def send_message():
    """ Send a message to the chatroom.
    :param room_id: the room_id of the group
    :param content: the content of the message
    """
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
    """ Get all the messages the chatroom has
    :param room_id: the room_id of the group
    """
    incoming = request.get_json()
    messages = Message.get_messages_from_room_id(incoming['room_id'])
    messages = [{'user_id': message.user_id, 
                'sendTime': message.sendTime, 'content': message.content} for message in messages]
    for message in messages:
        user = User.get_user_with_user_id(message['user_id'])
        message['username'] = str(user.username)
    return jsonify(results = messages)

@app.route("/api/delete_messages", methods=["POST"])
def delete_messages():
    """ Delete all messages from the chatroom
    :param room_id: the room_id of the group
    """
    incoming = request.get_json()
    Message.delete_messages_from_room_id(incoming['room_id'])
    return jsonify(results = incoming['room_id'])

@socketio.on('send message')
def recieved_message(json, methods=['GET', 'POST']):
    """ Get received message from the socketio on the client
    """
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
    