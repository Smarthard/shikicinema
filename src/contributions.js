'use strict';

let timeout = null;
const PLAYER_URL = chrome.runtime.getURL('/index.html');
const SHIKIVIDEOS_API = 'https://smarthard.net/api/shikivideos';

let observer = new MutationObserver(() => {
  let uploads = document.querySelector('div[data-type="video_uploads"]') || document.createElement('div');
  let profileBody = document.querySelector('body#profiles_show');
  let isAnimePage = `${window.location}`.includes('/animes/');
  let isContribtuonsAppened = uploads.classList.contains('uploader_contributions');

  if (timeout)
    clearTimeout(timeout);

  timeout = setTimeout(async () => {
    if (profileBody && !isAnimePage && !isContribtuonsAppened) {
      correctContributions(uploads);
    }
  }, 150);
});

observer.observe(document, {childList: true, subtree: true});

async function correctContributions(element) {
  let cInfoDiv = document.querySelector('div.c-info');
  let activityDiv = document.querySelector('div.c-additionals');
  let nickname = `${window.location}`.split('/').slice(-1)[0];
  let user = await fetch(`https://shikimori.one/api/users/${nickname}?is_nickname=1`)
    .then(res => res.json());

  if (user && user.id) {
    let contributions = await fetch(`${SHIKIVIDEOS_API}/contributions?uploader=${user.id}`)
      .then(res => res.json());
    let upload = `загруз${contributions.count === 1 ? 'ка' : contributions.count < 5 ? 'ки' : 'ок'}`;

    element.classList.add('uploader_contributions');
    element.innerHTML = `<span><a href="#">${contributions.count} ${upload} видео</a></span>`;
    element.onclick = () => {
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
      !element.hasAttribute('data-type') &&
      !activityDiv.classList.contains('uploader_contributions')
    ) {
      activityDiv.classList.add('uploader_contributions');
      element.setAttribute('data-type', 'video_uploads');
      activityDiv.appendChild(element);
    }
  }
}
