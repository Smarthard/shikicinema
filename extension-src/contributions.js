'use strict';

import { fetch } from './fetch-timeout';
import { getShikimoriLocale } from './get-shikimori-locale';

let timeout = null;

const PLAYER_URL = chrome.runtime.getURL('/index.html');
const SHIKIVIDEOS_API = 'https://smarthard.net/api/shikivideos';
const CONTRIBUTIONS_ELEMENT_CLASS_NAME = 'uploader_contributions';

function hasAppendedCotributions(htmlEl) {
    return htmlEl && htmlEl instanceof HTMLElement && htmlEl.classList.contains(CONTRIBUTIONS_ELEMENT_CLASS_NAME);
}

async function getContributionsCount(uploader) {
    return await fetch(`${SHIKIVIDEOS_API}/contributions?uploader=${uploader}`)
        .then(res => res.json())
        .then((contributions) => contributions && contributions.count)
        .catch(() => 0);
}

async function checkAndAppendContribs() {
    const uploads = document.querySelector('div[data-type="video_uploads"]') || document.createElement('div');
    const profileBody = document.querySelector('body#profiles_show');
    const isOtherShikimoriPage = /\/(animes)|(mangas)|(ranobe)(forum)|(clubs)|(collections)|(articles)|(users)|(contests)|(ongoings)|(about)|(moderations)|(list)\//i.test(window.location);
    const isContributionsAppended = hasAppendedCotributions(uploads);

    if (profileBody && !isOtherShikimoriPage && !isContributionsAppended) {
      await correctContributions(uploads);
    }
}

let observer = new MutationObserver(() => {
  if (timeout) {
    clearTimeout(timeout);
  }

  checkAndAppendContribs()

  timeout = setTimeout(checkAndAppendContribs, 150);
});

observer.observe(window.document, {childList: true, subtree: true});

async function correctContributions(element) {
  const cInfoDiv = document.querySelector('div.c-info');
  const nickname = `${window.location.pathname}`.split('/').slice(-1)[0];
  const userId = document.querySelector('.profile-head')?.getAttribute('data-user-id');
  const isEnglishLocale = getShikimoriLocale() === 'en';

  let activityDiv = document.querySelector('div.c-additionals');

  if (userId) {
    const contribPageUrl = `${PLAYER_URL}#/contributions?uploader=${nickname}`;
    const contributions = await getContributionsCount(userId);
    const uploadsTextRu = `${contributions} загруз${contributions === 1 ? 'ка' : contributions < 5 ? 'ки' : 'ок'} видео`;
    const uploadsTextEn = `${contributions} video upload${contributions > 1 ? 's' : ''}`;

    element.classList.add(CONTRIBUTIONS_ELEMENT_CLASS_NAME);
    element.innerHTML = `<span><a href="${contribPageUrl}">${isEnglishLocale ? uploadsTextEn : uploadsTextRu}</a></span>`;

    // если нет списка активности вообще, создаём
    if (
      contributions > 0 &&
      !activityDiv &&
      !hasAppendedCotributions(cInfoDiv)
    ) {
      cInfoDiv.classList.add(CONTRIBUTIONS_ELEMENT_CLASS_NAME);
      activityDiv = document.createElement('div');
      activityDiv.classList.add('c-additionals');
      activityDiv.innerHTML = isEnglishLocale ? '<b>Activity</b>' : '<b>Активность:</b>';
      cInfoDiv.appendChild(activityDiv);
    }

    // если список активности есть, но нет загрузок, добавляем
    if (
      contributions > 0 &&
      !element.hasAttribute('data-type') &&
      !hasAppendedCotributions(activityDiv)
    ) {
      activityDiv.classList.add(CONTRIBUTIONS_ELEMENT_CLASS_NAME);
      element.setAttribute('data-type', 'video_uploads');
      activityDiv?.appendChild(element);
    }
  }

  clearTimeout(timeout);
}
