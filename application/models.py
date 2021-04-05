from index import db, bcrypt
from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

class User(db.Model):
    """
    User Model for server runtime

    Attributes
    ----------
    id : id
        user id in db
    email : str 
        user email in db
    password : str
        user password after hashing in db
    username : str
        username in db
    children : relationship
        database relationship for User_Info
    """
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    username = db.Column(db.String(255), unique=True)
    children = relationship("User_info")

    def __init__(self, email, password, username):
        """
        Initialize user model from db
        """
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)
        self.username = username

    @staticmethod
    def hashed_password(password):
        """
        Return hashed password

        :return: return hashed password
        """
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        """
        Get function for user
        :param email: email address
        :param password: raw password

        :return: return user if found; if not, return None
        """
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None

    def get_user_with_user_id(user_id):
        return User.query.filter_by(id = user_id).first()

class User_info(db.Model):
    """
    Model for more specific user information


    Attributes
    ------------------
    user_id : int
        user id from db
    created_at ：str
        created date and time from db
    phone : int
        user phone number from db

    """
    user_id = db.Column(db.Integer(), ForeignKey('user.id'), primary_key=True)
    created_at = db.Column(db.DateTime())
    phone = db.Column(db.Integer())
    
    def __init__(self, user_id, created_at, phone):
        """
        Initialize User_Info model
        """
        self.user_id = user_id
        self.created_at = created_at
        self.phone = phone

class Interest(db.Model):
    """
    Model for user interest in groups

    Attributes:
    ----------------
    user_id : int
        user_id from db
    interest : str
        user interest from db
    """
    user_id = db.Column(db.Integer(), ForeignKey('user.id'), primary_key=True)
    interest = db.Column(db.String(255))
    def __init__(self, user_id, interest):
        """
        Initialize Interest model
        """
        self.user_id = user_id
        self.interest = interest

class Chatroom(db.Model):
    """
    Model for chatroom platform


    Attributes:
    ----------------
    room_id : int
        room_id for the chatroom from db
    name : str
        room name from db
    tag : str
        room interest tag from db
    """
    room_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255))
    tag = db.Column(db.String(255))
    def __init__(self, name, tag):
        """
        Initialize model Chatroom
        """
        self.name = name
        self.tag = tag

    def get_chatroom_with_user_id(user_id):
        """
        Get function for chatroom from the same user

        :return: return room_id and names
        """
        return db.engine.execute("SELECT room_id, name FROM chatroom natural join participant where user_id =" + str(user_id))

    def get_room_members_with_room_id(room_id):
        """
        Get function for room members in the same room
        
        :return: return room members' user.id and username
        """
        return db.engine.execute("SELECT distinct user.id, username FROM user join participant on user.id = participant.user_id where room_id =" + str(room_id))

    def get_chatroom_with_room_id(room_id):
        """
        Get function for room using room_id

        :return: return room_id
        """
        return Chatroom.query.filter_by(room_id = room_id).first()

    def delete_chatroom_with_room_id(room_id):
        """
        Delete chatroom with room_id
        """
        chatroom = Chatroom.get_chatroom_with_room_id(room_id)
        if chatroom:
            db.session.delete(chatroom)
            db.session.commit()

class Participant(db.Model):
    """
    Model for event participant


    Attributes:
    -------------------
    user_id : int
        user_id from db
    room_id : int
        room_id from db
    """
    user_id = db.Column(db.Integer(), primary_key=True)
    room_id = db.Column(db.Integer(), primary_key=True)
    def __init__(self, user_id, room_id):
        """
        Initialize model Participant
        """
        self.user_id = user_id
        self.room_id = room_id
    
    def get_participant_with_user_id_and_room_id(user_id, room_id):
        """
        Get function for participants in the same room with user_id

        :return: return participant satisfying the requirement
        """
        return Participant.query.filter_by(user_id = user_id, room_id = room_id).first()
    
    def delete_participant_with_user_id_and_room_id(user_id, room_id):
        """
        Delete participant from the room with user_id
        """
        participant = Participant.get_participant_with_user_id_and_room_id(user_id, room_id)
        if participant:
            db.session.delete(participant)
            db.session.commit()

class Message(db.Model):
    """
    Model for messages in chatroom

    Attributes:
    -----------------
    id : int
        message id in db
    user_id : int
        user_id of sender in db
    room_id : int
        room_id of the message existing in db
    sendTime : str
        message sent time from db
    content : str
        raw message
    """
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer())
    room_id = db.Column(db.Integer())
    sendTime = db.Column(db.DateTime())
    content = db.Column(db.String(255))

    def __init__(self, user_id, room_id, sendTime, content):
        """
        Initialize model Message
        """
        self.user_id = user_id
        self.room_id = room_id
        self.content = content
        self.sendTime= sendTime

    def get_messages_from_room_id(room_id):
        """
        Get function for message using room_id

        :return: return messages in the room
        """
        return Message.query.filter_by(room_id=room_id).all()

    def delete_messages_from_room_id(room_id):
        """
        Delete messages using room_id
        """
        Message.query.filter_by(room_id=room_id).delete()
        db.session.commit()

class Event(db.Model):
    """
    Model for Events platform

    Attributes:
    ---------------
    room_id : int
        room_id in db
    name : str
        name of the event in db
    location : str
        location of the event in db
    description: str
        event description in db
    start_time : str
        event start time
    end_time : str
        event end time
    """
    room_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(45))
    location = db.Column(db.String(45))
    description = db.Column(db.String(255))
    start_time = db.Column(db.DateTime())
    end_time = db.Column(db.DateTime())

    def __init__(self, room_id, name, location, start_time, end_time, description):
        """
        Initialize the model Event
        """
        self.room_id = room_id
        self.name = name
        self.location = location
        self.start_time = start_time
        self.end_time = end_time
        self.description = description

    def get_event_with_room_id(room_id):
        """
        Get function for event with room_id

        :return: return event with the room_id
        """
        return Event.query.filter_by(room_id=room_id).first()
    
    def delete_event_with_room_id(room_id):
        """
        Delete function for event with room_id
        """
        event = Event.get_event_with_room_id(room_id)
        if event:
            db.session.delete(event)
            db.session.commit()


