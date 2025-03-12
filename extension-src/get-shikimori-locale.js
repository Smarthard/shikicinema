function getShikimoriLocale() {
    return document.querySelector('body')?.getAttribute('data-locale');
}

module.exports = {
    getShikimoriLocale
};
