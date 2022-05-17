const FETCH_RESOURCE_TIMEOUT = 3000;

function fetchWithTimeout(url, options, timeout = FETCH_RESOURCE_TIMEOUT) {
    return Promise.race([
        new Promise((resolve, reject) => fetch(url, options)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        ),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
    ]);
}

module.exports = {
    FETCH_RESOURCE_TIMEOUT,
    fetch: fetchWithTimeout
};
