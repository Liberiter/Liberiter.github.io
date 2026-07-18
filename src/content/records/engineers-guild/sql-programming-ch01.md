---
title: "SQL 첫 접속 — 컨테이너 psql과 결과·오류 읽기"
description: "docker로 PostgreSQL 18 컨테이너를 세우고 psql에 접속해, SQL 한 문장이 결과나 오류로 돌아오는 왕복을 처음부터 따라간다. 환경 설치(OrbStack·Docker Desktop)부터 오류 메시지 읽기까지."
place: engineers-guild
date: 2026-07-18
tags: [sql, postgresql, docker, psql]
series: sql-programming
seriesTitle: "SQL — 복붙하는 주문에서 표를 세워 질문하는 사람으로"
seriesOrder: 1
seriesDescription: "터미널 명령을 실행할 줄 알고 표(행과 열) 개념이 있는 독자가 SQL을 처음부터 설계로 배우는 시리즈."
draft: false
---

_본문 3.5시간 + 문제 1.0시간 · 난이도 2/5_

> **이 장의 질문** — SQL 한 문장은 어떤 절차로 컨테이너 안 데이터베이스에 도달해 결과나 오류로 돌아오는가?

**이 장을 마치면 할 수 있는 것**

- docker로 postgres:18을 기동하고 ps -a·logs로 준비 완료와 기동 실패(Exited·소켓)를 판별·복구한다
- docker exec로 psql에 접속해 SELECT 한 줄을 실행하고 결과 테이블을 읽는다
- 세미콜론 유무에 따른 실행·대기(->) 프롬프트 차이를 재현한다
- 코스 규약(ENCODING UTF8 LOCALE C)대로 실습 DB를 생성하고 \c 또는 -d로 재접속한다
- 오류 메시지의 위치·코드 표시를 읽고 오타를 스스로 교정한다

샛별 역참(驛站)은 길이 갈리는 자리에 선 가공의 역참이다. 오가는 여행자를 등록부에 한 줄씩 적고, 그들이 맡는 의뢰를 따로 장부에 매긴다. 이 코스가 끝날 무렵 그 등록부와 장부는 표 두 개가 되고, 우리는 표에 질문을 던져 혼자 답을 얻는다. 그런데 표를 세우기 전에 표가 살 건물부터 있어야 한다. 이 장은 그 건물을 짓고, 안에 난 창구 하나에 들어가, 첫 질문을 건네고 돌아오는 대답을 읽는 데까지다.

건물은 컨테이너다. 창구는 psql이고, 창구에 건네는 청구서 한 장이 SQL 문장 하나다. 청구서를 밀어 넣으면 창구 너머에서 처리돼 결과를 담은 사본 한 장이 되돌아오거나, 어디가 틀렸는지 짚은 반려 쪽지가 되돌아온다. 이 왕복의 절차를 처음부터 끝까지 따라가는 것이 이 장의 등뼈다.

**시작 전 점검.** 터미널을 열고 명령 한 줄을 실행해 본 적이 있는가? 디렉터리를 옮기고(`cd`) 출력을 눈으로 읽는 정도면 된다.

<details>
<summary>답 확인</summary>

경험이 없다면 OS 기본 터미널(macOS는 터미널 앱, Windows는 Windows Terminal)을 열어 `cd`와 `ls`를 몇 번 쳐 보고 시작하는 편이 좋다. 이 장의 설치와 실습이 전부 터미널에서 진행된다.

</details>

**시작 전 점검.** "데이터베이스"라는 말에서 무엇이 떠오르는가? SQL을 한 줄도 써 본 적 없어도 좋다. 표(행과 열)라는 이미지 하나면 이 장을 따라오는 데 충분하다.

<details>
<summary>답 확인</summary>

행과 열로 짜인 표, 그리고 그 표에 질문을 던져 원하는 줄만 꺼내는 도구 — 이 정도 그림이면 된다. 표를 실제로 만드는 일은 다음 장이고, 이 장은 그 표가 살 자리를 마련하고 창구에 들어가는 데까지다. 프로그래밍 언어 경험이나 서버 운영 지식은 필요 없다.

</details>

## 1.1 건물을 세우다 — 컨테이너를 띄우다

컨테이너(container)라는 말부터 풀어야 한다. 컨테이너는 격리된 리눅스 프로세스 하나다. 내 노트북 안에서 돌지만, 자기만의 파일 시스템과 자기만의 프로그램을 담은 채 바깥과 분리돼 있다. 그 안을 무엇으로 채울지는 이미지(image)가 정한다. 이미지는 컨테이너를 찍어내는 틀이다 — `postgres:18`이라는 틀에는 PostgreSQL 서버와 psql 클라이언트가 함께 들어 있다. 틀을 한 번 찍으면 서버가 도는 건물 하나가 선다.

건물을 컨테이너 안에 두는 이유는 하나다. macOS든 Windows든, 안에서 도는 것은 똑같은 리눅스 이미지다. 호스트에 PostgreSQL을 직접 깔면 OS마다 버전도 로캘도 갈라지지만, 같은 이미지를 띄우면 양쪽이 글자 하나까지 같은 명령에 같은 출력을 낸다. 그래서 이 코스의 실습 표면은 오직 컨테이너 안 psql이다.

설치는 두 층이다 — 컨테이너를 돌릴 런타임을 먼저 깔고, 그 위에 postgres 이미지를 내려받는다. 런타임 채널만 OS별로 갈라지고, 그 위는 동일하다.

**macOS** — 런타임은 OrbStack이다(docker CLI·엔진을 동봉하므로 docker를 따로 깔지 않는다). 설치 채널인 Homebrew가 선행 설치물이다. `brew` 명령이 없다면 brew.sh의 설치 명령 한 줄부터 실행한다(Command Line Tools 설치와 셸 프로필 반영까지 안내가 따라온다). 그다음:

