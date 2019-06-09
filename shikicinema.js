'use strict';

console.log('shikicinema loaded');

let player_button = document.createElement('button');
let close_button = document.createElement('button');
let div_player = document.createElement('div');
let video = document.createElement('iframe');

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

/* main */

const div_info = document.body.getElementsByClassName('c-info-right')[0];
const videos_list = document.createElement('ul');

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

    findAllAnimeEntriesInDB(title).then(values => {
        console.log("anime episodes found:");
        console.table(values);
        changeVideo(values[0].url);

        div_player.appendChild(videos_list);
        values.forEach(val => {
            let li = document.createElement('li');
            let a = document.createElement('a');
            let no_episode = val.episode;
            let title = val.title_rus;
            let quality = val.quality != 'unknown' ? val.quality.toLocaleUpperCase() : '';

            li.innerHTML = `#${no_episode} `;
            a.innerHTML = `${title} (${val.kind}: ${val.author || "unknown"}) ${quality}`;

            a.addEventListener('click', () => {
                changeVideo(val.url)
            });

            li.appendChild(a);
            videos_list.appendChild(li);
        });
    }).catch(err => {
        player_button.enable = false;
    });

    close_button.textContent = '✕';
    close_button.classList.add('b-link_button', 'dark', 'shikimori-close-button');
    close_button.addEventListener('click', () => {
        div_player.hidden = true;
    });
}
