'use strict';

const PLAYER_URL = chrome.runtime.getURL('/index.html');
const SHIKIVIDEOS_API = 'https://smarthard.net/api/shikivideos';

let playerButton = document.createElement('a');
let info = document.createElement('div');
let observer = new MutationObserver(main);

console.log('shikicinema loaded');

observer.observe(document, {childList: true, subtree: true});

async function main() {

    const LOCATION = `${window.location}`;

    let divInfo = document.querySelector('div.c-info-right');
    let profileBody = document.querySelector('body#profiles_show');
    let uploads = document.querySelector('div[data-type="video_uploads"]') || document.createElement('div');

    /* profile uploads logic */
    if (profileBody && !uploads.classList.contains('uploader_contributions')) {
        let cInfoDiv = document.querySelector('div.c-info');
        let activityDiv = document.querySelector('div.c-additionals');
        let nickname = LOCATION.split('/').slice(-1)[0];
        let user = await fetch(`https://shikimori.one/api/users/${nickname}?is_nickname=1`)
          .then(res => res.json());
        let contributions = await fetch(`${SHIKIVIDEOS_API}/contributions?uploader=${user.id}+${user.nickname}`)
          .then(res => res.json());
        let upload = `загруз${contributions.count === 1 ? 'ка' : contributions.count < 5 ? 'ки' : 'ок'}`;

        uploads.classList.add('uploader_contributions');
        uploads.innerHTML = `<span><a href="#">${contributions.count} ${upload} видео</a></span>`;
        uploads.onclick = () => {
            chrome.runtime.sendMessage({ openUrl: `${PLAYER_URL}#/videos?uploader=${user.nickname}` });
        };

        if (
          contributions.count > 0 &&
          !activityDiv &&
          !cInfoDiv.classList.contains('uploader_contributions')
        ) {
            cInfoDiv.classList.add('uploader_contributions');
            activityDiv = document.createElement('div');
            activityDiv.classList.add('c-additionals');
            activityDiv.innerHTML = '<b>Активность:</b>';
            cInfoDiv.appendChild(activityDiv);
        }

        if (
          contributions.count > 0 &&
          !uploads.hasAttribute('data-type') &&
          !activityDiv.classList.contains('uploader_contributions')
        ) {
            activityDiv.classList.add('uploader_contributions');
            uploads.setAttribute('data-type', 'video_uploads');
            activityDiv.appendChild(uploads);
        }
    }

    /* watch button logic */
    if (divInfo && LOCATION.includes('/animes/') && !document.querySelector('#watch_button')) {
        let spanEpisode = document.querySelector('span.current-episodes');
        let episode = spanEpisode ? +spanEpisode.innerText + 1 : 1;
        let animeId = LOCATION.match(/\d+/);

        playerButton.id = 'watch_button';
        playerButton.classList.add('b-link_button', 'dark', 'watch-online');
        playerButton.textContent = 'Смотреть онлайн';
        playerButton.style.margin = '0 10%';

        if (animeId) {
            fetch(`${SHIKIVIDEOS_API}/${animeId}/length`)
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
