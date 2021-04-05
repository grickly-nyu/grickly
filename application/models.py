from index import db, bcrypt
from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True)
    children = relationship("User_info")

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

    def get_user_with_user_id(user_id):
        return User.query.filter_by(id = user_id).first()

class User_info(db.Model):
    user_id = db.Column(db.Integer(), ForeignKey('user.id'), primary_key=True)
    created_at = db.Column(db.DateTime())
    phone = db.Column(db.Integer())
    
    def __init__(self, user_id, created_at, phone):
        self.user_id = user_id
        self.created_at = created_at
        self.phone = phone

class Interest(db.Model):
    user_id = db.Column(db.Integer(), ForeignKey('user.id'), primary_key=True)
    interest = db.Column(db.String(255))
    def __init__(self, user_id, interest):
        self.user_id = user_id
        self.interest = interest

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

    def get_chatroom_with_room_id(room_id):
        return Chatroom.query.filter_by(room_id = room_id).first()

    def delete_chatroom_with_room_id(room_id):
        chatroom = Chatroom.get_chatroom_with_room_id(room_id)
        if chatroom:
            db.session.delete(chatroom)
            db.session.commit()

class Participant(db.Model):
    user_id = db.Column(db.Integer(), ForeignKey('user.id'), primary_key=True)
    room_id = db.Column(db.Integer(), ForeignKey('chatroom.room_id'), primary_key=True)
    def __init__(self, user_id, room_id):
        self.user_id = user_id
        self.room_id = room_id
    
    def get_participant_with_user_id_and_room_id(user_id, room_id):
        return Participant.query.filter_by(user_id = user_id, room_id = room_id).first()
    
    def delete_participant_with_user_id_and_room_id(user_id, room_id):
        participant = Participant.get_participant_with_user_id_and_room_id(user_id, room_id)
        if participant:
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

    def get_messages_from_room_id(room_id):
        return Message.query.filter_by(room_id=room_id).all()

    def delete_messages_from_room_id(room_id):
        Message.query.filter_by(room_id=room_id).delete()
        db.session.commit()

class Event(db.Model):
    room_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(45))
    location = db.Column(db.String(45))
    description = db.Column(db.String(255))
    start_time = db.Column(db.DateTime())
    end_time = db.Column(db.DateTime())

    def __init__(self, room_id, name, location, start_time, end_time, description):
        self.room_id = room_id
        self.name = name
        self.location = location
        self.start_time = start_time
        self.end_time = end_time
        self.description = description

    def get_event_with_room_id(room_id):
        return Event.query.filter_by(room_id=room_id).first()
    
    def delete_event_with_room_id(room_id):
        event = Event.get_event_with_room_id(room_id)
        if event:
            db.session.delete(event)
            db.session.commit()


