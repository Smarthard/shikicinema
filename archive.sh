shopt -s nocasematch;

mkdir -p releases
mkdir -p dev-builds
version=""

archive() {
    version=$(grep \"version < bin/manifest.json | cut -d\" -f4)
    path="${1:-releases}/shikicinema-$version.zip"

    [[ -e "${path}" ]] && rm "${path}" && echo "${path} removed"
    cd bin/ && zip -r -9 "../${path}" -- * && cd ..
}

case "$1" in
    --dev)
        npm run bundle && archive dev-builds ;;
    --prod)
        npm run bundle && archive ;;
    --both|*)
        npm run bundle && archive dev-builds && npm run release && archive ;;
esac

echo && echo "**** generating sources archive ****" & echo

zip -r -9 "./shikicinema-src-$version.zip" \
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
    -- *
