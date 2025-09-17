from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
import random
from pydantic import BaseModel
from typing import Dict, List
from uuid import UUID, uuid4
from sqlalchemy.exc import SQLAlchemyError

from app.core.psql_connection import get_db
from app.database.user_model import AptitudeQuestions, User, QuizAnswers, QuizSessions, Question, Option, UserResponse
from app.core.authentication import get_current_user

aptitude = APIRouter()


class AnswerSubmission(BaseModel):
    session_id: UUID
    answers: Dict[UUID, str]


class SubmissionResult(BaseModel):
    score: int
    results: List[dict]


class SessionCreate(BaseModel):
    user_id: int


class SessionResponse(BaseModel):
    session_id: UUID
    user_id: int
    score: int


class OverallReport(BaseModel):
    total_attempts: int
    total_questions_answered: int
    total_correct: int
    total_incorrect: int
    average_score: float
    accuracy_percentage: float


class AnswerItem(BaseModel):
    question_id: int
    option_id: int


class SubmitResponses(BaseModel):
    user_id: int
    answers: List[AnswerItem]


@aptitude.post("/start-session", response_model=SessionResponse)
def start_quiz_session(payload: SessionCreate, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session = QuizSessions(
        id=uuid4(),
        user_id=payload.user_id,
        score=0
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "session_id": session.id,
        "user_id": session.user_id,
        "score": session.score
    }


@aptitude.get('/questions')
async def aptitude_questions(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(
        None, description="Filter by difficulty"),
    limit: int = Query(10, ge=1, le=50, description="Number of questions"),

):

    query = db.query(AptitudeQuestions)

    if category:
        query = query.filter(AptitudeQuestions.category == category)

    if difficulty:
        query = query.filter(AptitudeQuestions.difficulty == difficulty)

    questions = query.all()

    if len(questions) > limit:
        questions = random.sample(questions, limit)

    return questions


@aptitude.post("/submit", response_model=SubmissionResult)
def submit_quiz(payload: AnswerSubmission, db: Session = Depends(get_db)):
    session = db.query(QuizSessions).filter(
        QuizSessions.id == payload.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")

    total_score = 0
    results = []

    for qid, selected in payload.answers.items():
        question = db.query(AptitudeQuestions).filter(
            AptitudeQuestions.id == qid).first()
        if not question:
            raise HTTPException(
                status_code=404, detail=f"Question {qid} not found")

        is_correct = (selected.strip().lower() ==
                      question.correct_answer.strip().lower())
        if is_correct:
            total_score += 1

        answer_entry = QuizAnswers(
            session_id=session.id,
            question_id=question.id,
            selected_option=selected,
            is_correct=is_correct
        )
        db.add(answer_entry)

        results.append({
            "question_id": str(question.id),
            "question_text": question.question_text,
            "selected_option": selected,
            "correct_answer": question.correct_answer,
            "is_correct": is_correct
        })

    session.score = total_score
    db.commit()

    return {"score": total_score, "results": results}


@aptitude.get("/user-report/{user_id}", response_model=OverallReport)
def get_user_report(user_id: int, db: Session = Depends(get_db)):
    sessions = db.query(QuizSessions).filter(
        QuizSessions.user_id == user_id).all()
    if not sessions:
        raise HTTPException(
            status_code=404, detail="No quiz sessions found for this user")

    total_attempts = len(sessions)
    total_questions_answered = 0
    total_correct = 0

    for session in sessions:
        total_questions_answered += len(session.answers)
        total_correct += sum(1 for ans in session.answers if ans.is_correct)

    total_incorrect = total_questions_answered - total_correct
    average_score = sum(s.score for s in sessions) / \
        total_attempts if total_attempts > 0 else 0
    accuracy_percentage = (total_correct / total_questions_answered) * \
        100 if total_questions_answered > 0 else 0

    return OverallReport(
        total_attempts=total_attempts,
        total_questions_answered=total_questions_answered,
        total_correct=total_correct,
        total_incorrect=total_incorrect,
        average_score=average_score,
        accuracy_percentage=accuracy_percentage
    )


@aptitude.get("/category-based/{category}/{sub_category}")
async def category_based_questions(category: str, sub_category: str, db: Session = Depends(get_db)):

    if not category:
        raise HTTPException(status_code=400, detail="Category not given")

    # Fetch all questions for this category
    questions = db.query(Question).filter(
        Question.category == category, Question.sub_category == sub_category).all()

    if not questions:
        raise HTTPException(status_code=404, detail="Questions not available")

    result = []
    for q in questions:
        result.append({
            "id": q.id,
            "question_text": q.question_text,
            "category": q.category,
            "sub_category": q.sub_category,
            "options": [
                {
                    "id": opt.id,
                    "option_text": opt.option_text,
                    "mapped_careers": opt.mapped_careers,
                    "is_positive": opt.is_positive,
                }
                for opt in q.options
            ]
        })

    return result


@aptitude.post("/submit-responses")
def submit_responses(payload: SubmitResponses, db: Session = Depends(get_db)):
    try:
        for ans in payload.answers:

            existing = (
                db.query(UserResponse)
                .filter_by(user_id=payload.user_id, question_id=ans.question_id)
                .first()
            )

            if existing:

                existing.option_id = ans.option_id
            else:

                db_response = UserResponse(
                    user_id=payload.user_id,
                    question_id=ans.question_id,
                    option_id=ans.option_id
                )
                db.add(db_response)

        db.commit()
        return {"message": "Responses saved successfully"}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
