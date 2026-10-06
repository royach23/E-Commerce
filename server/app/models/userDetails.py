class UserDetails:
    def __init__(self, user_id=None, username="", first_name="", last_name="", address="", phone_number="", email="", is_admin=False, roles=None):
        self.user_id = user_id
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.address = address
        self.phone_number = phone_number
        self.email = email
        self.is_admin = is_admin
        self.roles = roles or []

