def authToString(auth: int):
    if auth == 0:
        return "student"
    elif auth == 1:
        return "teacher"
    elif auth == 2:
        return "admin"
    else:
        return "Unknown"