```console
brew install --cask orbstack
```

설치 후 OrbStack 앱을 한 번 연다. 이때 docker 명령과 소켓을 배선하는 초기 설정이 도는데, 관리자 승인을 권장한다. 승인 여부와 무관하게 **새 터미널**을 열어야 docker가 인식된다. 예전에 Docker Desktop이나 colima를 쓴 이력이 있는 머신이라면 docker가 다른 엔진을 가리킬 수 있으니 `docker context ls`로 확인하고 필요하면 `docker context use orbstack`으로 맞춘다. OrbStack은 macOS 14 이상을 요구한다.

**Windows 11** — 런타임은 Docker Desktop이고, 채널은 winget이다. 설치 전 `winget --version`으로 winget부터 확인한다(깨끗한 머신에서는 첫 로그인 직후 잠깐 인식되지 않을 수 있다). Docker Desktop의 기본 백엔드가 WSL 2라, WSL 2가 먼저 서 있어야 한다. WSL이 없으면 관리자 PowerShell에서 `wsl --install` 후 재부팅하고, 이미 있으면 `wsl --update`로 최신화한다. 그다음:

```console
winget install --id Docker.DockerDesktop -e
```

설치 중 UAC 승인 프롬프트가 뜬다. winget 채널은 서비스 약관이 설치 시점에 묵시 수락되므로, 설치가 곧 약관 동의라는 점을 유의한다. 첫 실행 때 뜨는 로그인·설문 화면은 계정 없이 건너뛸 수 있다(로그인은 권장 사항일 뿐이다). 다만 Docker Desktop은 앱이 켜져 있어야 엔진이 산다 — 부팅 시 자동 시작을 켜 두면 편하다. 하드웨어는 가상화가 활성이어야 하고(BIOS/UEFI), 실습 셸은 PowerShell(Windows Terminal)이다.

**양 OS 공통** — 런타임이 서면 postgres 이미지를 내려받는다. 첫 내려받기는 약 700MB라 회선에 따라 몇 분 걸린다(한 번뿐, 이후 캐시). 런타임이 정상인지는 느낌이 아니라 명령이 판정한다.

```console
docker version
```

출력의 Server 절에 런타임 라인이 보이면 클라이언트와 엔진이 함께 살아 있다는 뜻이다. Server 절이 비면 앱(OrbStack·Docker Desktop)이 아직 안 떴다는 신호다.

런타임이 살아 있으면 틀로 건물을 찍는다. 코스의 표준 기동 명령은 최초 한 번만 친다.

```console
docker run -d --name sql-lab -e POSTGRES_PASSWORD=postgres -v sql-lab-data:/var/lib/postgresql postgres:18
```

처음 실행하면 이미지가 아직 캐시에 없어 내려받기부터 돈다 — 진행 줄이 주르륵 흐른 뒤, 맨 끝에 긴 16진수 한 줄만 남는다.

```text
Unable to find image 'postgres:18' locally
18: Pulling from library/postgres
…
Status: Downloaded newer image for postgres:18
68e5da5dcac1b03ceba30ffbf1f63a31ed2a8bba0919d1ba2d08127e2c09fb3e
```

그 16진수가 방금 선 컨테이너의 ID다. 두 번째 기동부터는 이미지가 이미 있어 `Pulling` 줄 없이 ID 한 줄만 나온다.

플래그 하나하나가 건물의 설계다. `-d`는 컨테이너를 뒤에서 계속 돌게 한다(detached) — 창구를 열어 둔 채 백그라운드로 물러난다. `--name sql-lab`은 이름표다. 이후 접속·중지·재개가 모두 이 이름으로 건물을 가리킨다. `-e POSTGRES_PASSWORD=postgres`는 이미지가 요구하는 필수 환경 변수다(빠지면 기동을 거부한다). 이 값은 초기화 때 `postgres` 계정의 실제 비밀번호로 저장된다 — 컨테이너 내부 접속은 신뢰(trust) 인증이라 이 안에서 물어볼 일은 없지만, 바깥에서 접속하는 경로가 열리면 그때 쓰이는 값이다. 지금은 자리만 채워 두면 된다. `-v sql-lab-data:/var/lib/postgresql`가 데이터의 수명을 정한다 — `sql-lab-data`라는 명명 볼륨(named volume)을 데이터 디렉터리에 걸어, 데이터가 컨테이너 바깥 볼륨에 남는다. 그래서 컨테이너를 멈췄다 켜거나 지웠다 다시 찍어도 표와 행이 그대로다. 볼륨을 빼면 데이터가 컨테이너와 함께 사라진다. 맨 끝의 `postgres:18`은 찍어낼 틀 그 자체다.

`-d`로 물러났으니 건물이 제대로 섰는지는 눈으로 봐야 안다. 두 명령이 그 눈이다.

```console
docker ps -a
```

```text
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS         PORTS      NAMES
68e5da5dcac1   postgres:18   "docker-entrypoint.s…"   12 seconds ago   Up 11 seconds  5432/tcp   sql-lab
```

`docker ps -a`는 컨테이너 목록과 상태를 보여준다. 넓은 표에서 눈여겨볼 두 열은 맨 오른쪽의 `NAMES`(우리가 붙인 `sql-lab`)와 그 왼쪽의 `STATUS`다 — `Up …`이면 정상, `Exited (…)`면 기동에 실패한 상태다.

```console
docker logs sql-lab
```

```text
…
PostgreSQL init process complete; ready for start up.

2026-07-18 …UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2026-07-18 …UTC [1] LOG:  database system is ready to accept connections
```

