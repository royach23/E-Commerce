import models.user

def getAllUsers(db):
    all_products = db.query(models.user.User).all()
    return all_products

def createUser(user, db):
    new_user = models.user.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user