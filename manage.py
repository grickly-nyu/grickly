from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from application.app import app, db
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
    
migrate = Migrate(app, db)
manager = Manager(app)

# migrations
manager.add_command('db', MigrateCommand)


@manager.command
def create_db():
    """Creates the db tables."""
    db.create_all()

# @manager.command
# def runserver():
#     socketio = SocketIO(app, async_mode=None)
#     socketio.run(app)

if __name__ == '__main__':
    manager.run()
