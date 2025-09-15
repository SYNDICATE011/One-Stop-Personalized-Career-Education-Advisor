import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # database
    DB_NAME: str
    DB_HOST: str
    DB_PORT: int
    DB_PASS: str
    DB_USER: str

    # clerk
    CLERK_SECRETE_KEY: str
    JWT_KEY: str

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "../../.env")
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
