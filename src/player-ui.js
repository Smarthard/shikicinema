const SHIKIVIDEOS_API = 'https://smarthard.net/api/shikivideos';
const SHIKIMORI_CLIENT_ID = process.env.SHIKIMORI_CLIENT_ID;
const SHIKIMORI_CLIENT_SECRET = process.env.SHIKICINEMA_CLIENT_SECRET;

const videos_list_element = document.querySelector('#shikicinema-videos-list');
const video_iframe = document.querySelector('#shikicinema-video');

const kind_filter = document.querySelector('#shikicinema-videos-kind');
const author_filter = document.querySelector('#shikicinema-videos-author');
const quality_filter = document.querySelector('#shikicinema-videos-quality');
const episode_filter = document.querySelector('#shikicinema-videos-episode');

const prev_button = document.querySelector('#shikicinema-prev-button');
const next_button = document.querySelector('#shikicinema-next-button');
const watched_button = document.querySelector('#shikicinema-watched-button');
const upload_button = document.querySelector('#shikicinema-upload-button');
const watched_img = document.querySelector('#shikicinema-watched-img');
const watched_label = document.querySelector('#shikicinema-watched-label');
const check_new_video_button = document.querySelector('#shikicinema-check-button');

const upload_div = document.querySelector('#shikicinema-upload-div');
const upload_form = document.querySelector('#shikicinema-upload-form');

const upload_url = document.querySelector('#upload_url');

const notifier = document.querySelector('#shikicinema-notifier');

let current_video = {};

main();