`docker logs sql-lab`은 건물 안에서 서버가 남긴 기록이다. 초기화 로그가 길게 흐른 뒤 맨 끝에 `database system is ready to accept connections`가 찍혀 있으면 창구를 열 준비가 됐다는 뜻이다.

기동에는 함정 몇 개가 숨어 있다. 표식과 함께 외워 둔다.

- `-d`는 실패해도 성공처럼 보인다. 명령이 종료 코드 0으로 조용히 돌아오기 때문이다. 그래서 기동이 이상하면 `docker ps -a`부터 본다. `sql-lab`이 `Exited`면 실패다 — 원인은 `docker logs sql-lab`에 있다.
- 실패한 컨테이너를 그대로 두고 `docker run`을 다시 치면 이름 충돌(`Conflict`)이 난다. 먼저 `docker rm sql-lab`으로 실패한 컨테이너를 치운 뒤 다시 기동한다. 명명 볼륨 `sql-lab-data`는 이때도 남으니 데이터는 안전하다.
- 최초 기동 직후 1~2초는 서버가 아직 초기화 중이라, 바로 접속하면 소켓 에러(`/var/run/postgresql/.s.PGSQL.5432 ... No such file or directory`)가 날 수 있다. 초기화가 끝나기 전의 이 짧은 대기 시간(소켓 창)은 WSL 2 위에서, 또는 이미지를 막 내려받아 아직 준비가 덜 된 상태에서 더 길어진다. 로그에서 준비 완료 줄을 확인하고 접속하거나, 몇 초 뒤 다시 시도한다.
- (Windows) Git Bash의 MinTTY는 TTY를 주지 않아 뒤에 나올 `docker exec -it`가 막힐 수 있다. PowerShell을 쓴다. 한글 출력이 깨지면 그 터미널에서 `chcp 65001`로 코드페이지를 UTF-8로 맞춘다.

<details>
<summary>더 깊이 — 지금은 건너뛰어도 좋습니다</summary>

컨테이너를 더 깊이 다루는 일 — 이미지를 직접 빌드하고, 네트워크를 잇고, 여러 컨테이너를 오케스트레이션하는 것 — 은 이 코스 밖이다. Docker를 정면으로 다루는 별도 과목의 몫이다. 여기서는 공식 이미지 하나로 컨테이너 하나를 세워 그 안 psql에 들어가는, 딱 그만큼만 쓴다. 컨테이너는 배울 대상이 아니라 SQL을 실행할 수단이다.

</details>

**확인.** `docker run`을 쳤는데 아무 오류도 안 보였다. 그런데도 접속이 안 된다면, 기동 성공 여부를 가장 먼저 어떤 명령으로 확인하는가? 그 이유는?

<details>
<summary>답 확인</summary>

`docker ps -a`다. `-d`는 기동에 실패해도 종료 코드 0으로 성공처럼 돌아오기 때문에, 상태(`Up`인지 `Exited`인지)를 직접 봐야 진짜 결과를 안다. `Exited`면 `docker logs sql-lab`으로 원인을 읽는다.

</details>

*책을 덮고 — `docker run`의 네 플래그(`-d`, `--name`, `-e`, `-v`)가 각각 무엇을 정하는지, 그리고 볼륨을 뺐을 때 데이터에 무슨 일이 생기는지 떠올려 보라.*

## 1.2 창구 앞에서 — psql로 첫 질문

건물이 섰으니 창구로 들어간다. 창구가 컨테이너 psql(container psql), 곧 컨테이너 안에서 도는 psql 클라이언트다. 호스트에서 그 안으로 들어가는 명령은 `docker exec`다.

접속 명령은 한 줄로 끝난다. 양 OS에서 글자까지 같다.

```console
docker exec -it sql-lab psql -U postgres
```

`docker exec`가 도는 컨테이너 안에서 명령을 실행하고, `-it`가 그 명령에 대화형 단말을 붙인다. 실행할 명령이 `psql -U postgres` — postgres 사용자로 psql을 연다. 접속에 성공하면 프롬프트가 바뀐다.

```text
psql (18.4 (Debian 18.4-1.pgdg13+1))
Type "help" for help.

postgres=#
```

첫 줄 괄호 안의 숫자(`18.4`)는 그날의 패치 버전이라 책과 달라도 `18`로 시작하면 정상이다. `postgres=#`이 창구가 열렸다는 신호다. 앞의 `postgres`는 지금 붙어 있는 데이터베이스 이름이다. `-U postgres`만 주고 데이터베이스를 지정하지 않으면 사용자와 같은 이름의 기본 데이터베이스 `postgres`에 붙는다. 우리 실습 장부집은 아직 없으니, 지금은 이 기본 데이터베이스에 서 있다. 창구를 나올 때는 `\q`를 친다.

창구에 건네는 첫 청구서는 가장 단순한 SQL 문장(SQL statement) 하나다. SQL 문장은 데이터베이스에 보내는 완결된 명령 한 개다. 계산 한 줄을 던져 본다.

숫자 하나와 짧은 문자열을 나란히 골라 결과가 어떤 모양으로 돌아오는지 본다.
```sql
SELECT 'saetbyeol' AS station, 1 AS n;
```

실행 결과:

```text
  station  | n
-----------+---
 saetbyeol | 1
(1 row)
```

**핵심 —** `AS station`, `AS n`으로 붙인 이름이 그대로 열 머리글이 됐다. 이름을 안 붙였다면 psql은 `?column?` 같은 자리표시 머리글을 쓴다.

