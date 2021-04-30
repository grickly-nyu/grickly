""" This is the module that sends the verification email."""
# from flask import Flask
from flask_mail import Mail, Message
from flask import request, jsonify
from index import app, db


app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'grickly.nyu@gmail.com'
app.config['MAIL_PASSWORD'] = 'gricklynyu2021'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True


mail = Mail(app)
MESSAGE="Click the link to reset your password."

def dispatch(result):
    """DB query result parser"""
    return [row for row in result]

@app.route("/api/send_verification_email",methods=["POST"])
def send_verification_email():
    """
    send_verification_email->Boolean
    Sends an email containing a password reset link to the user’s email.
    Return True if successful.
    """
    incoming=request.get_json()
    msg = Message('Reset your password for Grickly',
                  sender = 'grickly.nyu@gmail.com', recipients = [incoming["email"]])
    info = dispatch(db.engine.execute("select password from user where email='"+
                     incoming["email"]+"'"))
    if not info:
        return jsonify(result=False)
    password_hash=info[0][0]
    msg.body =  MESSAGE + "http://localhost:3000/reset_forgot_password?hash="+password_hash
    mail.send(msg)
    return jsonify(result=True),200