async function main() {
    let query = new URLSearchParams(document.location.search);
    let title = query.get('title');
    let anime_id = query.get('anime_id');
    let max_episodes = await getAnimeLength(anime_id);
    let episode;
    let user_id = await shikimoriGetUserId();
    let videos = [];
    let synced = await shikimoriSynced();

    try {
        if (!query.get('episode')) {
            let anime_rate = await shikimoriGetAnimeRate(user_id, anime_id);
            let next_ep = anime_rate ? anime_rate.episodes + 1 : 1;

            if (next_ep > max_episodes.length) {
                episode = max_episodes.length;
            } else {
                episode = next_ep;
            }
        } else {
            episode = query.get('episode')
        }
    } catch (e) {
        episode = 1;
    }

    if (title) {
        let url = new URL(`${SHIKIVIDEOS_API}/search?title=${title}&episode=${episode}&limit=all`).toString();

        try {
            videos = new Set(await fetch(url).then(response => response.json()));
        } catch (err) {
            console.error(err);
            alert(`Не удалось загрузить список для аниме ${title}!`)
        }
    } else {
        console.error('Название аниме не указано');
    }

    document.title = `Shikicinema: ${title}`;
    try {
        episode_filter.value = parseInt(episode);
    } catch (err) {
        episode_filter.value = 1;
    }

    reloadVideos(videos);
    fillSelection(videos);
    await changeVideoToLastFav(title, await filterAnimesAuto(videos));

    if (synced) {
        console.log('sync ok');
        watched_label.innerText = 'Просмотрено';
        watched_img.src = 'assets/check_mark.png';
        await _watchedIndicate(user_id, anime_id, episode)
    } else console.log('no sync');

    kind_filter.addEventListener('change', async () => reloadVideos(await filterAnimesAuto(videos)));
    author_filter.addEventListener('change', async () => reloadVideos(await filterAnimesAuto(videos)));
    quality_filter.addEventListener('change', async () => reloadVideos(await filterAnimesAuto(videos)));
    episode_filter.addEventListener('input', async () => {
        console.log('typed');
        try {
            episode = episode_filter.value;
            videos = await findAllByTitle(title, episode);

            reloadVideos(videos);
            await changeVideoToLastFav(title, await filterAnimesAuto(videos));
            fillSelection(videos);
            await _watchedIndicate(user_id, anime_id, episode);
        } catch (err) {
            console.log(`Не удалось найти эпизод: ${episode_filter.value}`)
        }
    });
    prev_button.addEventListener('click', async () => {
        if (episode_filter.value > 1) {
            episode = --episode_filter.value;
            videos = await findAllByTitle(title, episode_filter.value);

            reloadVideos(videos);
            await changeVideoToLastFav(title, await filterAnimesAuto(videos));
            fillSelection(videos);
            await _watchedIndicate(user_id, anime_id, episode);
        }
    });
    next_button.addEventListener('click', async () => {
        let max_episodes = await getAnimeLength(anime_id);
        setStorageItem(title, current_video);

        if (episode_filter.value < max_episodes.length) {
            episode = ++episode_filter.value;
            videos = await findAllByTitle(title, episode_filter.value);

            reloadVideos(videos);
            fillSelection(videos);
            await changeVideoToLastFav(title, videos);
            await _watchedIndicate(user_id, anime_id, episode);
        }
    });
    upload_url.addEventListener('paste', (evt) => {
        let paste = (evt.clipboardData || window.clipboardData).getData('text');
        let url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
        let url = paste.match(url_regex)[0];

        if (url_regex.test(paste)) {
            upload_url.value = url;
        } else {
            upload_url.value = paste;
        }

        evt.preventDefault();
    });
    check_new_video_button.addEventListener('click', () => {
        try {
            if (upload_url.value) {
                video_iframe.src = upload_url.value;
            }
        } catch (err) {
            console.error(err);
        }
    });
    upload_button.addEventListener('click', () =>{
        if (user_id !== null) {
            chrome.runtime.sendMessage({videos_token: true});
            upload_div.style.display !== 'block'
                ? upload_div.style.display = 'block'
                : upload_div.style.display = 'none';
        } else {
            notify('Не синхронизировано с Шикимори', { type: 'error' });
        }
    });
    upload_form.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        let url = new URL('https://smarthard.net/api/shikivideos');
        let form_data = new FormData(upload_form);
        let title_eng = await getAnimeEnglishTitle(anime_id);

        form_data.forEach((k, v) => {
            switch (v) {
                case 'anime_id': k = anime_id; break;
                case 'anime_russian': k = title; break;
                case 'anime_english': k = title_eng; break;
                case 'uploader': k = user_id; break;
                default: break;
            }
            url.searchParams.append(v, k)
        });

        chrome.storage.local.get('token', (videos_token) => {
            let token = videos_token.token;
            if (token.access_token && Date.now() < new Date(token.expires)) {
                fetch(url.toString(), {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${token.access_token}`
                    },
                    credentials: 'include'
                }).then(async response => {
                    let res = await response;

                    if (res.ok) {
                        notify("Видео успешно добавлено", { type: 'ok' });
                    } else {
                        notify("Ошибка добавления\n(подробнее в консоли)", { type: 'error' });
                        console.error(await res.json());
                    }
                });
            } else {
                chrome.runtime.sendMessage({ videos_token: true });
                notify("Токен доступа заменен\nПопробуйте еще раз", { type: 'warning' });
            }
        });
    });
    watched_button.addEventListener('click', async () => {
        if (synced) {
            await shikimoriIncEpisode(anime_id)
                .then(async res => {
                    if (res.status === 200 || res.status === 201) {
                        notify('Просмотрено', {type: 'ok'});
                    }
                    else {
                        notify('Проблема при синхронизации\nподробности в консоли', {type: 'error'});
                        console.error(res);
                    }
                })
                .catch(err => console.error(err));
        } else {
            /* retry with refreshed token */
            await _shikimoriRefreshToken()
                .then(() => {
                    shikimoriIncEpisode(anime_id)
                        .then(async res => {
                            if (res.status === 200 || res.status === 201) {
                                notify('Просмотрено', {type: 'ok'});
                            }
                        });
                })
                .catch(() => {
                    _shikimoriGetToken()
                        .then(() => {
                            setTimeout(() => document.location.reload(), 700);
                        })
                        .catch(err => {
                            console.error(err);
                            notify('Не удалось синхронизироваться с Shikimori :(', { type: 'error' })
                        });
                });
        }
    });
    notifier.addEventListener('click', () => notifier.style.display = 'none');
}

function reloadVideos(new_videos) {
    while (videos_list_element.firstChild) {
        videos_list_element.removeChild(videos_list_element.firstChild);
    }

    changeVideo(new_videos[0]);
    new_videos.forEach(video => {
        let li = document.createElement('li');
        let a = document.createElement('a');

        let no_episode = video.episode;
        let title = video.anime_russian;
        let quality = video.quality && video.quality.toLocaleUpperCase() !== 'UNKNOWN'
            ? video.quality.toLocaleUpperCase()
            : '';
        let source = identifyVideoSrc(video.url);
        let kind = video.kind;
        let author = video.author;

        li.innerText = `#${no_episode} `;
        a.innerHTML = `${title} (${kind}: <span class="shc-author">${author || "неизвестно"}</span>, 
                            проигрыватель: <span class="shc-source">${source}</span>) ${quality}`;

        a.addEventListener('click', () => changeVideo(video));

        li.appendChild(a);
        videos_list_element.appendChild(li);
    })
}

function identifyVideoSrc(url) {
    let source;

    switch (true) {

        case /animedia/.test(url):
            source = 'Animedia';
            break;
        case /sibnet/.test(url):
            source = 'Sibnet';
            break;
        case /smotretanime/.test(url):
            source = 'SmotretAnime';
            break;
        case /sovetromanti/.test(url):
            source = 'SovetRomantica';
            break;
        case /mail.ru/.test(url):
            source = 'Mail.ru';
            break;
        case /mediafile/.test(url):
            source = 'MediaFile';
            break;
        case /ok.ru/.test(url):
            source = 'Одноклассники';
            break;
        case /vk.com/.test(url):
            source = 'Вкотакте';
            break;
        case /myvi/.test(url):
            source = 'Myvi';
            break;
        case /stormo/.test(url):
            source = 'Stromo';
            break;
        case /youtu/.test(url):
            source = 'YouTube';
            break;

        default:
            source = 'неизвестен';
    }

    return source;
}

function changeVideo(video) {
    try {
        let url = video.url;

        if (url.includes('http://')) {
            console.log(`Forcing https connection for ${url}`);

            url = url.replace('http:', 'https:');
        }

        current_video = video;
        video_iframe.src = url;
    } catch (err) {
        video_iframe.src = 'https://cloudanimator.reallusion.com/content/Images/video-not-found.jpg';
    }
}

function fillKindSelection(options) {
    let kinds = new Set(['Озвучка/Субтитры']);

    while (kind_filter.firstChild)
        kind_filter.removeChild(kind_filter.firstChild);

    options.forEach(option => {
        kinds.add(option.kind);
    });

    kinds.forEach(kind => {
        let opt = document.createElement('option');
        opt.value = kind;
        opt.innerHTML = kind;

        kind_filter.appendChild(opt);
    })
}

function fillAuthorSelection(options) {
    let authors = new Set();

    while (author_filter.firstChild)
        author_filter.removeChild(author_filter.firstChild);

    options.forEach(option => {
        if (!option.author || option.author === '' || option.author === 'unknown') {
            option.author = 'неизвестно';
            authors.add('неизвестно');
        } else {
            authors.add(option.author);
        }
    });

    authors = Array.from(authors).sort((a, b) => {
        let compare;

        try {
            compare = a.localeCompare(b)
        } catch (e) {
            compare = 0;
        }

        return compare;
    });
    authors.unshift('Студия');

    authors.forEach(author => {
        let opt = document.createElement('option');
        opt.value = author;
        opt.innerHTML = author;

        author_filter.appendChild(opt);
    })
}

function fillQualitySelection(options) {
    let qualities = new Set(['Качество']);

    while (quality_filter.firstChild)
        quality_filter.removeChild(quality_filter.firstChild);

    options.forEach(option => {
        qualities.add(option.quality !== '' ? option.quality : 'неизвестное');
    });

    qualities.forEach(qual => {
        let opt = document.createElement('option');
        opt.value = qual;
        opt.innerHTML = qual;

        quality_filter.appendChild(opt);
    })
}

function filterAnimesAuto(animes) {
    let filters = {
        episode: '',
        kind: '',
        author: '',
        quality: ''
    };

    try {
        filters.episode = parseInt(episode_filter.value);
        filters.kind = kind_filter.options[kind_filter.selectedIndex].value;
        filters.author = author_filter.options[author_filter.selectedIndex].value;
        filters.quality = quality_filter.options[quality_filter.selectedIndex].value;
    } catch (err) {
        console.warn('Невалидные фильтры');
        return animes;
    }

    return _filterAnimes(animes, filters);
}

async function _filterAnimes(animes, filters) {
    const episode = filters.episode;
    const kind = filters.kind;
    const author = filters.author;
    const quality = filters.quality;
    const url = filters.url;

    let filtered_animes = [...animes];

    if (episode) {
        filtered_animes = filtered_animes.filter(anime => {
            if (!isNaN(episode)) {
                return anime.episode === episode;
            } else {
                return true;
            }
        });
    }

    if (kind) {
        filtered_animes = filtered_animes.filter(anime => {
            if (kind !== 'Озвучка/Субтитры') {
                return anime.kind === kind;
            } else {
                return true;
            }
        });
    }

    if (author) {
        filtered_animes = filtered_animes.filter(anime => {
            if (author !== 'Студия') {
                return anime.author === author;
            } else {
                return true;
            }
        });
    }

    if (quality) {
        filtered_animes = filtered_animes.filter(anime => {
            if (quality !== 'Качество') {
                return anime.quality === quality;
            } else {
                return true;
            }
        });
    }

    if (url) {
        filtered_animes = filtered_animes.filter(anime => {
            let anime_src = identifyVideoSrc(anime.url);
            let match_src = identifyVideoSrc(url);

            return anime_src === match_src;
        });
    }

    return filtered_animes;
}

function getStorageItem(title) {
    return JSON.parse(window.localStorage.getItem(title));
}

function setStorageItem(title, item) {
    window.localStorage.setItem(title, JSON.stringify(item));
}

async function changeVideoToLastFav(title, options) {
    try {
        const video = getStorageItem(title);
        let available = options;

        if (video.author) {
            available = await _filterAnimes(available, {author: video.author});
        }

        if (video.url) {
            available = await _filterAnimes(available, {url: video.url});
        }

        if (video.kind) {
            available = await _filterAnimes(available, {kind: video.kind});
        }

        if (available.length > 0) {
            changeVideo(available[0]);
        } else throw new Error('не найдено рекомендованных источников')
    } catch (e) {
        console.warn(e);
        changeVideo(options[0]);
    }
}

function findAllByTitle(title, episode) {
    return fetch(`${SHIKIVIDEOS_API}/search?title=${title}&episode=${episode}&limit=all`)
        .then(response => response.json());
}

function getAnimeLength(anime_id) {
    return fetch(`${SHIKIVIDEOS_API}/${anime_id}/length`)
        .then(response => response.json());
}

function notify(msg, opt) {
    let type = 'shc-notify-ok';
    notifier.style.display = 'block';
    notifier.innerText = msg;

    if (opt.type) {
        switch (opt.type) {
            case 'error':       type = 'shc-notify-error';      break;
            case 'warning':     type = 'shc-notify-warning';    break;
            case 'ok':          type = 'shc-notify-ok';         break;
        }
    }

    notifier.classList.forEach(cls => notifier.classList.remove(cls));
    notifier.classList.add(type);
    setTimeout(() => {
        notifier.style.display = 'none';
    }, 5000)
}

async function _shikimoriGetToken() {
    return new Promise(async (resolve, reject) => {
        let auth_code = await _authorize();
        let token_url = new URL('https://shikimori.one/oauth/token');

        token_url.searchParams.set('grant_type', 'authorization_code');
        token_url.searchParams.set('client_id', SHIKIMORI_CLIENT_ID);
        token_url.searchParams.set('client_secret', SHIKIMORI_CLIENT_SECRET);
        token_url.searchParams.set('code', auth_code);
        token_url.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');

        fetch(token_url.toString(), {
            method: 'POST'
        })
            .then(async response => {
                let token = await response.json();

                await chrome.storage.sync.set({'shikimori_token': token});
                resolve(token);
            })
            .catch(err => reject(err));
    });
}

async function _shikimoriRefreshToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('shikimori_token', async storage_token => {
            let refresh_url = new URL('https://shikimori.one/oauth/token');

            if (!storage_token || !storage_token.refresh_token)
                reject(new Error('Refresh Token not found'));

            refresh_url.searchParams.set('grant_type', 'refresh_token');
            refresh_url.searchParams.set('client_id', SHIKIMORI_CLIENT_ID);
            refresh_url.searchParams.set('client_secret', SHIKIMORI_CLIENT_SECRET);
            refresh_url.searchParams.set('refresh_token', storage_token.refresh_token);

            fetch(refresh_url.toString(), {
                method: 'POST'
            })
                .then(async new_token => {
                    await chrome.storage.sync.set({'shikimori_token': new_token});
                    resolve(new_token);
                })
                .catch(err => reject(err));
        })
    });
}