돌아온 것이 결과 테이블(result table)이다. 구조가 정해져 있다. 맨 위 한 줄이 열 머리글, 그 아래 하이픈 줄이 머리글과 데이터를 가르는 구분선, 다음 줄들이 실제 데이터 행, 그리고 맨 아래 `(1 row)`가 몇 행이 돌아왔는지 세어 준 요약이다. 이 `(N rows)` 한 줄이 앞으로 내내 "내가 기대한 만큼 골라졌는가"를 가늠하는 첫 잣대가 된다.

창구 너머 서버가 어떤 버전인지도 같은 방식으로 물을 수 있다. 값을 계산해 돌려주는 함수 `version()`을 고른다.

서버 자신이 보고하는 버전 문자열을 꺼낸다.
```sql
SELECT version();
```

실행 결과:

```text
…
 PostgreSQL 18.…, 64-bit
(1 row)
```

**핵심 —** 버전 문자열은 패치 번호까지 박혀 있어 18.4가 18.5가 되면 글자가 달라진다. 여기서 확인할 것은 딱 하나 — 앞머리가 `PostgreSQL 18`인가. 서버가 18 라인으로 살아 있으면 창구는 정상이다.

**확인.** 결과 테이블의 맨 아랫줄 `(1 row)`는 무엇을 알려주는가? 이 줄이 실무에서 왜 첫 점검 지점이 되는가?

<details>
<summary>답 확인</summary>

질의가 돌려준 행의 개수다. 조건을 걸어 골랐는데 기대와 다른 수가 나오면 — 이를테면 한 건을 예상했는데 0행이거나 수백 행이면 — 조건이 잘못됐다는 신호를 이 줄이 가장 먼저 준다.

</details>

*결과 테이블의 네 구성 요소 — 머리글, 구분선, 데이터 행, 행수 요약 — 을 화면 없이 순서대로 떠올려 보라.*

## 1.3 세미콜론이라는 마침표

창구는 청구서를 언제 처리할지 어떻게 알까? 여기에 초보가 가장 자주 걸리는 함정이 있다. 답은 엔터가 아니라 세미콜론이다. 세미콜론 종결자(semicolon terminator)가 "이 청구서는 여기서 끝"이라고 창구에 알리는 마침 신호다. 그 전까지 psql은 입력을 쿼리 버퍼에 쌓아 두기만 한다.

**예측.** 창구(`postgres=#`)에서 `SELECT 1`이라고만 치고 엔터를 누른다. 세미콜론은 아직 안 붙였다.

```text
postgres=# SELECT 1
```
결과 `1`이 바로 나올까, 아니면 다른 일이 벌어질까? 실행 전에 답을 적어 보라.

<details>
<summary>답 확인</summary>

결과는 안 나온다. 대신 프롬프트가 `postgres=#`에서 `postgres-#`으로 바뀐 채 멈춘다.
```text
postgres=# SELECT 1
postgres-#
```
셋째 자리의 글자가 `=`에서 `-`로 바뀐 것이 핵심이다. 이제 세미콜론을 붙여 주면 그제야 쌓인 버퍼가 실행된다.
```text
postgres-# ;
 ?column?
----------
        1
(1 row)

postgres=#
```

</details>

<details>
<summary>올바른 모델</summary>

많은 도구에서 엔터는 곧 실행이다. 그 습관이 "엔터를 눌렀는데 왜 안 되지"라는 착각을 만든다. psql의 모델은 다르다 — 엔터는 줄을 하나 더할 뿐이고, 실행을 여는 열쇠는 따로 있다. 세미콜론, 또는 `\g`. 프롬프트의 셋째 글자가 그 상태를 그대로 비춘다. `=`는 새 명령을 기다리고, `-`는 문장이 아직 안 끝나 이어질 줄을 기다린다. 프롬프트가 `-#`으로 멈춰 있으면 실행이 안 되는 게 아니라, 아직 안 끝났다고 알고 기다리는 것이다.

</details>

프롬프트가 이어짐 상태(`-#`)로 넘어가면 그다음 줄은 앞줄에 붙는다. 여러 줄로 나눠 써도 세미콜론이 나올 때까지는 한 문장이라는 뜻이다. 세미콜론 없이 다음 문장을 시작하면 어떻게 될까?

**예측.** `SELECT 1`을 세미콜론 없이 치고 엔터, 이어서 다음 줄에 `SELECT 2;`를 친다. 두 문장을 따로 실행한 셈이라고 생각하기 쉽다.

```text
postgres=# SELECT 1
postgres-# SELECT 2;
```
`1`과 `2`가 차례로 나올까?

<details>
<summary>답 확인</summary>

둘 다 안 나온다. 오류가 난다.
```text
postgres=# SELECT 1
postgres-# SELECT 2;
ERROR:  syntax error at or near "2"
LINE 2: SELECT 2;
               ^
```

</details>

<details>
<summary>올바른 모델</summary>

엔터가 실행이 아니라 버퍼 누적이라는 사실이 여기서 정면으로 드러난다. 첫 줄의 `SELECT 1`은 세미콜론이 없어 실행되지 않고 버퍼에 남았고, 다음 줄이 거기에 이어 붙어 버퍼는 `SELECT 1 SELECT 2`라는 한 덩어리가 됐다. 세미콜론을 만난 순간 그 덩어리 전체가 하나의 문장으로 실행되니, 파서는 `SELECT 1` 뒤에 난데없이 나온 `2`에서 걸려 넘어진다. 두 문장을 각각 실행하려면 각각을 세미콜론으로 끝맺어야 한다. 버퍼에 뭔가 잘못 쌓였을 때는 `\r`로 통째로 비운 뒤 다시 시작한다.

</details>

**확인.** 프롬프트가 `postgres-#`으로 바뀐 채 멈춰 있다. 지금 psql은 무슨 상태이고, 문장을 실행하려면 무엇을 쳐야 하는가?

<details>
<summary>답 확인</summary>

