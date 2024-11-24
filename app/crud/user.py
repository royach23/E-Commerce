from models.user import User
from fastapi import HTTPException, status, Response

def getAllUsers(db):
    all_users = db.query(User).all()
    return all_users

def createUser(user, db):
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def deleteUser(user_id: int, db):
    delete_user = db.query(User).filter(User.user_id == user_id)
    delete_user_result = delete_user.first()
    if delete_user_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with such id does not exist")
    else:
        delete_user.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def update(user_id: int, user, db):
    updated_user = db.query(User).filter(User.user_id == user_id)
    result = updated_user.first()
    if result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'user with such id: {user_id} does not exist')
    else:
        updated_user.update(user.dict(), synchronize_session=False)
        db.commit()
    return updated_user.first()