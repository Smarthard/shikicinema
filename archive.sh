#!/bin/bash

shopt -s nocasematch;

mkdir -p releases
mkdir -p dev-builds
mkdir -p sources
version=""

msg() {
  echo && echo "**** ${1} ****"
}

archive() {
    version=$(jq -r '.version' < bin/manifest.json)
    path="${1:-releases}/shikicinema-$version.zip"

    [[ -e "${path}" ]] && \
    rm "${path}" && \
    msg "${path} removed"

    cd bin/ && \
    zip -qr -9 "../${path}" -- * && \
    cd .. && \
    msg "${path} generated"
}

case "$1" in
    --dev)
        npm run bundle && archive dev-builds ;;
    --prod)
        npm run release && archive ;;
    --both|*)
        npm run bundle && archive dev-builds && \
        npm run release && archive ;;
esac

[[ -e "sources/shikicinema-src-${version}.zip" ]] && rm "sources/shikicinema-src-${version}.zip"
zip -qr -9 "sources/shikicinema-src-$version.zip" \
    -x node_modules/\* \
    -x bin/\* \
    -x dev-builds/\* \
    -x releases/\* \
    -x screenshots/\* \
    -x sources/\* \
    -x "src/ui/node_modules/*" \
    -x "src/ui/dist/*" \
    -x videos.csv \
    -x archive.sh \
    -x shikicinema-src* \
    -- * && \
    msg "sources archive generated"
