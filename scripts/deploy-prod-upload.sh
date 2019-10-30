# 배포 스크립트
APP_NAME=guhada-mobile-prod
USER=ec2-user
REPOSITORY=git@github.com:temcolabs/guhada_mobile.git
BRANCH=master
DEST_REPO=/home/guhada/web/guhada_mobile
DEST_APP=/home/ec2-user/guhada_mobile

echo "\n[$HOST: upload files]"
rsync -arv -progress --delete -e "ssh -i ~/pem/guhada_prod.pem" --exclude-from './.rsyncignore' ./ $USER@$HOST:$DEST_APP

echo "\n[$HOST: install npm modules and restart pm2]"
ssh -i ~/pem/guhada_prod.pem $USER@$HOST "cd $DEST_APP && npm install && pm2 flush && pm2 reload ecosystem.config.js --only $APP_NAME --env production"