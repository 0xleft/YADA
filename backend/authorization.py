from flask import session, redirect, url_for, request
from functools import wraps

def authorization(required_level):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if 'auth_level' in session:
                user_level = int(session['auth_level'])
                if user_level >= required_level:
                    return func(*args, **kwargs)
            return redirect("/api/auth/logout")
        return wrapper
    return decorator