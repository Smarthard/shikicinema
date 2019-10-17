'use strict';

const PLAYER_URL = chrome.runtime.getURL('/index.html');

let player_button = document.createElement('a');
let info = document.createElement('div');
let observer = new MutationObserver(main);

console.log(`shikicinema loaded`);

observer.observe(document, {childList: true, subtree: true});

async function main() {

    let div_info = document.querySelector('div.c-info-right');
    let span_episode = document.querySelector('span.current-episodes');

    let episode = Math.max(span_episode ? span_episode.innerText : 1, 1);
    let anime_id = `${window.location}`.match(/\d+/);

    if (!div_info || !window.location.toString().includes('/animes/')) return ;

    if (!document.querySelector('#watch_button')) {

        player_button.id = 'watch_button';
        player_button.classList.add('b-link_button', 'dark', 'watch-online');
        player_button.textContent = 'Смотреть онлайн';

        if (anime_id) {
            fetch(`https://smarthard.net/api/shikivideos/${anime_id}`)
                .then(response => response.json())
                .then(videos => {
                    if (videos.length === 0) {
                        player_button.textContent = 'Видео не найдено';
                        player_button.classList.remove('watch-online');
                    }
                });

            div_info.appendChild(player_button);
            div_info.appendChild(info);

            player_button.onclick = () => {
                chrome.runtime.sendMessage({open_url: `${PLAYER_URL}#/${anime_id}/${episode}`});
            };
        } else {
            console.error('Не удалось узнать название аниме!');
        }
    }
}
