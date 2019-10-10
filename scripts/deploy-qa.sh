# 배포 스크립트
APP_NAME=guhada-mobile-qa
HOST=52.78.149.242
USER=ec2-user
REPOSITORY=git@github.com:temcolabs/guhada_mobile.git
BRANCH=release
DEST_REPO=/home/ec2-user/guhada_mobile

# 서버 접속 후 테스트 앱 시작
ssh -i ~/.ssh/guhada.pem $USER@$HOST "cd $DEST_REPO && git checkout $BRANCH && git reset --hard $BRANCH && git pull && npm install && npm run build && pm2 reload ecosystem.config.js --only $APP_NAME --env production"
