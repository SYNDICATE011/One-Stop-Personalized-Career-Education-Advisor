from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.psql_connection import get_db
from app.database.user_model import UserResponse
import requests
from app.core.config import settings

ai = APIRouter()


@ai.post("/recommendation/{user_id}")
def ai_recommendations(user_id: int, db: Session = Depends(get_db)):
    # Fetch user responses
    responses = db.query(UserResponse).filter(
        UserResponse.user_id == user_id).all()
    if not responses:
        raise HTTPException(
            status_code=404, detail="No responses found for user.")

    # Prepare user answers for AI
    user_answers = []
    for r in responses:
        option_text = r.option.option_text
        question_text = r.question.question_text
        user_answers.append(f"Q: {question_text}\nA: {option_text}")

    prompt = (
        "You are a career guidance AI. Based on the user's answers to these questions, "
        "recommend the most suitable career paths with confidence scores from 0-100.\n\n"
        + "\n".join(user_answers)
    )

    # Prepare headers and payload for OpenRouter / Mistral
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistralai/mistral-7b-instruct:free",
        "prompt": prompt,
        "temperature": 0.7,
        "max_tokens": 500
    }

    response = requests.post(settings.OPENROUTER_ENDPOINT,
                             json=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail=response.text)

    ai_result = response.json()
    print(ai_result)
    ai_message = ai_result.get("choices", [{}])[0].get("text", "")

    return {"ai_recommendation": ai_message}
