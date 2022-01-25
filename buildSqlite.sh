#!/bin/sh

cd packages/sqlite
git reset HEAD --hard
git clean -fxd
wasiconfigure ./configure
make