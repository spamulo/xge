cd dist-auto
zip -r $1.zip $1
rsync -avz --delete $1.zip webapp@tamg.org.uk:/var/www/qa.wearefreakgames.com/xge/
rsync -avz --delete $1 webapp@tamg.org.uk:/var/www/qa.wearefreakgames.com/xge/
