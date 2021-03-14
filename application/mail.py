from flask import Flask
from flask_mail import Mail, Message
from index import app, db
from flask import request, jsonify, g, session

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'grickly.nyu@gmail.com'
app.config['MAIL_PASSWORD'] = 'gricklynyu2021'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True


mail = Mail(app)

def dispatch(result):
    return [row for row in result]

@app.route("/api/send_verification_email",methods=["POST"])
def send_verification_email():
   incoming=request.get_json()
   msg = Message('Reset your password for Grickly', sender = 'grickly.nyu@gmail.com', recipients = [incoming["email"]])
   info = dispatch(db.engine.execute("select password from user where email='"+incoming["email"]+"'"))
   if not info:
      return jsonify(result=False)
   password_hash=info[0][0]
   msg.body = "Click the link to reset your password. http://localhost:3000/reset_forgot_password?hash="+password_hash
   mail.send(msg)
   return jsonify(result=True)
