'use strict';

const PLAYER_URL = chrome.runtime.getURL('/index.html');
const SHIKIVIDEOS_API = 'https://smarthard.net/api/shikivideos';
const PLAYER_BUTTON = document.createElement('a');
const INFO_DIV = document.createElement('div');

const OBSERVER = new MutationObserver(() => {
  let isAnimePage = `${window.location}`.includes('/animes/');
  let isWatchButtonAppended = document.querySelector('#watch_button');
  let divInfo = document.querySelector('div.c-info-right');

  if (divInfo && isAnimePage && !isWatchButtonAppended) {
    appendWatchButtonTo(divInfo);
  }
});

OBSERVER.observe(document, {childList: true, subtree: true});

function _getUploadedEpisodes(animeId) {
  return fetch(`${SHIKIVIDEOS_API}/${animeId}/length`)
    .then((res) => res.json())
    .then((res) => res.length)
    .catch(() => 0);
}

function _getKodikEpisodes(animeTitle) {
  const query = `strict=true&types=anime,anime-serial&title=${animeTitle}`;

  return fetch(`https://smarthard.net/api/kodik/search?${query}`)
    .then((res) => res.json())
    .then((res) => res.total);
}

function _getAnimeInfo(animeId) {
  return fetch(`https://shikimori.one/api/animes/${animeId}`)
    .then((res) => res.json());
}

function _getEpisode(animeId) {
  const spanEpisode = document.querySelector('span.current-episodes');
  let episode = spanEpisode ? +spanEpisode.innerText + 1 : 1;

  return _getUploadedEpisodes(animeId)
    .then((length) => Math.max(Math.min(episode, +length), 1))
    .catch(() => 1);
}

async function appendWatchButtonTo(element) {
  let animeId = `${window.location}`.match(/\d+/);

  PLAYER_BUTTON.id = 'watch_button';
  PLAYER_BUTTON.classList.add('b-link_button', 'dark', 'watch-online');
  PLAYER_BUTTON.textContent = 'Смотреть онлайн';
  PLAYER_BUTTON.style.margin = '0 10%';

  if (animeId) {
    const episodesAvailable = await _getUploadedEpisodes(animeId);
    const anime = await _getAnimeInfo(animeId);

    element.appendChild(PLAYER_BUTTON);
    element.appendChild(INFO_DIV);

    if (episodesAvailable === 0 && await _getKodikEpisodes(anime.name) === 0) {
      PLAYER_BUTTON.textContent = 'Загрузить видео';
      PLAYER_BUTTON.classList.remove('watch-online');
    }

    PLAYER_BUTTON.onclick = async () => {
      const episode = await _getEpisode(animeId);
      chrome.runtime.sendMessage({ openUrl: `${PLAYER_URL}#/${animeId}/${episode}` });
    };
  } else {
    console.error('Не удалось узнать название аниме!');
  }
}
