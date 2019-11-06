BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" != "master" ]; then
  echo 'master 브랜치에서만 푸시 가능합니다.';
  exit 1;
fi

git subtree push --prefix childs/lib remote-lib master
