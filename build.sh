#!/bin/sh

if [ "$1" == "release" ]; then
    VERSION=`grep -oP "const VERSION = \K[0-9]+" src/version.js`
    NEXT_VERSION=$((VERSION+1))
    echo "const VERSION = $NEXT_VERSION;" > src/version.js
fi

find src/ -name '*.js' -exec cat {} \; > dist/capital.js

if [ "$1" == "release" ]; then
    RELEASE_PATH="../stefan-brus.github.io"
    rm -rf $RELEASE_PATH/*
    cp index.html $RELEASE_PATH
    cp -r static $RELEASE_PATH
    cp -r dist $RELEASE_PATH
    cd $RELEASE_PATH && git add --all && git commit -m "Release version $NEXT_VERSION" && git push origin master
fi
