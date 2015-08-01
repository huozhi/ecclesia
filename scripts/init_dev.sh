#!/bin/bash

npm_install()
{
  echo "npm install..."
  npm install
}

bower_install()
{
  echo "bower install..."
  bower install
}

init_env()
{
  cd ../
  npm_install
  cd ./public/
  bower_install
}

STATUS=0
if ! command -v node 1>/dev/null 2>&1; then
    echo "node: node is not installed." 1>&2
    STATUS=$((STATUS+1))
fi

if ! command -v bower 1>/dev/null 2>&1; then
    echo "bower: bower is not installed." 1>&2
    STATUS=$((STATUS+1))
fi

if [ "${STATUS}" == "0" ]; then
  echo -e "\033[0;32mEnv check ok! Init env start!\033[0m"
else
{ echo -e "\033[0;31m\033[0m"
  echo -e "\033[0;31mProblem(s) detected while checking system.\033[0m"
  echo -e "status ${STATUS}"
} 1>&2
  exit "${STATUS}"
fi

init_env

echo "init dev env Done!"