문장이 아직 세미콜론으로 끝나지 않아, 이어질 줄을 기다리며 입력을 버퍼에 쌓아 둔 상태다. 세미콜론(`;`)을 치고 엔터를 누르면 쌓인 버퍼가 실행된다. 잘못 쌓였다면 `\r`로 버퍼를 비운다.

</details>

*`=#`과 `-#` 두 프롬프트가 각각 무엇을 기다리는 상태인지, 그리고 둘을 가르는 글자가 몇째 자리인지 말해 보라.*

## 1.4 실습 장부집을 세우다 — saetbyeol

지금 붙어 있는 `postgres` 데이터베이스는 관리용 기본 장부집이다. 실습은 여기가 아니라 우리 손으로 세운 장부집에서 한다. 그 장부집을 만드는 문장이 데이터베이스 생성(CREATE DATABASE)이다. 코스는 규약을 하나 정해 두었다 — 인코딩은 UTF8, 정렬 기준(LOCALE)은 `C`, 템플릿은 `template0`.

`CREATE DATABASE`는 기본 장부집 `postgres`에 붙은 창구에서 친다. 앞 절을 이어 아직 psql 안에 서 있다면, 아래 접속 명령을 그대로 치기 전에 `\q`로 창구를 나온다 — psql 안에서 `docker` 같은 셸 명령을 치면 서버가 그것마저 SQL로 읽어 `ERROR: syntax error at or near "docker"`를 돌려준다(이 오류 자체가 §1.5의 좋은 예습이다).

```console
docker exec -it sql-lab psql -U postgres
```

```text
postgres=# CREATE DATABASE saetbyeol ENCODING 'UTF8' LOCALE 'C' TEMPLATE template0;
CREATE DATABASE
```

돌아온 `CREATE DATABASE`는 결과 테이블이 아니라, 명령이 성공했다는 상태 한 줄이다. SELECT는 표를 돌려주지만 이런 명령은 "했다"는 사실만 돌려준다. 규약의 세 요소는 저마다 이유가 있다. `ENCODING 'UTF8'`은 한글을 포함한 문자를 바이트로 저장하는 인코딩이다. `TEMPLATE template0`은 이 새 장부집을 어느 원본에서 복제할지 정한다 — 이름을 안 주면 기본 복제 원본 `template1`을 쓰는데, 그건 이미 클러스터 기본 locale(`en_US.utf8`)로 초기화된 복제본이라 locale을 바꿀 수 없다. 아무 locale도 박히지 않은 빈 원본 `template0`에서 떠 와야 그 위에 `LOCALE 'C'`가 성립한다. 규약의 핵심인 그 `LOCALE 'C'`는 텍스트를 사전순이 아니라 바이트(UTF-8 코드포인트) 순으로, OS와 무관하게 똑같이 정렬하게 만드는 설정이다. 지금은 그런 규약으로 장부집을 세운다는 것만 알아 두면 되고, 이 선택이 정렬에서 어떻게 드러나는지는 뒤 장들이 맡는다.

장부집을 만들었으니 그리로 창구를 옮긴다. 방법은 두 가지다. 창구 안에서라면 psql 메타명령(psql meta-command) `\c`를 쓴다. 메타명령은 SQL이 아니라 psql 자신에게 내리는 명령으로, 백슬래시로 시작한다 — 접속·목록·종료가 다 이쪽 명령이다.

```text
postgres=# \c saetbyeol
You are now connected to database "saetbyeol" as user "postgres".
saetbyeol=#
```

프롬프트가 `saetbyeol=#`으로 바뀌었다. 창구 자체를 새로 열 때는 접속 명령에 `-d saetbyeol`을 붙여 처음부터 이 장부로 들어가도 된다(`docker exec -it sql-lab psql -U postgres -d saetbyeol`). 어느 쪽이든 지금 어느 장부집에 서 있는지는 물어서 확인한다.

지금 붙어 있는 데이터베이스 이름을 서버에 직접 묻는다.
```sql
SELECT current_database();
```

실행 결과:

```text
 current_database
------------------
 saetbyeol
(1 row)
```

**핵심 —** 프롬프트의 `saetbyeol`과 이 결과가 일치하면 옳은 장부집에 서 있다는 이중 확인이다. 프롬프트의 이름은 접속이 끊기거나 `\c`가 실패해도 화면에 그대로 남아 실제 접속과 어긋날 여지가 있지만, `current_database()`는 서버가 직접 답한 사실이다.

새 장부집은 아직 비어 있다. 표 목록을 부르는 메타명령 `\dt`로 확인하면 그대로 드러난다.

```text
saetbyeol=# \dt
Did not find any tables.
```

표를 세우는 일은 다음 장이다. 이 장의 소관은 빈 장부집 `saetbyeol`을 규약대로 세워 그 앞에 서는 데까지다.

다음에 돌아와 이어갈 때, 설치도 기동도 다시 하지 않는다. 건물과 장부집은 그대로 남아 있다.

1. 런타임 앱(OrbStack·Docker Desktop)이 떠 있는지 본다. 떠 있어야 docker가 산다.
2. 컨테이너를 재개한다 — `docker start sql-lab`. `docker run`을 다시 치지 않는다(그건 새 건물을 또 짓는 명령이다). 재개 직후에도 잠깐 소켓 창이 있으니, 소켓 에러가 나면 몇 초 뒤 다시 접속한다.
3. 창구로 다시 들어간다 — `docker exec -it sql-lab psql -U postgres -d saetbyeol`.

명명 볼륨 `sql-lab-data` 덕분에 `saetbyeol` 장부집과 그 안에 넣어 둔 것이 세션을 넘어 그대로다. 앞 장에서 세운 표와 채운 행은 재개한 창구에서 곧바로 다시 보인다.

