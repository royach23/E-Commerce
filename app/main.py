import models.user
from app.utils.database import engine, get_db
from fastapi import FastAPI, Depends, status
from sqlalchemy.orm import Session
from schemas.user import Users
import crud.user

app = FastAPI()

models.user.Base.metadata.create_all(bind= engine)

@app.get("/users")
def getAllUsers(db: Session = Depends(get_db)):
    return crud.user.getAllUsers(db)

@app.post("/users")
def createUser(user: Users, db: Session = Depends (get_db)):
    return crud.user.createUser(user, db)

@app.delete("/user/{user_id}")
def delete(user_id:int, db: Session = Depends(get_db), status_code = status.HTTP_204_NO_CONTENT):
    return crud.user.deleteUser(user_id, db, status_code)