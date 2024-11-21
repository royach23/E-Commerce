import models
from database import engine, get_db
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from schemas import Users

app = FastAPI()

models.Base.metadata.create_all(bind= engine)

@app.get("/users")
def getUsers():
    return "hello"

@app.post("/users")
def create(user: Users, db: Session = Depends (get_db)):
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user