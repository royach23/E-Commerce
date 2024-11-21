import models
from database import engine
from fastapi import FastAPI

app = FastAPI()

models.Base.metadata.create_all(bind= engine)

@app.get("/users")
def users():
    return "hello"