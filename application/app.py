"""
The module that handles user sign up and creating new user.
"""
from sqlalchemy.exc import IntegrityError
from flask import request, render_template, jsonify, g, session
from application.models import User
from application.chatroom import *
from application.event import *
from application.profile import *
from application.mail import *
from application.matching import *
from index import app, db

from application.utils.auth import generate_token, requires_auth, verify_token

@app.route('/', methods=['GET'])
def index():
    """
    Return Index

    :return: returns index webpage
    """
    return render_template('index.html')

@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    """
    Redirect root access to index

    :return: returns index webpage
    """

    return render_template('index.html')

@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    """
    Get function for current user

    :return: returns current user in JSON
    """
    return jsonify(result=g.current_user)


@app.route("/api/create_user", methods=["POST"])
def create_user():
    """
    Create a new user in database.
    It checks for duplicate email address

    :return: returns user id and token in JSON if no duplicate user is found;
    if found, return error in JSON

    """
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
    db.engine.execute("insert into user_info values("+str(new_user.id)+",now(),null)")
    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )

@app.route("/api/get_token", methods=["POST"])
def get_token():

    """
    Get function for current user token

    :return: returns current token in JSON if success; if fail, return error in JSON
    """
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        session['user_id'] = user.id
        session['username'] = user.username
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():

    """
    Validate token

    :return: return valid message in JSON if valid; if not, return false in JSON
    """
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403
