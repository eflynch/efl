#!/usr/bin/env bash

EFL_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/../../..
cat $EFL_DIR/apps/evanlyn.ch/src/assets/trunk.mgl | $EFL_DIR/apps/evanlyn.ch/scripts/magnolia2html --out $EFL_DIR/dist/evanlyn.ch/ --base-href $1
