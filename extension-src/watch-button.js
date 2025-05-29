'use strict';

import { FETCH_RESOURCE_TIMEOUT, fetch } from './fetch-timeout';
import { getShikimoriLocale } from './get-shikimori-locale';

const PLAYER_URL = chrome.runtime.getURL('/index.html');
const SHIKIVIDEOS_API = 'https://smarthard.net/api/shikivideos';
const KODIK_TOKEN = `${process.env.KODIK_AUTH_TOKEN}`;
const PLAYER_BUTTON = document.createElement('a');
const INFO_DIV = document.createElement('div');

async function addWatchButtonTo(divInfo) {
    const [ animeId ] = `${window.location}`.match(/\d+/);
    const isAnimePage = `${window.location}`.includes('/animes/');

    if (isAnimePage && divInfo) {
        const anime = await _getAnimeInfo(animeId) || { id: animeId, status: 'anons' };

        await appendWatchButtonTo(divInfo, anime);
    }
}

function tryAddButton() {
    const divInfo = document.querySelector('div.c-info-right');
    const hasWatchButton = document.querySelector('#watch_button');

    if (divInfo) {
        if (!hasWatchButton) {
            addWatchButtonTo(divInfo);
        }

        return true;
    }

    return false;
}

function watchAnimePages() {
    const watchBtnObserver = new MutationObserver(() => {
        const isSuccess = tryAddButton();

        if (isSuccess) {
            watchBtnObserver.disconnect();
        }
    });

    watchBtnObserver.observe(document, { childList: true, subtree: true });
}

function watchUrlChanges() {
    let lastUrl = null;

    const urlObserver = new MutationObserver(() => {
        const newUrlLocation = window.location.href;

        if (newUrlLocation !== lastUrl) {
            lastUrl = newUrlLocation;
            watchAnimePages();
        }
    });

    urlObserver.observe(document, { childList: true, subtree: true });
}

function _getUploadedEpisodes(animeId, timeout = FETCH_RESOURCE_TIMEOUT) {
  return fetch(`${SHIKIVIDEOS_API}/${animeId}/length`, {}, timeout)
    .then((res) => res.json())
    .then((res) => res?.length)
    .catch(() => 0);
}

function _getKodikEpisodes(anime, timeout = FETCH_RESOURCE_TIMEOUT) {
  const query = `with_episodes=true&shikimori_id=${anime.id}&token=${KODIK_TOKEN}`;

  return fetch(`https://kodikapi.com/search?${query}`, {}, timeout)
    .then((res) => res.json())
    .then((res) => res?.total)
    .catch(() => 0);
}

function _getAnimeInfo(animeId, timeout = FETCH_RESOURCE_TIMEOUT) {
  return fetch(`/api/animes/${animeId}`, {}, timeout)
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
  const isEnglishLocale = getShikimoriLocale() === 'en';

  PLAYER_BUTTON.id = 'watch_button';
  PLAYER_BUTTON.classList.add('b-link_button', 'dark', 'watch-online');
  PLAYER_BUTTON.classList.remove('upload-video');
  PLAYER_BUTTON.textContent = isEnglishLocale ? 'Watch online' : 'Смотреть онлайн';
  PLAYER_BUTTON.href = `${PLAYER_URL}#player/${anime.id}`

  INFO_DIV.classList.add('watch-button-div');

  INFO_DIV.appendChild(PLAYER_BUTTON);
  element.appendChild(INFO_DIV);

  if (lastOrMaxEpisodeAvailable === 0 || anime.status === 'anons' && lastOrMaxEpisodeAvailable === 0) {
    PLAYER_BUTTON.textContent = isEnglishLocale ? 'Upload video' : 'Загрузить видео';
    PLAYER_BUTTON.classList.add('upload-video');
    PLAYER_BUTTON.classList.remove('watch-online');
  }
}

tryAddButton();
watchUrlChanges();