**확인.** 창구 안에서 이미 접속한 채로 다른 데이터베이스로 옮기려 한다. SQL 문장이 아니라 어떤 종류의 명령을 쓰며, 그 명령은 무엇으로 시작하는가?

<details>
<summary>답 확인</summary>

psql 메타명령을 쓴다 — `\c saetbyeol`처럼 백슬래시로 시작한다. 메타명령은 서버로 가는 SQL이 아니라 psql 클라이언트가 직접 해석하는 명령이라, 세미콜론도 필요 없다.

</details>

*빈 실습 장부집 `saetbyeol`을 만들고 그 앞에 서기까지의 단계를, `CREATE DATABASE`부터 재접속·확인까지 순서대로 되짚어 보라.*

## 1.5 반려 쪽지를 읽다 — 오류 메시지의 구조

창구는 잘못된 청구서를 말없이 버리지 않는다. 어디가 왜 틀렸는지 짚은 반려 쪽지를 돌려준다. 그 쪽지가 오류 메시지(error message)다. 초보에게 오류는 실패로 보이지만, 실은 교정에 필요한 정보를 다 담은 안내다. `SELECT`를 `SELCT`로 잘못 친 청구서를 일부러 밀어 넣어 본다.

```text
saetbyeol=# SELCT 1;
ERROR:  syntax error at or near "SELCT"
LINE 1: SELCT 1;
        ^
```

세 줄을 차례로 읽는다. 첫 줄 `ERROR: syntax error at or near "SELCT"`는 오류의 종류와, 어느 낱말 근처에서 걸렸는지다. 둘째 줄 `LINE 1: ...`은 문제의 줄을 그대로 다시 보여준다. 셋째 줄의 `^`가 결정적이다 — 캐럿이 가리키는 바로 그 자리가 파서가 걸려 넘어진 지점이다. 여기서는 `SELCT` 밑을 찍었으니, 오타를 `SELECT`로 고치면 청구서가 통과한다.

오류에는 사람이 읽는 문장 말고 기계가 쓰는 코드도 붙어 있다. 기본 화면에는 감춰져 있지만, `\set VERBOSITY verbose`로 창구를 자세히 말하게 하면 드러난다.

```text
saetbyeol=# \set VERBOSITY verbose
saetbyeol=# SELECT * FROM traveler;
ERROR:  42P01: relation "traveler" does not exist
LINE 1: SELECT * FROM traveler;
                      ^
LOCATION:  parserOpenTable, parse_relation.c:1466
```

`42P01`이 그 코드(SQLSTATE)다. 다섯 자리 코드는 오류를 한 종류로 못 박아 준다 — `42P01`은 "그런 이름의 테이블이 없다"는 뜻이고, 지금은 `traveler` 표를 아직 안 만들었으니 맞는 판정이다. 사람이 읽는 문장은 번역에 따라 달라져도 이 코드는 만국 공통이라, 낯선 오류를 만나면 코드로 검색하는 편이 빠르다. 맨 끝의 `LOCATION` 줄은 서버 소스 코드에서 이 오류가 난 내부 위치라, 서버를 고치는 개발자에게나 쓸모가 있지 지금은 무시해도 좋다.

**주의 —** 대화형 창구에서 문장 하나가 오류를 내도 세션이 끊기지는 않는다. 그 문장은 버려지고 프롬프트가 곧장 되돌아와, 다음 문장은 앞의 실패에 아무 영향 없이 새로 받는다. 그렇다고 오류를 못 본 척 넘겨도 되는 것은 아니다 — 창구에서는 눈앞의 그 한 줄을 그때그때 고쳐야 다음으로 나아간다. 순서는 늘 같다: 캐럿(`^`)이 가리키는 자리를 먼저 보고, 그 근처의 낱말을 의심한다. 문장을 통째로 다시 쓰기 전에, 쪽지가 이미 짚어 준 한 지점부터 고친다.

**확인.** 오류 메시지에서 문제의 정확한 위치를 짚어 주는 표식은 무엇이며, `42P01` 같은 다섯 자리 코드는 왜 유용한가?

<details>
<summary>답 확인</summary>

`LINE` 줄 아래의 캐럿(`^`)이 파서가 걸린 바로 그 자리를 가리킨다. `42P01` 같은 SQLSTATE 코드는 오류 종류를 언어와 무관하게 한 값으로 못 박아, 사람이 읽는 문장이 번역돼 있어도 코드로 정확히 검색하고 대조할 수 있게 해 준다.

</details>

*오타 하나가 든 청구서를 창구에 냈을 때 돌아오는 세 줄을, 각 줄이 무엇을 알려주는지와 함께 떠올려 보라.*

## 1.6 연습 — 손으로 확정하기

읽어서 아는 것과 손으로 확정한 것은 다른 지식이다. 창구(`docker exec -it sql-lab psql -U postgres -d saetbyeol`)를 열고 순서대로 진행하라. 막히면 해당 절로 돌아가되, 답을 보기 전에 반드시 한 번은 직접 쳐 본다.

**연습.** 창구에서 `SELECT 2 + 3 AS sum;`을 실행하라. 결과 테이블에서 값과 맨 아랫줄의 행수 요약을 각각 읽어라.

<details>
<summary>답 확인</summary>

값은 `5`, 아랫줄은 `(1 row)`. 열 머리글은 붙여 준 이름 `sum`이 된다. 계산식 하나도 한 행짜리 결과 테이블로 돌아온다.

</details>

**연습.** `SELECT 7`을 세미콜론 없이 치고 엔터를 눌러라. 프롬프트가 어떻게 바뀌는가? 그 상태에서 `\r`을 친 뒤, 다시 `SELECT 7;`로 실행을 마무리하라.

