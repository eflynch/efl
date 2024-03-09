#!/bin/bash

EFL_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../../..

cd $EFL_DIR
npx nx run evanlyn.ch:build
./apps/evanlyn.ch/scripts/makenoscript.sh https://evanlyn.ch/
rsync -r dist/evanlyn.ch/* deployment/eflynch.github.io/
cd deployment/eflynch.github.io
git add --all
git commit -m "Deploying: see eflynch/efl for meaningful versioning"
git push origin master

