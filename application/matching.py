from flask import request, render_template, jsonify, url_for, redirect, g, session
from application.models import *
from index import app, db
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from datetime import datetime

def dispatch(result):
    return [row for row in result]

@app.route("/api/get_suggestions", methods=["POST"])
def get_suggestions():
    incoming = request.get_json()
    query_tag = incoming["query_tag"]
    result = dispatch(db.engine.execute("SELECT room_id, name FROM chatroom WHERE tag = '" + str(query_tag) + "'"))
    suggested_rooms = [{'room_id': row[0], 'name': row[1]} for row in result]
    for room in suggested_rooms:
        res_mem = dispatch(db.engine.execute("SELECT distinct user.id, username FROM user join participant on user.id = participant.user_id where room_id ="+str(room['room_id'])))
        res_mem = [ row[1] for row in res_mem]
        room['members'] = res_mem
    return jsonify(results = suggested_rooms)


@app.route("/api/join_chatroom", methods=["POST"])
def join_chatroom():
    incoming = request.get_json()
    participant = Participant(
        user_id = session['user_id'],
        room_id = incoming['room_id'],
    )
    db.session.add(participant)
    db.session.commit()
    return jsonify(results = session['user_id'])
