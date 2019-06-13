'use strict';

const shikiapi = require('./modules/shikimori-api.js');

let span_current_episodes = document.querySelector('span.current-episodes');
let span_total_episodes = document.querySelector('span.total-episodes');

let current_episodes = parseInt(span_current_episodes != null ? span_current_episodes.textContent : '');
let total_episodes = parseInt(span_total_episodes != null ? span_total_episodes.textContent : '');

let player_button = document.createElement('button');
let close_button = document.createElement('button');
let div_player = document.createElement('div');
let div_player_ratio = document.createElement('div');
let video = document.createElement('iframe');

let div_info = document.body.getElementsByClassName('c-info-right')[0];
let videos_list = document.createElement('ul');

let episode_selection = document.createElement('input');
let kind_selection = document.createElement('select');
let author_selection = document.createElement('select');
let quality_selection = document.createElement('select');

let div_controls = document.createElement('div');
let prev_button = document.createElement('button');
let increment_button = document.createElement('button');
let next_button = document.createElement('button');

let control_box_prev = document.createElement('div');
let control_box_episode = document.createElement('div');
let control_box_next = document.createElement('div');
let control_box_inc = document.createElement('div');

let label_prev = document.createElement('div');
let label_episode = document.createElement('span');
let label_next = document.createElement('div');
let label_inc = document.createElement('div');

let title = document.body.getElementsByTagName('h1')[0];

function findAllAnimeEntriesInDB(name) {
    return new Promise((resolve, reject) => {
        let rawFile = new XMLHttpRequest();
        let entries = [];

        rawFile.open("GET", chrome.extension.getURL('videos.csv'), true);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    let allText = rawFile.responseText;

                    allText.split("\n").forEach(str => {
                        if (str.includes(`;${name};`)) {
                            let entry = parseCSVString(str);
                            entry.src = entry.url.replace('http:', 'https:');

                            entries.push(entry);
                        }
                    });
                    
                    if (entries.length > 0) {
                        resolve(entries.sort((a, b) => a.episode - b.episode));
                    } else {
                        reject([]);
                    }
                } else {
                    reject([]);
                }
            }
        };

        rawFile.send(null);
    });
}

function parseCSVString(str) {
    const fields = ['id', 'url', 'anime_id', 'title_eng', 'title_rus', 'episode', 'kind', 'language', 'quality', 'author'];

    let parsedString = {};
    let values = str.split(";");

    for (let i = 0; i < 10; i++) {
        parsedString[fields[i]] = values[i]
    }

    return parsedString;
}

function changeVideo(url) {
    if (url.includes('http://')) {
        console.log(`Forcing https connection for ${url}`);

        url = url.replace('http:', 'https:');
    }

    video.src = url;
    console.log(`changing video source to ${video.src}`);
}

function filter_animes(animes) {
    const episode = parseInt(episode_selection.value);
    const kind = kind_selection.options[kind_selection.selectedIndex].value;
    const author = author_selection.options[author_selection.selectedIndex].value;
    const quality = quality_selection.options[quality_selection.selectedIndex].value;
    const watched_button  = document.querySelector('button#watched-button');

    let filtered_animes = animes;

    try {
        if (episode <= current_episodes && !watched_button.classList.contains('green-filter')) {
            watched_button.classList.add('green-filter');
            watched_button.disabled = true;
        } else if (episode > current_episodes) {
            watched_button.classList.remove('green-filter');
            watched_button.disabled = false;
        }
    } catch (e) {
        console.error(e);
    }

    while (videos_list.firstChild) {
        videos_list.removeChild(videos_list.firstChild);
    }

    filtered_animes = filtered_animes.filter(anime => {
        if (!isNaN(episode)) {
            return anime.episode == episode;
        } else {
            return true;
        }
    });

    filtered_animes = filtered_animes.filter(anime => {
        if (kind != 'Озвучка/Субтитры') {
            return anime.kind == kind;
        } else {
            return true;
        }
    });

    filtered_animes = filtered_animes.filter(anime => {
        if (author != 'Студия') {
            return anime.author == author;
        } else {
            return true;
        }
    });

    filtered_animes = filtered_animes.filter(anime => {
        if (quality != 'Качество') {
            return anime.quality == quality;
        } else {
            return true;
        }
    });

    filtered_animes.forEach(val => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let no_episode = val.episode;
        let title = val.title_rus;
        let quality = val.quality != 'неизвестное' ? val.quality.toLocaleUpperCase() : '';
        let source;

        switch (true) {

            case /animedia/.test(val.url):      source = 'Animedia';        break;
            case /sibnet/.test(val.url):        source = 'Sibnet';          break;
            case /smotretanime/.test(val.url):  source = 'SmotretAnime';    break;
            case /sovetromanti/.test(val.url):  source = 'SovetRomantica';  break;
            case /mail.ru/.test(val.url):       source = 'Mail.ru';         break;
            case /mediafile/.test(val.url):     source = 'MediaFile';       break;
            case /ok.ru/.test(val.url):         source = 'Одноклассники';   break;
            case /vk.com/.test(val.url):        source = 'Вкотакте';        break;
            case /myvi/.test(val.url):          source = 'Myvi';            break;
            case /stormo/.test(val.url):        source = 'Stromo';          break;
            case /youtu/.test(val.url):         source = 'YouTube';         break;

            default: source = 'неизвестен';
        }

        li.innerHTML = `#${no_episode} `;
        a.innerHTML = `${title} (${val.kind}: <span class="shc-author">${val.author || "неизвестно"}</span>, 
                        проигрыватель: <span class="shc-source">${source}</span>) ${quality}`;

        a.addEventListener('click', () => {
            changeVideo(val.url)
        });

        li.appendChild(a);
        videos_list.appendChild(li);
    });

}

