import redis

r = redis.Redis(host='localhost', port=6379, db=0)

LIMITS = {
    "user": 1,
    "professional": 6,
}

def can_user_process(user):
    if not user or not user.is_authenticated:
        return True, ""

    level = user.profile.level
    max_tasks = LIMITS.get(level)

    if max_tasks is None:
        return True, ""

    key = f"active:{user.id}"
    current = int(r.get(key) or 0)

    if current >= max_tasks:
        return False, f"Limit reached: max {max_tasks} active task(s) for your plan"
    else:
        return True, ""


def increment_active(user_id):
    key = f"active:{user_id}"
    r.incr(key)
    r.expire(key, 3600)  # TTL на случай если задача упала без cleanup