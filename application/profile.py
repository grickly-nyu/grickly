"""APIs about profile and password management"""
from flask import request, jsonify, session
from application.models import User
# from application.app import *
from index import app, db
# from application.utils.auth import generate_token, requires_auth, verify_token


def dispatch(result):
    """DB result parser"""
    return [row for row in result]

def get_profile_dict():
    """Parse DB result list to a dictionary"""
    res = dispatch(db.engine.execute( \
        "select id,username,email,created_at from user join user_info on user.id=user_info.user_id where id="
        + str(session["user_id"]) ))
    info = {'user_id': res[0][0], 'username': res[0][1],
        'email': res[0][2],"created_at":res[0][3]}
    return info

@app.route("/api/modify_profile", methods=["POST"])
def modify_profile():
    """
    modify_profile(email, username) -> Boolean
    Modify current user's user information.
    Return True if successful.
    """
    incoming = request.get_json()
    current_profile=get_profile_dict()
    if incoming["new_username"]:
        db.engine.execute("update user set username = '"+
        incoming["new_username"]+"' where id = "+str(session["user_id"]))
        db.session.commit()
    return jsonify(result = True),201

@app.route("/api/get_profile", methods=["POST"])
def get_profile():
    """
    get_profile(user_id) -> {“email”,“username”,”created_at”}
    Get other’s profile info (email, username,registration date).
    """
    info = get_profile_dict()
    return jsonify(results = info),200

@app.route("/api/change-password", methods=["POST"])
def change_password():
    """
    change_password(old_password,new_password) -> Boolean
    Change password for the current user.
    Return True if successful, False if unsuccessful.
    """
    incoming = request.get_json()
    current_profile=get_profile_dict()
    old_password=incoming["old_password"]
    if not User.get_user_with_email_and_password(current_profile["email"],old_password):
        return jsonify(result=False,
            message="Invalid old password. Please try again.")
    db.engine.execute("update user set password = '"+
        User.hashed_password(incoming["new_password"])+"' where id = "+str(session["user_id"]))
    return jsonify(result = True),201

@app.route("/api/get_others_profile", methods=["POST"])
def get_others_profile():
    """
    get_others_profile(user_id)->{“email”,“username”,”created_at”}
    Get someone else's profile info.
    """
    incoming = request.get_json()
    info = get_profile_dict(incoming["user_id"])
    return jsonify(results=info)

def get_user_by_hash(password_hash):
    """
    get_user_by_hash(password_hash)-->user_id
    If the hash input is incorrect, returns None.
    """
    user = dispatch(db.engine.execute("select id from user where password='" +
        password_hash +"'" ))
    if user:
        return user[0][0]
    else:
        return None

@app.route("/api/validate_email", methods=["POST"])
def validate_email():
    """
    validate_email(email)->Boolean,user
    Validates if the user has access to the email address
    used for the account by checking the hash code in the link.
    Return result = True and user_id if the correct hash is obtained,
    return result = False otherwise.
    """
    incoming = request.get_json()
    password_hash = incoming["hash"]
    user=get_user_by_hash(password_hash)
    if user is not None:
        return jsonify(result=True,user_id=user),200
    else:
        return jsonify(result=False),401

@app.route("/api/reset_password", methods=["POST"])
def reset_password():
    """
    reset_password(hash,new_password)->Boolean
    Reset the password by verifying email and discard the old password.
    returns True if successful.
    """
    incoming = request.get_json()
    password_hash = incoming["hash"]
    user = get_user_by_hash(password_hash)
    db.engine.execute("update user set password = '"+
        User.hashed_password(incoming["new_password"]) + "' where id = " + str(user))
    return jsonify(result = True),201
