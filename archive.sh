#!/bin/bash

shopt -s nocasematch;

mkdir -p releases
mkdir -p dev-builds
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

zip -qr -9 "./shikicinema-src-$version.zip" \
    -x node_modules/\* \
    -x bin/\* \
    -x dev-builds/\* \
    -x releases/\* \
    -x screenshots/\* \
    -x "src/ui/node_modules/*" \
    -x "src/ui/dist/*" \
    -x videos.csv \
    -x archive.sh \
    -x shikicinema-src* \
    -- * && \
    msg "sources archive generated"
