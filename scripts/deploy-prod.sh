# 배포 스크립트
APP_NAME=guhada-mobile-prod
HOST=mobile
USER=ec2-user
REPOSITORY=git@github.com:temcolabs/guhada_mobile.git
BRANCH=master
DEST_REPO=/home/guhada/web/guhada_mobile

echo "[git pull && build app]"
cd $DEST_REPO && git remote update --prune && git checkout $BRANCH && git reset --hard $BRANCH && git pull && rm -rf .next && npm install && npm run build

HOST=$HOST ./scripts/deploy-prod-upload.sh

# 로드 밸런싱을 사용한다면 동시 배포
# HOST=$HOST1 ./scripts/deploy-prod-upload.sh & HOST=$HOST2 ./scripts/deploy-prod-upload.sh

echo "> delete old build files from build server"
exit
sh $DEST_REPO/scripts/delete-old-builds.sh
