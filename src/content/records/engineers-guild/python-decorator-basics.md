---
title: "Python 데코레이터, 겉핥기 말고 제대로"
description: "함수를 감싸는 함수 — 클로저부터 functools.wraps까지, 데코레이터의 동작 원리를 바닥부터 이해한다."
place: engineers-guild
date: 2026-07-09
tags: [python, decorator]
---

데코레이터는 마법이 아니다. 길드의 신조대로 — 우리는 동작하는 것을 믿는다.
`@decorator`는 단지 아래 문법의 설탕일 뿐이다.

```python
@log_call
def greet(name):
    return f"Hello, {name}!"

# 위 코드는 정확히 아래와 같다
def greet(name):
    return f"Hello, {name}!"

greet = log_call(greet)
```

즉 데코레이터는 **함수를 받아 함수를 돌려주는 함수**다. 호출 흐름을 그림으로 보면:

```
호출자 ──▶ wrapper()               ← 데코레이터가 돌려준 함수
              │  (앞처리: 로그 등)
              ▼
           greet()                 ← 원래 함수
              │
              ▼
           wrapper가 결과를 받아 반환
```

가장 단순한 구현은 이렇다.

```python
import functools

def log_call(func):
    @functools.wraps(func)          # 원본의 이름과 docstring을 보존한다
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"done: {func.__name__}")
        return result
    return wrapper
```

핵심은 두 가지다.

1. **클로저** — `wrapper`는 자신이 정의된 시점의 `func`를 기억한다. 데코레이터가 반환된 뒤에도 원본 함수에 접근할 수 있는 이유다.
2. **`functools.wraps`** — 이것을 빼먹으면 `greet.__name__`이 `"wrapper"`가 된다. 디버깅과 문서화가 전부 망가지므로, 습관처럼 붙이자.

---

다음 기록에서는 인자를 받는 데코레이터(`@retry(times=3)`)가 왜 3중 함수가 되는지 다룰 예정이다.
