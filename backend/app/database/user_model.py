from app.core.psql_connection import Base

import enum
from uuid import uuid4
from sqlalchemy import TIMESTAMP, Boolean, Column, ForeignKey, String, Integer, UUID, Text, Enum, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text


class Users(Base):

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    picture = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=text('now()'), nullable=False)
    is_verified = Column(Boolean, nullable=False, default=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    about = Column(String, nullable=True)
