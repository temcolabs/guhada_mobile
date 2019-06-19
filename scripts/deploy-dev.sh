# 배포 스크립트
# 스크립트를 사용하기 위해서는 서버에서 origin/develop 브랜치를 트래킹하도록 설정해 두어야 한다.

APP_NAME=guhada-web-dev
HOST=13.125.124.143
USER=ec2-user
# REPOSITORY=git@github.com:temcolabs/guhada_web.git
# DEST_REPO=/home/ec2-user/guhada_web
# DEST_APP=/home/ec2-user/guhada_web/marketplatform_web

# 서버 접속 후 테스트 앱 시작
ssh -i ~/.ssh/guhada.pem $USER@$HOST "cd $DEST_REPO && git reset --hard develop && git checkout develop && git pull && cd $DEST_APP && rm -rf node_modules/.cache && npm install && npm run build && pm2 reload ecosystem.config.js --only $APP_NAME --env production"
