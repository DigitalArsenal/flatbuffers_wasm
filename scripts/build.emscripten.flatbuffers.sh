#!/bin/sh
export PATH=$PATH:/home/tj/software/emsdk/upstream/emscripten/
cd ./packages/flatbuffers
git clean -fxd
git reset HEAD --hard
git checkout v2.0.5
sed -i "s/#ifdef FLATBUFFERS_NO_ABSOLUTE_PATH_RESOLUTION/#if 1/" src/util.cpp
sed -i "s/mkdir.*;/return;/" src/util.cpp
sed -i "s/if (binary) {/if (false) {/" src/util.cpp
sed -i "s/if (DirExists(name)) return false;//" src/util.cpp
emcmake cmake . -DFLATBUFFERS_NO_ABSOLUTE_PATH_RESOLUTION=ON -DFLATBUFFERS_BUILD_LEGACY=OFF -DFLATBUFFERS_BUILD_SHAREDLIB=OFF -DCMAKE_CXX_EXTENSIONS=OFF -DCMAKE_CXX_FLAGS="-v -g -Qunused-arguments -fno-exceptions"
emmake make -j 4
cp flatc.wasm ../../src/flatc.wasm
cp flathash.wasm ../../src/flathash.wasm
