# 배포 스크립트
APP_NAME=guhada-mobile-prod
HOST1=mobile
HOST2=mobile2
USER=ec2-user
REPOSITORY=git@github.com:temcolabs/guhada_mobile.git
BRANCH=master
DEST_REPO=/home/guhada/web/guhada_mobile

echo "> git pull && build app"
cd $DEST_REPO && git reset --hard && git remote update --prune && git checkout $BRANCH && git pull && rm -rf .next && npm install && npm run build

HOST=$HOST1 ./scripts/deploy-prod-upload.sh
# HOST=$HOST1 ./scripts/deploy-prod-upload.sh & HOST=$HOST2 ./scripts/deploy-prod-upload.sh
