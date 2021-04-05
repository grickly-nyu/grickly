from flask import request, render_template, jsonify, url_for, redirect, g, session
from application.models import *
from index import app, db
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from datetime import datetime

def dispatch(result):
    """
    Convert SQL return format to python list of dictionary format

    :param result: the result of type json returned by db.engine.execute
    :return: a python list of dictionary
    """
    return [row for row in result]

@app.route("/api/get_suggestions", methods=["POST"])
def get_suggestions():
    """
    Get chatroom suggestions based on user-entered tag

    :param tag: string, the tag a user would like to match to
    :return: a JSON Response object, containing the matched results as a list of dicts with keys room_id, name, members
    """

    incoming = request.get_json()
    query_tag = incoming["query_tag"]
    result = dispatch(db.engine.execute("SELECT room_id, name FROM chatroom WHERE tag = '" + str(query_tag) + "'"))
    result2 = dispatch(db.engine.execute("SELECT chatroom.room_id FROM chatroom WHERE chatroom.room_id NOT IN \
        (SELECT chatroom.room_id FROM participant JOIN chatroom on chatroom.room_id = participant.room_id WHERE participant.user_id = "+str(session["user_id"])+") \
            AND tag = '" + str(query_tag) + "'"))

    suggested_rooms = [{'room_id': row[0], 'name': row[1]} for row in result]
    for room in suggested_rooms:
        res_mem = dispatch(db.engine.execute("SELECT distinct user.id, username FROM user join participant on user.id = participant.user_id where room_id ="+str(room['room_id'])))
        res_mem = [ row[1] for row in res_mem]
        room['members'] = res_mem
    if len(result) == 0:
        return jsonify(results = suggested_rooms),204
    return jsonify(results = suggested_rooms),200


@app.route("/api/join_chatroom", methods=["POST"])
def join_chatroom():
    """
    Join the chatroom specified by room_id and add the user to participant table in database.

    :param room_id: int, the room id the user attempts to join.
    :return: a JSON Response object, results being the user_id of current session.
    """
    incoming = request.get_json()
    check = dispatch(db.engine.execute("SELECT room_id, user_id FROM participant WHERE room_id ="+ str(incoming["room_id"])+ "AND user_id = "+str(session["user_id"])))
    participant = Participant(
        user_id = session['user_id'],
        room_id = incoming['room_id'],
    )
    db.session.add(participant)
    db.session.commit()
    return jsonify(result = True), 201
