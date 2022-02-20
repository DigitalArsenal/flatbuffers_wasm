#!/bin/sh
export PATH=$PATH:~/.wasienv/bin/
cd ./packages/flatbuffers
git clean -fxd
git reset HEAD --hard
git checkout v2.0.5
sed -i "s/#ifdef FLATBUFFERS_NO_ABSOLUTE_PATH_RESOLUTION/#if 1/" src/util.cpp
sed -i "s/mkdir.*;/return;/" src/util.cpp
sed -i "s/if (binary) {/if (false) {/" src/util.cpp
sed -i "s/if (DirExists(name)) return false;//" src/util.cpp
#cp ../../scripts/replacements/idl_parser.cpp src/idl_parser.cpp
#cp ../../scripts/replacements/bfbs_gen.h src/bfbs_gen.h 
wasimake cmake . -DFLATBUFFERS_NO_ABSOLUTE_PATH_RESOLUTION=ON -DFLATBUFFERS_BUILD_LEGACY=OFF -DFLATBUFFERS_BUILD_SHAREDLIB=OFF -DCMAKE_CXX_EXTENSIONS=OFF -DCMAKE_CXX_FLAGS="-v -g -Qunused-arguments -fno-exceptions"
wasimake make -j 4
cp flatc.wasm ../../src/flatc.wasm
cp flathash.wasm ../../src/flathash.wasm
