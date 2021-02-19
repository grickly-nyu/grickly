from index import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True)

    def __init__(self, email, password, username):
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)
        self.username = username

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None
    
    
            
class Chatroom(db.Model):
    room_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255))
    def __init__(self, name):
        self.name = name

class Message(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer())
    room_id = db.Column(db.Integer())
    sent = db.Column(db.Boolean())
    sendTime = db.Column(db.DateTime())

    def __init__(self, user_id, room_id, sent, sendTime):
        self.user_id = user_id
        self.room_id = room_id
        self.sent = sent
        self.sendTime= sendTime
