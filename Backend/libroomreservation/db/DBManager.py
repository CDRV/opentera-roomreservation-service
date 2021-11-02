# Using same base as TeraServer
from libroomreservation.db.Base import db

# Must include all Database objects here to be properly initialized and created if needed
# All at once to make sure all files are registered.
from libroomreservation.db.models import *

from ConfigManager import ConfigManager

from FlaskModule import flask_app

# Alembic
from alembic.config import Config
from alembic import command

from libroomreservation.db.DBManagerRoomAccess import DBManagerRoomAccess
from libroomreservation.db.DBManagerReservationAccess import DBManagerReservationAccess
from libroomreservation.db.models.RoomReservationReservation import RoomReservationReservation
from libroomreservation.db.models.RoomReservationRoom import RoomReservationRoom


class DBManager:
    """db_infos = {
        'user': '',
        'pw': '',
        'db': '',
        'host': '',
        'port': '',
        'type': ''
    }"""

    def __init__(self):
        self.db_uri = None

    @staticmethod
    def roomAccess():
        access = DBManagerRoomAccess()
        return access

    @staticmethod
    def reservationAccess():
        access = DBManagerReservationAccess()
        return access

    def create_defaults(self, config: ConfigManager):

        if RoomReservationRoom.get_count() == 0:
            print('No rooms - creating defaults')
            RoomReservationRoom.create_defaults()

        if RoomReservationReservation.get_count() == 0:
            print('No room sessions - creating defaults')
            RoomReservationReservation.create_defaults()

    def open(self, db_infos, echo=False):
        self.db_uri = 'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % db_infos

        flask_app.config.update({
            'SQLALCHEMY_DATABASE_URI': self.db_uri,
            'SQLALCHEMY_TRACK_MODIFICATIONS': False,
            'SQLALCHEMY_ECHO': echo
        })

        # Create db engine
        db.init_app(flask_app)
        db.app = flask_app

        # Init tables
        # db.drop_all()
        db.create_all()

        # Apply any database upgrade, if needed
        self.upgrade_db()

    def open_local(self, db_infos, echo=False):
        self.db_uri = 'sqlite:///%(filename)s' % db_infos

        flask_app.config.update({
            'SQLALCHEMY_DATABASE_URI': self.db_uri,
            'SQLALCHEMY_TRACK_MODIFICATIONS': False,
            'SQLALCHEMY_ECHO': echo
        })

        # Create db engine
        db.init_app(flask_app)
        db.app = flask_app

        # Init tables
        db.create_all()

        # Apply any database upgrade, if needed
        self.upgrade_db()

    def upgrade_db(self):
        # TODO ALEMBIC UPGRADES...
        pass

    def stamp_db(self):
        # TODO ALEMBIC UPGRADES
        pass
