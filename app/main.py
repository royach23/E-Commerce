import models.user
from app.utils.database import engine, get_db
from fastapi import FastAPI, Depends
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

# @app.delete("/delete/{user_id}")
# def delete(user_id:int, db: Session = Depends(get_db), status_code = status.HTTP_204_NO_CONTENT):
#     delete_post = db.query(models.Product).filter(models.Product.id = id)
# if delete_post == None:
# 6789
# 10
# raise HTTPException (status_code=status.HTTP_404_NOT_FOUND, detail=f"product with such id does not exist")
# else:
# delete_post.delete(synchronize_session=False)
# db.commit()
# return Response(status_code=status.HTTP_204_NO_CONTENT)