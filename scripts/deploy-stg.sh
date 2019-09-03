# 배포 스크립트
APP_NAME=guhada-mobile-stg
HOST=mobile
USER=ec2-user
REPOSITORY=git@github.com:temcolabs/guhada_mobile.git
BRANCH=master
DEST_REPO=/home/guhada/web/guhada_mobile
DEST_APP=/home/ec2-user/guhada_mobile

echo "[git pull && build app]"
cd $DEST_REPO && git checkout $BRANCH && git clean --f && git reset --hard && git pull && npm install && npm run build

echo "\n[upload files with rsync]"
rsync -arv -progress --delete -e "ssh -i ~/pem/guhada_stg.pem" --exclude-from './.rsyncignore' ./ $USER@$HOST:$DEST_APP

echo "\n[install npm modules and restart pm2 instance at server side]"
ssh -i ~/pem/guhada_stg.pem $USER@$HOST "cd $DEST_APP && npm install && pm2 reload ecosystem.config.js --only $APP_NAME --env production"