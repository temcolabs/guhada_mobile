# guhada_web_lib

웹과 모바일에서 사용할 공용 모듈 저장소(repository). 구하다 웹과 모바일에 [Git subtree](https://www.atlassian.com/git/tutorials/git-subtree)로 추가해서 사용한다.

## 설치

### 원격 저장소 추가

원격 저장소의 이름은 `remote-lib`을 사용한다.

```bash
git remote add remote-lib git@github.com:temcolabs/guhada_web_lib.git
```

### Git subtree로 추가

`master` 브랜치를 subtree로 등록한다. `lib`은 상위 저장소(데스크탑 웹, 모바일 웹 저장소)에서 이 저장소가 추가될 위치가 된다.

```bash
git subtree add --prefix lib remote-lib master
```

## subtree로 추가된 저장소에서 직접 push, pull 하기

Git subtree로 추가하면 상위 저장소에서 subtree 소스의 변경 사항의 subtree의 원격 저장소에 바로 반영할 수 있다. 그러기 위해서는 상위 저장소의 소스가 커밋, 푸시된 상태여야 한다.

### pull, push를 할 브랜치

push는 모든 브랜치에서 가능하다.

pull은 **master 브랜치를 제외한 모든 브랜치에서 가능**하다. develop 브랜치에서 push한 커밋을 master에서 pull 하면 문제가 생길 수 있기 때문이다. master에 병합되는 모든 변경 사항은 release 브랜치를 거쳐 테스트가 진행된 상태야야 한다.

### 상위 저장소에서 변경사항 pull

subtree의 pull은 어떤 브랜치에서 하더라도 상관없다.

```bash
git subtree pull --prefix lib remote-lib master
```

이 저장소에서는 최상위 폴더에 있는 push.sh, pull.sh 스크립트를 사용하면 된다.
