from flask import request, render_template, jsonify, url_for, redirect, g, session
from .models import *
from index import app, db
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from datetime import datetime


def dispatch(result):
    return [row for row in result]


@app.route("/api/get_suggestions", methods=["GET"])
def get_suggestions():
    # matching return a list of room ids and room names, up to 10
    incoming = request.get_json()
    query_tag = incoming["query_tag"]
    result = dispatch(db.engine.execute("SELECT room_id, name FROM chatroom where tag = query_tag"))

    # wait。 需要一个简单的textbox user 输入tag, 然后需要button， 然后run。
    # 或者给一堆button 去选择呢？ 

    suggested_rooms = [{'room_id': row[0], 'name': row[1]} for row in result]

    for room in suggested_rooms:
        res = dispatch(db.engine.execute("SELECT distinct user.id, username FROM user join participant on user.id = participant.user_id where room_id ="+str(room['room_id'])))
        res = [ row[1] for row in res]
        room['members'] = res
    return jsonify(results = suggested_rooms)
    


