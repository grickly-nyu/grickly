from flask import request, render_template, jsonify, url_for, redirect, g, session, Flask
from flask_restful import abort
from .models import *
from .app import *
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
from sqlalchemy import text
from datetime import datetime

def dispatch(result):
    return [row for row in result]

def get_profile_dict():
    res = dispatch(db.engine.execute("select id,username,email,created_at from user join user_info on user.id=user_info.user_id where id=" + str(session["user_id"]) ))
    info = {'user_id': res[0][0], 'username': res[0][1], 'email': res[0][2],"created_at":res[0][3]}
    return info

@app.route("/api/modify_profile", methods=["POST"])
def modify_profile():
    incoming = request.get_json()
    current_profile=get_profile_dict()
    if incoming["new_username"]:
        db.engine.execute("update user set username = '"+incoming["new_username"]+"' where id = "+str(session["user_id"]))
        db.session.commit()
    return jsonify(
        new_username=incoming["new_username"],
        new_email=incoming["new_email"]
    )

@app.route("/api/get_profile", methods=["POST"])
def get_profile():
    info = get_profile_dict()
    return jsonify(results = info)
    
@app.route("/api/change_password", methods=["POST"])
def change_password():
    incoming = request.get_json()
    current_profile=get_profile_dict()
    old_password=incoming["old_password"]
    if not User.get_user_with_email_and_password(current_profile["email"],old_password):
        return jsonify(result=False, message="Invalid old password. Please try again.")
    db.engine.execute("update user set password = '"+User.hashed_password(incoming["new_password"])+"' where id = "+str(session["user_id"]))
    return jsonify(result = True)
    
@app.route("/api/get_others_profile", methods=["POST"])
def get_others_profile():
    incoming = request.get_json()
    info = get_profile_dict(incoming["user_id"])
    return jsonify(results=info)

@app.route("/api/get_event_info", methods=["POST"])
def get_event_info():
    incoming = request.get_json()
    res=dispatch(db.engine.execute("select location,start_time from event_info where room_id = "+ str(incoming["room_id"])))
    return jsonify(location=res[0][0],start_time=res[0][1])

# @app.route("/set_new_password")
# def set_new_password():

def get_user_by_hash(password_hash):
    user = dispatch(db.engine.execute("select id from user where password='" + password_hash +"'" ))
    if user:
        return user[0][0]
    else:
        return None

@app.route("/api/validate_email", methods=["POST"])
def validate_email():
    incoming = request.get_json()
    password_hash = incoming["hash"]
    user=get_user_by_hash(password_hash)
    if user!=None:
        return jsonify(result=True,user_id=user)
    else:
        return jsonify(result=False)

@app.route("/api/reset_password", methods=["POST"])
def reset_password():
    incoming = request.get_json()
    password_hash = incoming["hash"]
    user = get_user_by_hash(password_hash)
    db.engine.execute("update user set password = '"+ User.hashed_password(incoming["new_password"]) + "' where id = " + str(user))
    return jsonify(result = True)
