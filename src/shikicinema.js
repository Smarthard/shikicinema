'use strict';

const PLAYER_URL = chrome.runtime.getURL('player.html');

let player_button = document.createElement('a');
let info = document.createElement('div');
let observer = new MutationObserver(main);

console.log(`shikicinema loaded`);

observer.observe(document, {childList: true, subtree: true});

async function main() {

    let div_info = document.querySelector('div.c-info-right');
    let anime_id = `${window.location}`.match(/\d+/);
    let title = document.body.getElementsByTagName('h1')[0];

    if (!div_info || !window.location.toString().includes('/animes/')) return ;

    if (!document.querySelector('#watch_button')) {

        player_button.id = 'watch_button';
        player_button.classList.add('b-link_button', 'dark', 'watch-online');

        if (title != null) {
            title = title.innerHTML;
            title = title.substring(0, title.indexOf(' <span'));

            fetch(`https://smarthard.net/api/shikivideos/search?title=${title}`)
                .then(response => response.json())
                .then(videos => {
                    if (videos.length > 0) {
                        player_button.textContent = 'Смотреть онлайн';
                    } else {
                        player_button.textContent = 'Видео не найдено';
                        player_button.classList.remove('watch-online');
                    }
                });

            div_info.appendChild(player_button);
            div_info.appendChild(info);

            player_button.onclick = () => {
                chrome.runtime.sendMessage({open_url: `${PLAYER_URL}?title=${title}&anime_id=${anime_id}`});
            };
        } else {
            console.error('Не удалось узнать название аниме!');
        }
    }
}
