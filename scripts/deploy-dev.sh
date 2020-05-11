# 배포 스크립트
APP_NAME=guhada-mobile-dev
# HOST=13.125.71.189
HOST=52.79.247.89
USER=ec2-user
REPOSITORY=git@github.com:temcolabs/guhada_mobile.git
BRANCH=release
DEST_REPO=/home/ec2-user/guhada_mobile
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

RELEASE_VERSION=$(echo "release/${PACKAGE_VERSION}" | tr -d ' ')
WINDOW_RELEASE_VERSION="release/v1.27.0"
if [ $RELEASE_VERSION = "release/" ]
then
  RELEASE_VERSION=${WINDOW_RELEASE_VERSION}
fi

echo $RELEASE_VERSION
# 서버 접속 후 테스트 앱 시작
ssh -i ~/.ssh/guhada.pem $USER@$HOST "cd $DEST_REPO && git reset --hard && git remote update --prune && git checkout $RELEASE_VERSION && git pull && npm install && npm run build && pm2 flush && pm2 reload ecosystem.config.js --only $APP_NAME --env production && ./scripts/delete-old-builds.sh && ./scripts/etc/createRobotsDisallowed.sh"