function fill_kind_selection(options) {
    let kinds = new Set(['Озвучка/Субтитры']);

    options.forEach(option => {
        kinds.add(option.kind);
    });

    kinds.forEach(kind => {
        let opt = document.createElement('option');
        opt.value = kind;
        opt.innerHTML = kind;

        kind_selection.appendChild(opt);
    })
}

function fill_author_selection(options) {
    let authors = new Set();

    options.forEach(option => {
        if (option.author == '' || option.author == 'unknown') {
            authors.add('неизвестно');
        } else {
            authors.add(option.author);
        }
    });

    authors = Array.from(authors).sort((a, b) => a.localeCompare(b));
    authors.unshift('Студия');

    authors.forEach(author => {
        let opt = document.createElement('option');
        opt.value = author;
        opt.innerHTML = author;

        author_selection.appendChild(opt);
    })
}

function fill_quality_selection(options) {
    let qualities = new Set(['Качество']);

    options.forEach(option => {
        qualities.add(option.quality != '' ? option.quality : 'неизвестное');
    });

    qualities.forEach(qual => {
        let opt = document.createElement('option');
        opt.value = qual;
        opt.innerHTML = qual;

        quality_selection.appendChild(opt);
    })
}

/* main */

console.log(`shikicinema loaded`);

shikiapi.isLoggedIn().then(value => {
    increment_button.disabled = !value;
});

if (title != null) {
    title = title.innerHTML;
    title = title.substring(0, title.indexOf(' <span'));
} else {
    throw new Error('Не удалось узнать название аниме!');
}

player_button.textContent = 'Смотреть';
player_button.classList.add('b-link_button', 'dark');
player_button.addEventListener('click', () => {
    div_player.hidden = false;
});

div_player.id = 'shikicinema-player';
div_player.classList.add('shikicinema-player-content');

div_player_ratio.id = 'shikicinema-player-ratio';

div_controls.id = 'shikicinema-controls';

episode_selection.type = 'text';
episode_selection.pattern = '[0-9]+';
episode_selection.min = '1';

prev_button.innerHTML = `<img height="25vh" src='${chrome.runtime.getURL("./assets/fastbackward.png")}' alt="previous">`;
increment_button.innerHTML = `<img height="25vh" src='${chrome.runtime.getURL("./assets/check_mark.png")}' alt="watched">`;
next_button.innerHTML = `<img height="25vh" src='${chrome.runtime.getURL("./assets/fastforward.png")}' alt="next">`;

increment_button.id="watched-button";

prev_button.classList.add('shikicinema-controls-button');
increment_button.classList.add('shikicinema-controls-button');
next_button.classList.add('shikicinema-controls-button');

control_box_prev.classList.add('control-box');
control_box_episode.classList.add('control-box');
control_box_next.classList.add('control-box');
control_box_inc.classList.add('control-box');

label_prev.classList.add('label');
label_episode.classList.add('label');
label_next.classList.add('label');
label_inc.classList.add('label');

label_prev.textContent = 'Предыдущий';
label_episode.textContent = '#';
label_next.textContent = 'Следующий';
label_inc.textContent = 'Просмотрено';

video.id = 'shikicinema-video';
video.setAttribute('allowFullScreen', '');

if (div_info != null) {

    div_info.appendChild(player_button);
    document.body.appendChild(div_player);
    div_player.appendChild(close_button);
    div_player.appendChild(div_player_ratio);
    div_player_ratio.appendChild(video);
    div_player.hidden = true;

    div_player.appendChild(kind_selection);
    div_player.appendChild(author_selection);
    div_player.appendChild(quality_selection);

    div_player.appendChild(div_controls);

    div_controls.appendChild(control_box_prev);
    div_controls.appendChild(control_box_episode);
    div_controls.appendChild(control_box_next);
    div_controls.appendChild(control_box_inc);

    control_box_prev.appendChild(prev_button);
    control_box_prev.appendChild(label_prev);

    control_box_episode.appendChild(label_episode);
    control_box_episode.appendChild(episode_selection);

    control_box_next.appendChild(next_button);
    control_box_next.appendChild(label_next);

    control_box_inc.appendChild(increment_button);
    control_box_inc.appendChild(label_inc);

    div_player.appendChild(videos_list);

    findAllAnimeEntriesInDB(title).then(values => {

        changeVideo(values[0].url);

        if (!total_episodes) {
            let episodes = values.map(value => value.episode);

            total_episodes = Math.max.apply(null, episodes);
        }

        episode_selection.value = `${isNaN(current_episodes) ? 1 : Math.min(current_episodes + 1, total_episodes)}`;

        fill_kind_selection(values);
        fill_author_selection(values);
        fill_quality_selection(values);

        episode_selection.addEventListener('input', () => {
            filter_animes(values);
        });
        kind_selection.addEventListener('change', () => {
            filter_animes(values);
        });
        author_selection.addEventListener('change', () => {
            filter_animes(values);
        });
        quality_selection.addEventListener('change', () => {
            filter_animes(values);
        });


        next_button.addEventListener('click', () => {
            try {
                if (episode_selection.value < total_episodes) {
                    episode_selection.value++;
                    filter_animes(values);
                }
            } catch (e) {
                console.error(e);
            }
        });

        prev_button.addEventListener('click', () => {
            if (episode_selection.value > 1) {
                episode_selection.value--;
                filter_animes(values);
            }
        });

        filter_animes(values);

    }).catch(err => {
        player_button.enable = false;
    });

    close_button.textContent = '✕';
    close_button.classList.add('b-link_button', 'dark', 'shikimori-close-button');
    close_button.addEventListener('click', () => {
        div_player.hidden = true;
    });
}
