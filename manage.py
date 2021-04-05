from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from application.app import app, db, socketio
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
migrate = Migrate(app, db)
manager = Manager(app)

# migrations
manager.add_command('db', MigrateCommand)


@manager.command
def create_db():
    """
    Creates the db tables
    """
    db.create_all()

@manager.command
def runserver():
    """
    Run in test mode (localhost)
    """
    socketio.run(app)
    
@manager.command
def deploy():
    """
    For server deploy only; will let the server be discoverable by ip other than localhost
    """
    socketio.run(app, host='0.0.0.0')
    
if __name__ == '__main__':
    """
    Run without paramter will prompt help
    """
    manager.run()
