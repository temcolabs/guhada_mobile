# 배포 스크립트
APP_NAME=guhada-mobile-qa
HOST=52.78.149.242
USER=ec2-user
REPOSITORY=git@github.com:temcolabs/guhada_mobile.git
DEST_REPO=/home/ec2-user/guhada_mobile
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

RELEASE_VERSION=$(echo "release/${PACKAGE_VERSION}" | tr -d ' ')

echo $RELEASE_VERSION

# 서버 접속 후 테스트 앱 시작
ssh -i ~/.ssh/guhada.pem $USER@$HOST "cd $DEST_REPO && git remote update --prune && git checkout $RELEASE_VERSION && git reset --hard $RELEASE_VERSION && git pull && npm install && npm run build && pm2 flush && APP_NAME=$APP_NAME npm run reload-pm2 && ./scripts/delete-old-builds.sh"