function shikimoriSynced() {
    return new Promise(async resolve => {
        chrome.storage.sync.get('shikimori_token', async (storage_token) => {
            let token = storage_token.shikimori_token;
            if (!token || !token.access_token || !token.refresh_token)
                return resolve(false);

            let expiration_date = new Date((token.created_at + token.expires_in) * 1000);
            if (Date.now() > expiration_date) {
                token = await _shikimoriRefreshToken();
            }

            resolve(true);
        });
    });
}

async function shikimoriGetUserId() {
    return await fetch('https://shikimori.one/api/users/whoami')
        .then(res => res.json())
        .then(user => user ? user.id : null)
        .catch(err => {
            console.error(err);
            return null;
        })
}

async function shikimoriGetAnimeRate(user_id, anime_id) {
    return new Promise((resolve, reject) => {
        fetch(`https://shikimori.one/api/v2/user_rates?user_id=${user_id}&target_id=${anime_id}&target_type=Anime`)
            .then(res => res.json())
            .then(rate => resolve(rate[0]))
            .catch(err => reject(err));
    });
}

async function shikimoriIncEpisode(anime_id) {
    return new Promise(async (resolve, reject) => {
        let user_id = await shikimoriGetUserId();
        let anime_rate = await shikimoriGetAnimeRate(user_id, anime_id);

        if (!user_id)
            reject(new Error('User unauthorized'));

        if (anime_rate) {
            fetch(`https://shikimori.one/api/v2/user_rates/${anime_rate.id}/increment`, {
                method: 'POST'
            })
                .then(res => resolve(res))
                .catch(err => reject(err));
        } else {
            let rate_data = {
                user_id: user_id,
                target_id: anime_id,
                target_type: 'Anime',
                episodes: 1
            };

            fetch(`https://shikimori.one/api/v2/user_rates`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rate_data)
            })
                .then(res => resolve(res))
                .catch(err => reject(err));
        }
    });
}

