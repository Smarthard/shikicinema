'use strict';

console.log('shikicinema loaded');

let player_button = document.createElement('button');
let close_button = document.createElement('button');
let div_player = document.createElement('div');
let video = document.createElement('iframe');

let div_info = document.body.getElementsByClassName('c-info-right')[0];
let videos_list = document.createElement('ul');

let episode_selection = document.createElement('select');
let kind_selection = document.createElement('select');
let author_selection = document.createElement('select');
let quality_selection = document.createElement('select');

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
    video.id = 'shikicinema-video'
    console.log(`changing video source to ${video.src}`);
}

function filter_animes(animes) {
    const episode = parseInt(episode_selection.options[episode_selection.selectedIndex].value);
    const kind = kind_selection.options[kind_selection.selectedIndex].value;
    const author = author_selection.options[author_selection.selectedIndex].value;
    const quality = quality_selection.options[quality_selection.selectedIndex].value;

    let filtered_animes = animes;

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

        li.innerHTML = `#${no_episode} `;
        a.innerHTML = `${title} (${val.kind}: ${val.author || "неизвестно"}) ${quality}`;

        a.addEventListener('click', () => {
            changeVideo(val.url)
        });

        li.appendChild(a);
        videos_list.appendChild(li);
    });

}

function fill_episode_selection(options) {
    let episodes = new Set(['№ серии']);

    options.forEach(option => {
        episodes.add(option.episode);
    });

    episodes.forEach(episode => {
        let opt = document.createElement('option');
        opt.value = episode;
        opt.innerHTML = episode;

        episode_selection.appendChild(opt);
    })
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


let title = document.body.getElementsByTagName('h1')[0];
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

if (div_info != null) {

    div_info.appendChild(player_button);
    document.body.appendChild(div_player);
    div_player.appendChild(close_button);
    div_player.appendChild(video);
    div_player.hidden = true;

    div_player.appendChild(episode_selection);
    div_player.appendChild(kind_selection);
    div_player.appendChild(author_selection);
    div_player.appendChild(quality_selection);

    div_player.appendChild(videos_list);

    findAllAnimeEntriesInDB(title).then(values => {
        changeVideo(values[0].url);

        fill_episode_selection(values);
        fill_kind_selection(values);
        fill_author_selection(values);
        fill_quality_selection(values);

        episode_selection.addEventListener('change', () => {
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
