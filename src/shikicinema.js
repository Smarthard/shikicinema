'use strict';

const PLAYER_URL = chrome.runtime.getURL('/index.html');

let playerButton = document.createElement('a');
let info = document.createElement('div');
let observer = new MutationObserver(main);

console.log('shikicinema loaded');

observer.observe(document, {childList: true, subtree: true});

async function main() {

    let divInfo = document.querySelector('div.c-info-right');
    let spanEpisode = document.querySelector('span.current-episodes');

    let episode = spanEpisode ? +spanEpisode.innerText + 1 : 1;
    let animeId = `${window.location}`.match(/\d+/);

    if (!divInfo || !window.location.toString().includes('/animes/')) {
        return;
    }

    if (!document.querySelector('#watch_button')) {

        playerButton.id = 'watch_button';
        playerButton.classList.add('b-link_button', 'dark', 'watch-online');
        playerButton.textContent = 'Смотреть онлайн';

        if (animeId) {
            fetch(`https://smarthard.net/api/shikivideos/${animeId}/length`)
                .then(response => response.json())
                .then((res) => {
                    let length = res.length || 0;
                    episode = Math.max(Math.min(episode, length), 1);

                    if (length === 0) {
                        playerButton.textContent = 'Видео не найдено';
                        playerButton.classList.remove('watch-online');
                    }
                });

            divInfo.appendChild(playerButton);
            divInfo.appendChild(info);

            playerButton.onclick = () => {
                chrome.runtime.sendMessage({ openUrl: `${PLAYER_URL}#/${animeId}/${episode}` });
            };
        } else {
            console.error('Не удалось узнать название аниме!');
        }
    }
}
