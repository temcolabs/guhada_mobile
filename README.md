# guhada_web_lib

웹과 모바일에서 사용할 공용 모듈 저장소.

구하다 웹과 모바일에 subtree로 추가해서 사용합니다.


## 설치

### 원격 브랜치 추가

```bash
git remote add lib git@github.com:temcolabs/guhada_web_lib.git
```

### subtree로 추가


```bash
git subtree add --prefix childs/web_lib web_lib master
```

### Parent 저장소에서 변경사항 push

```bash
git subtree push --prefix childs/lib remote-lib master
```


### Parent 저장소에서 변경사항 pull

```bash
git subtree pull --prefix childs/lib remote-lib master
```

