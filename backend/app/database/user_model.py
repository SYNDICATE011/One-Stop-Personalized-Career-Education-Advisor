from app.core.psql_connection import Base
from datetime import datetime

import enum
from uuid import uuid4
from sqlalchemy import JSON, TIMESTAMP, Boolean, Column, ForeignKey, String, Integer, UUID, Text, Enum, Date,  DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text


class DifficultyLevel(enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Category(enum.Enum):
    quantitative = "quantitative"
    logical = "logical"
    verbal = "verbal"
    data_interpretation = "data_interpretation"
    intrest = "intrest"


class User(Base):

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    clerk_id = Column(String, nullable=False)
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

    responses = relationship(
        "UserResponse", back_populates="user", cascade="all, delete")
    recommendations = relationship(
        "UserCareerRecommendation", back_populates="user", cascade="all, delete")


class AptitudeQuestions(Base):
    __tablename__ = "aptitude_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    question_text = Column(String, nullable=False)
    options = Column(JSON, nullable=False)
    correct_answer = Column(String, nullable=False)
    difficulty = Column(Enum(DifficultyLevel), nullable=False,
                        default=DifficultyLevel.easy)
    category = Column(Enum(Category), nullable=False)
    field = Column(String)

    answers = relationship(
        "QuizAnswers", back_populates="question", cascade="all, delete")


class QuizSessions(Base):
    __tablename__ = "quiz_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    score = Column(Integer, nullable=False, default=0)

    answers = relationship(
        "QuizAnswers", back_populates="session", cascade="all, delete")


class QuizAnswers(Base):
    __tablename__ = "quiz_answers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey(
        "quiz_sessions.id", ondelete="CASCADE"))
    question_id = Column(UUID(as_uuid=True), ForeignKey(
        "aptitude_questions.id", ondelete="CASCADE"))
    selected_option = Column(String, nullable=False)
    is_correct = Column(Boolean, nullable=False)

    session = relationship("QuizSessions", back_populates="answers")
    question = relationship("AptitudeQuestions", back_populates="answers")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    category = Column(String(50))
    sub_category = Column(String(50))
    created_at = Column(TIMESTAMP(timezone=True),
                        server_default=text('now()'), nullable=False)

    options = relationship("Option", back_populates="question")


class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey(
        "questions.id", ondelete="CASCADE"))
    option_text = Column(String(255), nullable=False)
    mapped_careers = Column(Text)
    is_positive = Column(Boolean, default=False)

    question = relationship("Question", back_populates="options")
    responses = relationship("UserResponse", back_populates="option")


class UserResponse(Base):
    __tablename__ = "user_responses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey(
        "questions.id", ondelete="CASCADE"))
    option_id = Column(Integer, ForeignKey("options.id", ondelete="CASCADE"))
    answered_at = Column(TIMESTAMP(timezone=True),
                         server_default=text('now()'), nullable=False)

    user = relationship("User", back_populates="responses")
    option = relationship("Option", back_populates="responses")
    question = relationship("Question")


class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(Integer, primary_key=True, index=True)
    career_name = Column(String(100), nullable=False)
    description = Column(Text)
    field = Column(String(50))

    recommendations = relationship(
        "UserCareerRecommendation", back_populates="career")


class UserCareerRecommendation(Base):
    __tablename__ = "user_career_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    career_id = Column(Integer, ForeignKey(
        "career_paths.id", ondelete="CASCADE"))
    confidence_score = Column(DECIMAL(5, 2))
    recommended_at = Column(TIMESTAMP(timezone=True),
                            server_default=text('now()'), nullable=False)

    user = relationship("User", back_populates="recommendations")
    career = relationship("CareerPath", back_populates="recommendations")
