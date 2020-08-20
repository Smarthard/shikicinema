'use strict';

import { FETCH_RESOURCE_TIMEOUT, fetch } from './fetch-timeout';

let timeout = null;
const PLAYER_URL = chrome.runtime.getURL('/index.html');
const SHIKIVIDEOS_API = 'https://smarthard.net/api/shikivideos';
const KODIK_TOKEN = `${process.env.KODIK_TOKEN}`;
const PLAYER_BUTTON = document.createElement('a');
const INFO_DIV = document.createElement('div');
const ON_WATCH_CLICK = async (anime) => {
  const userRate = await _getAnimeInfo(anime.id, 800)
    .then((updatedAnime) => updatedAnime.user_rate)
    .catch(() => null);
  const maxEpisode = anime.episodes || anime.episodes_aired || 1;
  let episode = +(userRate ? userRate.episodes : 0) + 1;

  if (episode > maxEpisode) {
    episode = maxEpisode;
  }

  chrome.runtime.sendMessage({ openUrl: `${PLAYER_URL}#/${anime.id}/${episode}` });
};

const OBSERVER = new MutationObserver(() => {
  let animeId = `${window.location}`.match(/\d+/);
  let isAnimePage = `${window.location}`.includes('/animes/');
  let divInfo = document.querySelector('div.c-info-right');
  let watchButton = document.querySelector('a#watch_button');

  if (timeout)
    clearTimeout(timeout);

  timeout = setTimeout(async () => {
    let anime = isAnimePage ? await _getAnimeInfo(animeId) : {};

    if (divInfo && isAnimePage && !watchButton) {
      await appendWatchButtonTo(divInfo, anime);
    } else if (isAnimePage && watchButton) {
      watchButton.onclick = () => ON_WATCH_CLICK(anime);
    }
  }, 100);
});

OBSERVER.observe(window.document, {childList: true, subtree: true});

function _getUploadedEpisodes(animeId, timeout = FETCH_RESOURCE_TIMEOUT) {
  return fetch(`${SHIKIVIDEOS_API}/${animeId}/length`, {}, timeout)
    .then((res) => res.json())
    .then((res) => res.length)
    .catch(() => 0);
}

function _getKodikEpisodes(anime, timeout = FETCH_RESOURCE_TIMEOUT) {
  const query = `with_episodes=true&shikimori_id=${anime.id}&token=${KODIK_TOKEN}`;

  return fetch(`https://kodikapi.com/search?${query}`, {}, timeout)
    .then((res) => res.json())
    .then((res) => res.total)
    .catch(() => 0);
}

function _getAnimeInfo(animeId, timeout = FETCH_RESOURCE_TIMEOUT) {
  return fetch(`https://shikimori.one/api/animes/${animeId}`, {}, timeout)
    .then((res) => res.json())
    .catch(() => ({ id: animeId }));
}

async function _getMaxUploadedEpisode(anime, timeout = FETCH_RESOURCE_TIMEOUT) {
  const mainArchiveMax = await _getUploadedEpisodes(anime.id, timeout);
  const kodikMax = await _getKodikEpisodes(anime, timeout);
  const maxAvailable = Math.max(mainArchiveMax, kodikMax);

  return Math.min(1, +maxAvailable);
}

async function appendWatchButtonTo(element, anime) {
  const lastOrMaxEpisodeAvailable = await _getMaxUploadedEpisode(anime);

  PLAYER_BUTTON.id = 'watch_button';
  PLAYER_BUTTON.classList.add('b-link_button', 'dark', 'watch-online');
  PLAYER_BUTTON.classList.remove('upload-video');
  PLAYER_BUTTON.textContent = 'Смотреть онлайн';
  PLAYER_BUTTON.style.margin = '0 10%';
  PLAYER_BUTTON.onclick = () => ON_WATCH_CLICK(anime);

  element.appendChild(PLAYER_BUTTON);
  element.appendChild(INFO_DIV);

  if (lastOrMaxEpisodeAvailable === 0 || anime.status === 'anons') {
    PLAYER_BUTTON.textContent = 'Загрузить видео';
    PLAYER_BUTTON.classList.add('upload-video');
    PLAYER_BUTTON.classList.remove('watch-online');
  }
}
