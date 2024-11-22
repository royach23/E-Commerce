import models.user
from fastapi import HTTPException, status, Response

def getAllUsers(db):
    all_products = db.query(models.user.User).all()
    return all_products

def createUser(user, db):
    new_user = models.user.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def deleteUser(user_id: int, db):
    delete_post = db.query(models.user.User).filter(models.user.User.user_id == user_id)
    delete_post_result = delete_post.first()
    if delete_post_result == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with such id does not exist")
    else:
        delete_post.delete(synchronize_session=False)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def update(user_id: int, user, db):
    updated_post = db.query(models.user.User).filter(models.user.User.user_id == user_id)
    updated_post.first()
    if updated_post == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'user with such id: {id} does not exist')
    else:
        updated_post.update(user.dict(), synchronize_session=False)
        db.commit()
    return updated_post.first()