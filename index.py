from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import BaseConfig
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO

app = Flask(__name__, static_folder="./static/dist", template_folder="./static")



app.config.from_object(BaseConfig)
socketio = SocketIO(app, cors_allowed_origins='*')
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
