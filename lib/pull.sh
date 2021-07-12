BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" == "hotfix/widerplanet" ]; then
  echo 'master 브랜치에서는 pull 할 수 없습니다.';
  exit 1;
fi

git subtree pull --prefix lib remote-lib master
