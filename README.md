# guhada_web_lib

웹과 모바일에서 사용할 공용 모듈 저장소.

구하다 웹과 모바일에 subtree로 추가해서 사용합니다.


## 설치

### 원격 브랜치 추가

```bash
git remote add remote-lib git@github.com:temcolabs/guhada_web_lib.git
```

### subtree로 추가

```bash
git subtree add --prefix childs/lib remote-lib master
```

## subtree로 추가된 저장소에서 직접 push, pull 하기

이 저장소를 subtree로 추가한 저장소(desktop web, mobile web 저장소. Parent로 지칭)에서 이 저장소에 있는 소스 파일을 수정한 후 원격에 반영할 수 있다. 그러기 위해서는 Parent에서 변경 사항을 커밋 후 Parent의 원격에 푸시가 완료된 상태여야 한다.

### Parent 저장소에서 변경사항 push

```bash
git subtree push --prefix childs/lib remote-lib master
```


### Parent 저장소에서 변경사항 pull

```bash
git subtree pull --prefix childs/lib remote-lib master
```

push.sh, pull.sh 스크립트를 사용하면 된다.
