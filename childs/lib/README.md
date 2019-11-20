# guhada_web_lib

웹과 모바일에서 사용할 공용 모듈 저장소(repository). 구하다 웹과 모바일에 [Git subtree](https://www.atlassian.com/git/tutorials/git-subtree)로 추가해서 사용한다.

## 설치

### 원격 저장소 추가

원격 저장소의 이름은 `remote-lib`을 사용한다.

```bash
git remote add remote-lib git@github.com:temcolabs/guhada_web_lib.git
```

### Git subtree로 추가

`master` 브랜치를 subtree로 등록한다. `child/lib`은 상위 저장소(데스크탑 웹, 모바일 웹 저장소)에서 이 저장소가 추가될 위치가 된다.

```bash
git subtree add --prefix childs/lib remote-lib master
```

## subtree로 추가된 저장소에서 직접 push, pull 하기

Git subtree로 추가하면 상위 저장소에서 subtree 소스의 변경 사항의 subtree의 원격 저장소에 바로 반영할 수 있다. 그러기 위해서는 상위 저장소의 소스가 커밋, 푸시된 상태여야 한다.

### 상위 저장소에서 변경사항 push

상위 브랜치에서 subtree의 원격에 직접 푸시할 때는 최초에 subtree를 추가할 때 지정한 브랜치에서만 해야 한다. 그렇지 않으면 아래와 같은 상황이 발생해서 문제가 생길 수 있다.

- develop 브랜치에서 subtree 소스를 수정한 후 푸시한다.
- master를 수정할 상황이 생겼다. subtree의 원격에 새로운 커밋이 추가된 것을 보고 subtree를 pull 받는다.
- 그런데 내려받은 subtree의 소스를 develop 브랜치에서 사용했을 때는 문제가 없지만, master 브랜치에서 사용했을 때 문제가 발생할 수 있다는 것을 미처 파악하지 못했다.
- 테스트를 충분히 하지 않은 상황에서 master 핫픽스 후 다시 배포를 한다.
- 어떤 사용자에게서 앱에 문제가 생겼다는 리포트가 들어온다.

subtree로 추가한 소스는 상위 저장소의 랜치가 바뀔때 거기에 맞춰 바뀌게 할 수 없다. 결국 subtree로 추가한 소스는 npm 모듈을 사용하듯이 외부 라이브러리라고 생각하고 사용해야 한다.


### pull, push를 할 브랜치

push는 모든 브랜치에서 자유롭게, 대신 pull은 master 브랜치를 제외한 모든 브랜치에서 가능하다. develop 브랜치에서 push한 커밋을 master에서 pull 하면 문제가 생길 수 있기 때문이다. master에 병합되는 모든 변경 사항은 release 브랜치를 거쳐 테스트가 진행된 상태야야 한다.

### 상위 저장소에서 변경사항 pull

subtree의 pull은 어떤 브랜치에서 하더라도 상관없다.

```bash
git subtree pull --prefix childs/lib remote-lib master
```

이 저장소에서는 최상위 폴더에 있는 push.sh, pull.sh 스크립트를 사용하면 된다.
