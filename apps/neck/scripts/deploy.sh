#!/bin/bash

EFL_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../../..

cd $EFL_DIR
npx nx run neck:build:production
rm -rf deployment/neck/docs
cp -r dist/apps/neck deployment/neck/docs
cd deployment/neck
git add --all
git commit -m "Deploying: see eflynch/efl for meaningful versioning"
git push origin master

