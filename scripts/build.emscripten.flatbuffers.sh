#!/bin/sh
STR=v22.10.26
export PATH=$PATH:/home/tj/software/emsdk/upstream/emscripten/
cd ./packages/flatbuffers
git clean -fxd
git reset HEAD --hard
git checkout $STR
sed -i "s/#ifdef FLATBUFFERS_NO_ABSOLUTE_PATH_RESOLUTION/#if 1/" src/util.cpp
sed -i "s/if.*kKeep)//" src/util.cpp
sed -i "s/\"read_/\"read/" src/idl_gen_ts.cpp
sed -i "s/mkdir.*;/return;/" src/util.cpp
sed -i "s/if (binary) {/if (false) {/" src/util.cpp
sed -i "s/if (DirExists(name)) return false;//" src/util.cpp
#sed -i "s/\.js//" src/idl_gen_ts.cpp
sed -i "s/!IsLowerSnakeCase(name)/false/" src/idl_parser.cpp
cp ../../scripts/replacements/idl_gen_python.cpp src/idl_gen_python.cpp
#cp ../../scripts/replacements/bfbs_gen.h src/bfbs_gen.h
emcmake cmake . -DFLATBUFFERS_NO_ABSOLUTE_PATH_RESOLUTION=ON -DFLATBUFFERS_BUILD_LEGACY=OFF -DFLATBUFFERS_BUILD_SHAREDLIB=OFF -DCMAKE_CXX_EXTENSIONS=OFF -DCMAKE_CXX_FLAGS="-v -g -Qunused-arguments -fno-exceptions -Os -s MODULARIZE=1 -s SINGLE_FILE=1 -s FORCE_FILESYSTEM=1"
sed -i "s/.DELETE_ON_ERROR://" CMakeFiles/flatc.dir/build.make
emmake make -j 4
sed -i "s/function callMain(args) {/Module.callMain = Module.main = function callMain(args) {/" flatc.js
sed -i "s/var FS =/var FS = Module.FS = /" flatc.js
sed -i "s/require(.*)/{}/" flatc.js
sed -i "s/__dirname//" flatc.js
cp flatc.js ../../dist/flatc.cjs
