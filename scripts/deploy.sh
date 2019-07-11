#!/usr/bin/env bash

set -e

if [[ "false" != "$TRAVIS_PULL_REQUEST" ]]; then
	echo "Not deploying pull requests."
	exit
fi

if [[ "master" != "$TRAVIS_BRANCH" ]]; then
	echo "Not on the 'master' branch."
	exit
fi

# echo "Prepare for Update Rally"
# echo "- set variables"
# CURDIR=`pwd`
# echo ${CURDIR}
# US=`git log -1 | grep US`
# echo ${US}
# export TZ="Asia/Tokyo"
# DTSTR=`date "+%Y/%m/%d-%H:%M"`
# echo ${DTSTR}
# TXT="componentSampleJobSUCCESS!!!(${DTSTR})"
# echo ${TXT}
# ACT=2
# echo ${ACT}

echo "Create new .gitignore"
rm -rf .git
rm -r .gitignore

echo ".bowerrc
.editorconfig
.travis.yml
README.md
bin
bower.json
gulpfile.js
node_modules
package.json
tests
tmp" > .gitignore

export TZ="Asia/Tokyo"
DATESTR=`date +%Y%m%d-%H%M%S`
echo ${DATESTR}

cp -p ./.travis.yml.codedeploy dist/.travis.yml
cp -p ./appspec.yml dist/appspec.yml
mkdir dist/scripts
cp -rp ./scripts/ dist/
# cp -p ./scripts/repository.bat dist/scripts/repository.bat
# cp -p ./scripts/jobsuccess.sh dist/scripts/jobsuccess.sh
# cp -p ./scripts/jobfail2.sh dist/scripts/jobfail2.sh
# cp -p ./scripts/jobfail2.sh dist/scripts/jobfail2.sh
cd dist

echo ".bowerrc
.editorconfig
README.md
bin
node_modules
package.json
tmp" > .gitignore

# echo "" > ${US}

zip -r ec-site-app_${DATESTR}.zip ./ec-site-app/

git init
git config user.name ${USER_NAME}
git config user.email ${USER_EMAIL}
git branch
git add .
git commit --quiet -m "commiting by Travic CI"
# git commit --quiet -m "${US}"
git push --force --quiet "https://${GITHUB_TOKEN}@${GH_REF}" master:master

# echo "Update Rally"
# cd ${CURDIR}
# cd scripts/AgileAPIScript_Run
# chmod 555 ./agileApiObjectHandleBash.sh 
# ./agileApiObjectHandleBash.sh ${ACT} ${US} ${TXT}

# cd ${CURDIR}
# pwd