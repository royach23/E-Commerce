import models.user
from fastapi import HTTPException, status, Response

def getAllUsers(db):
    all_users = db.query(models.user.User).all()
    return all_users

def createUser(user, db):
    new_user = models.user.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def deleteUser(user_id: int, db):
    delete_user = db.query(models.user.User).filter(models.user.User.user_id == user_id)
    delete_user_result = delete_user.first()
    if delete_user_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with such id does not exist")
    else:
        delete_user.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def update(user_id: int, user, db):
    updated_user = db.query(models.user.User).filter(models.user.User.user_id == user_id)
    updated_user.first()
    if updated_user == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'user with such id: {id} does not exist')
    else:
        updated_user.update(user.dict(), synchronize_session=False)
        db.commit()
    return updated_user.first()