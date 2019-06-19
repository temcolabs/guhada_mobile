APP_NAME=guhada-web-qa
HOST=13.125.197.112
USER=ec2-user
# REPOSITORY=git@github.com:temcolabs/guhada_web.git
# DEST_REPO=/home/ec2-user/guhada_web
# DEST_APP=/home/ec2-user/guhada_web/marketplatform_web

# 서버 접속 후 테스트 앱 시작
ssh -i ~/.ssh/guhada.pem $USER@$HOST "cd $DEST_REPO && git reset --hard release && git checkout release && git pull && cd $DEST_APP && rm -rf node_modules/.cache && npm install && npm run build && pm2 reload ecosystem.config.js --only $APP_NAME --env production"