<details>
<summary>답 확인</summary>

프롬프트가 `saetbyeol=#`에서 `saetbyeol-#`으로 바뀌며 이어질 줄을 기다린다. `\r`은 쌓인 버퍼를 비워 프롬프트를 `=#`으로 되돌린다. 그다음 `SELECT 7;`을 온전히 치면 `7`이 담긴 결과 테이블이 돌아온다.

</details>

**연습.** 지금 어느 데이터베이스에 붙어 있는지를 프롬프트가 아니라 SQL로 확인하라.

<details>
<summary>답 확인</summary>

`SELECT current_database();`를 실행한다. `saetbyeol`이 돌아오면 실습 장부집에 옳게 서 있는 것이다. 프롬프트의 `saetbyeol=#`과 이 결과가 함께 맞으면 이중 확인이 된다.

</details>

**연습.** 일부러 `SELECT`를 `SELET`으로 잘못 쳐서 오류를 내라. 돌아온 세 줄에서 캐럿(`^`)이 가리키는 자리를 확인하고, 어디를 고쳐야 하는지 말하라.

<details>
<summary>답 확인</summary>

`ERROR: syntax error at or near "SELET"` 아래로 `LINE 1`과 캐럿이 뜨고, 캐럿은 `SELET` 밑을 가리킨다. 그 낱말을 `SELECT`로 고치면 통과한다. 캐럿이 짚은 자리가 곧 고칠 자리다.

</details>

**연습.** 메타명령 `\dt`로 지금 장부집에 표가 있는지 확인하라. 무엇이 돌아오며, 그 결과는 이 장의 소관과 어떻게 맞아떨어지는가?

<details>
<summary>답 확인</summary>

`Did not find any tables.`가 돌아온다. `saetbyeol`은 규약대로 세웠지만 아직 비어 있다 — 표를 만드는 일은 다음 장의 몫이라, 이 장 끝의 올바른 상태는 "빈 장부집"이다.

</details>

**직접 해보기.** 창구를 `\q`로 나온 뒤 컨테이너를 `docker stop sql-lab`으로 멈췄다가 `docker start sql-lab`으로 다시 켜라. 재개한 창구에 들어가 `SELECT version();`으로 서버 생존을 확인하고, `SELECT current_database();`로 `saetbyeol`이 그대로인지 확인하라.

<details>
<summary>답 확인</summary>

`docker start sql-lab` 직후 소켓 창이 잠깐 있을 수 있으니, 접속이 튕기면 몇 초 뒤 다시 시도한다. `docker exec -it sql-lab psql -U postgres -d saetbyeol`로 들어가 `version()`이 `PostgreSQL 18`로 시작하면 서버는 살아 있고, `current_database()`가 `saetbyeol`이면 명명 볼륨 덕에 장부집이 재개 뒤에도 남아 있다는 증거다.

</details>

**직접 해보기.** 기본 장부집 `postgres`에 붙은 상태(`docker exec -it sql-lab psql -U postgres`)에서 `CREATE DATABASE saetbyeol ENCODING 'UTF8' LOCALE 'C' TEMPLATE template0;`를 다시 실행하면 무엇이 돌아오는가? 예측한 뒤 실행해 확인하라.

<details>
<summary>답 확인</summary>

이미 있는 이름이라 오류가 돌아온다 — `ERROR: database "saetbyeol" already exists`. `CREATE DATABASE`는 없던 장부집을 새로 세우는 명령이라, 같은 이름을 두 번 세울 수는 없다. 재개할 때 장부집을 다시 만들 필요가 없는 이유이기도 하다.

</details>

**직접 해보기.** `\set VERBOSITY verbose`를 켠 뒤, 아직 없는 표를 골라 보라: `SELECT * FROM traveler;`. 돌아온 메시지에서 SQLSTATE 코드를 찾아 읽고, 그 코드가 왜 이 상황에 맞는 판정인지 설명하라.

<details>
<summary>답 확인</summary>

`ERROR: 42P01: relation "traveler" does not exist`가 돌아온다. `42P01`은 "그런 테이블이 없다"는 코드다. `traveler` 표는 다음 장에서야 만들므로, 지금 없다는 판정은 정확하다 — 오류가 곧 코드의 오류를 뜻하지는 않는다.

</details>

**직접 해보기.** 기동 실패를 일부러 만들고 손으로 복구하라. 진짜 `sql-lab`은 건드리지 말고, 필수 변수를 뺀 임시 컨테이너를 다른 이름으로 띄운다 — `docker run -d --name sql-lab-oops postgres:18`. 곧바로 `docker ps -a`로 `sql-lab-oops`의 상태를 확인하고, `docker logs sql-lab-oops`로 원인을 읽어라. 원인을 확인했으면 `docker rm sql-lab-oops`로 실패한 컨테이너를 치워 뒷정리까지 마친다. 이 세 걸음 — 상태 판별·원인 읽기·정리 — 이 기동이 어긋났을 때의 표준 복구 절차다.

<details>
<summary>답 확인</summary>

`docker ps -a`에 `sql-lab-oops`가 `Exited (1)`로 뜬다 — 기동에 실패했다는 뜻이다. `docker logs sql-lab-oops`를 읽으면 원인이 그대로 나온다: `Error: Database is uninitialized and superuser password is not specified.` — `-e POSTGRES_PASSWORD`를 빠뜨렸기 때문이다(이미지가 요구하는 필수 변수). `docker rm sql-lab-oops`로 실패한 컨테이너를 치우면 이름이 풀려 다음 기동에서 충돌하지 않는다. 실패한 이름으로 제대로 다시 세우려면 `docker rm` 뒤 `-e POSTGRES_PASSWORD=postgres`를 넣어 `docker run`을 다시 친다. 진짜 `sql-lab`은 내내 그대로 돌고 있었으니, 명명 볼륨 `sql-lab-data`에 담긴 `saetbyeol` 장부집도 무사하다.

