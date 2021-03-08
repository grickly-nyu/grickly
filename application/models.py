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
    tag = db.Column(db.String(255))
    def __init__(self, name, tag):
        self.name = name
        self.tag = tag
    
    def get_chatroom_with_user_id(user_id):
        return db.engine.execute("SELECT room_id, name FROM chatroom natural join participant where user_id =" + str(user_id))

    def get_room_members_with_room_id(room_id):
        return db.engine.execute("SELECT distinct user.id, username FROM user join participant on user.id = participant.user_id where room_id =" + str(room_id))

class Participant(db.Model):
    user_id = db.Column(db.Integer(), primary_key=True)
    room_id = db.Column(db.Integer(), primary_key=True)
    def __init__(self, user_id, room_id):
        self.user_id = user_id
        self.room_id = room_id
    
    def get_participant(self, user_id, room_id):
        return Participant.query.filter_by(user_id = user_id, room_id = room_id).first()
    
    def delete(self):
        participant = self.get_participant(self.user_id, self.room_id)
        db.session.delete(participant)
        db.session.commit()

class Message(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer())
    room_id = db.Column(db.Integer())
    sendTime = db.Column(db.DateTime())
    content = db.Column(db.String(255))

    def __init__(self, user_id, room_id, sendTime, content):
        self.user_id = user_id
        self.room_id = room_id
        self.content = content
        self.sendTime= sendTime