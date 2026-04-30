import os
import redis


r = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True
)


FILE_LIMITS = {
    "user": 1,
    "professional": 6,
}

FILE_SIZE_LIMITS = {
    "user": 250  * 1024 * 1024,  # 200 MB
    "professional": 500 * 1024 * 1024,   # 500 MB
}

GUEST_FILE_SIZE_LIMIT = 100  * 1024 * 1024  # 100 M



def can_user_process(user):
    if not user or not user.is_authenticated:
        return True, ""

    level = user.profile.level
    max_tasks = FILE_LIMITS.get(level)

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


def check_file_size(user, file):
    if not user or not user.is_authenticated:
        limit = GUEST_FILE_SIZE_LIMIT
    else:
        level = user.profile.level
        limit = FILE_SIZE_LIMITS.get(level, GUEST_FILE_SIZE_LIMIT)

    if file.size > limit:
        mb = limit // (1024 * 1024)
        return False, f"File too large. Max size for your plan is {mb} MB"

    return True, ""