</details>

**문제.** 동료가 창구에서 `SELECT count(*) FROM pg_database`라고 쳤는데 "실행이 안 된다"며 막혔다고 한다. 화면을 보니 프롬프트가 `saetbyeol-#`으로 멈춰 있다. 무엇이 문제인지 진단하고, 실행을 마치는 방법을 두 가지 제시하라.

<details>
<summary>답 확인</summary>

문장이 세미콜론으로 끝나지 않았을 뿐이다. `saetbyeol-#` 프롬프트는 psql이 문장을 아직 안 끝난 것으로 알고 이어질 줄을 기다리는 상태 — 실패가 아니라 대기다. 교정 하나: 이어서 `;`를 치고 엔터를 눌러 쌓인 버퍼를 실행한다. 교정 둘: 세미콜론 대신 `\g`를 쳐도 버퍼가 그대로 실행된다. (버퍼를 지우고 처음부터 다시 치고 싶다면 `\r`로 비운다.)

</details>

**문제.** `docker run`을 친 직후 곧바로 접속을 시도한 동료가 `/var/run/postgresql/.s.PGSQL.5432 ... No such file or directory` 소켓 에러를 받고 "기동이 실패했다"고 결론 냈다. 이 진단이 성급한 이유를 설명하고, 실제로 무엇을 봐야 하는지 절차로 답하라.

<details>
<summary>답 확인</summary>

소켓 에러는 기동 실패일 수도, 아직 초기화가 안 끝난 것일 수도 있어 그 자체로는 판정이 안 된다. 최초 기동 직후 1~2초는 서버가 초기화 중이라 소켓이 아직 없을 수 있다. 절차: 먼저 `docker ps -a`로 상태를 본다 — `Up`이면 초기화 대기이니 몇 초 뒤 재접속하고, `Exited`면 진짜 실패다. 실패라면 `docker logs sql-lab`으로 원인을 읽고, 재기동 전에 `docker rm sql-lab`으로 실패한 컨테이너를 치운다(볼륨 `sql-lab-data`는 남으니 데이터는 안전). `docker logs`에서 `database system is ready to accept connections`를 확인한 뒤 접속하는 것이 가장 확실하다.

</details>

**요약**

- 컨테이너는 격리된 리눅스 프로세스이고 이미지는 그 틀이다. `postgres:18` 하나를 `docker run -d --name sql-lab -e POSTGRES_PASSWORD=postgres -v sql-lab-data:/var/lib/postgresql`로 세우면, 양 OS가 같은 명령에 같은 출력을 낸다. 명명 볼륨이 데이터의 수명을 컨테이너 밖으로 늘린다.
- `-d`는 기동 실패도 성공처럼 보이게 한다. 진짜 상태는 `docker ps -a`로 보고, 원인은 `docker logs sql-lab`에서 읽는다 — 준비 완료의 표식은 `ready to accept connections`.
- 창구는 `docker exec -it sql-lab psql -U postgres`로 연다. SELECT는 머리글·구분선·데이터 행·`(N rows)` 요약으로 짜인 결과 테이블을 돌려준다.
- 엔터는 실행이 아니라 버퍼 누적이다. 실행을 여는 것은 세미콜론이고, 프롬프트의 셋째 글자(`=`/`-`)가 새 명령 대기와 미완 문장 대기를 가른다. 버퍼가 꼬이면 `\r`로 비운다.
- 실습 장부집은 `CREATE DATABASE saetbyeol ENCODING 'UTF8' LOCALE 'C' TEMPLATE template0;`로 세우고, `\c saetbyeol` 또는 `-d saetbyeol`로 재접속한다. `template0`에서 복제해야 `LOCALE 'C'`가 성립한다. `\dt`로 보면 아직 빈 장부집이다.
- 오류 메시지는 반려가 아니라 안내다. 캐럿(`^`)이 걸린 자리를 짚고, `\set VERBOSITY verbose`가 드러내는 SQLSTATE 코드가 오류를 만국 공통으로 못 박는다.

**빠른 참조**

```text
기동(최초 1회)  docker run -d --name sql-lab -e POSTGRES_PASSWORD=postgres \
                  -v sql-lab-data:/var/lib/postgresql postgres:18
상태·로그       docker ps -a                 # Up / Exited
                docker logs sql-lab          # ready to accept connections
중지·재개       docker stop sql-lab / docker start sql-lab
접속            docker exec -it sql-lab psql -U postgres -d saetbyeol
실습 DB 생성    CREATE DATABASE saetbyeol ENCODING 'UTF8' LOCALE 'C' TEMPLATE template0;
재접속(창구 안) \c saetbyeol
메타명령        \dt  (표 목록)   \r (버퍼 비우기)   \q (나가기)
문장 끝맺음     ;  또는  \g          # 엔터가 아니라 세미콜론이 실행한다
오류 자세히     \set VERBOSITY verbose       # SQLSTATE 코드까지 표시
```

**다음 장에서는**

빈 장부집은 아직 아무것도 담지 못한다. 다음 장의 질문은 "무엇을 담을 표인가" — 열 이름과 타입을 정해 여행자 등록부의 뼈대를 `CREATE TABLE`로 세운다. 그 자리에서 따옴표 없이 쓴 이름이 왜 소문자로 접혀 저장되는지, `varchar(n)`의 `n`이 성능이 아니라 무엇을 위한 것인지가 첫 함정으로 등장한다.

---

_이 장의 실행 예제는 Linux·macOS·Windows 11에서 실측 검증되었다._