async function _watchedIndicate(user_id, anime_id, episode) {
    let anime_rate = await shikimoriGetAnimeRate(user_id, anime_id);

    try {
        if (anime_rate) {
            if (episode <= anime_rate.episodes && !watched_button.classList.contains('green-filter')) {
                watched_button.classList.add('green-filter');
                watched_button.disabled = true;
            } else if (episode > anime_rate.episodes) {
                watched_button.classList.remove('green-filter');
                watched_button.disabled = false;
            }
        }
    } catch (e) {
        console.error(e);
    }
}

function _authorize() {
    return new Promise(async (resolve, reject) => {
        let code_url = new URL('https://shikimori.one/oauth/authorize?');
        code_url.searchParams.set('client_id', SHIKIMORI_CLIENT_ID);
        code_url.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
        code_url.searchParams.set('response_type', 'code');

        chrome.tabs.query({active: true}, ([selectedTab]) =>
            chrome.tabs.create({active: true, url: code_url.toString()}, new_tab => {

                const onRemove = (tabId) => {
                    if (tabId === new_tab.id) {
                        reject({error: 'tab-removed'});
                        remove_listeners();
                    }
                };

                const onUpdate = (tabId, changeInfo) => {
                    const tabUrl = new URL(changeInfo.url);
                    const error = tabUrl.searchParams.get('error');
                    const error_description = tabUrl.searchParams.get('error_description');
                    const code = tabUrl.toString().split('authorize/')[1];

                    if (tabId !== new_tab.id || !changeInfo.url || tabUrl.toString().includes('response_type'))
                        return;

                    if (error || error_description) {
                        reject({error, error_description});
                    } else {
                        resolve(code);
                    }

                    remove_listeners();
                    chrome.tabs.update(selectedTab.id, { active: true }, () => chrome.tabs.remove(new_tab.id));
                };

                const remove_listeners = () => {
                    chrome.tabs.onRemoved.removeListener(onRemove);
                    chrome.tabs.onUpdated.removeListener(onUpdate);
                };

                chrome.tabs.onRemoved.addListener(onRemove);
                chrome.tabs.onUpdated.addListener(onUpdate);
            })
        );
    });
}

function fillSelection(videos) {
    fillKindSelection(videos);
    fillAuthorSelection(videos);
    fillQualitySelection(videos);
}

async function getAnimeEnglishTitle(anime_id) {
    return new Promise(resolve => {
        fetch(`https://shikimori.one/api/animes/${anime_id}`)
            .then(response => response.json())
            .then(anime => {
                resolve(anime.english[0]);
            })
            .catch(err => {
                console.warn(`Не удалось узнать англоязычное название для аниме: ${anime_id}`);
                resolve(null);
            })
    })
}