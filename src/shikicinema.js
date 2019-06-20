'use strict';

import Player from './modules/player';


let player_button = document.createElement('button');
let observer = new MutationObserver(main);
let shikicinema_player = null;

console.log(`shikicinema loaded`);

observer.observe(document, {childList: true, subtree: true});

async function main() {

    let div_info = document.querySelector('div.c-info-right');
    let title = document.body.getElementsByTagName('h1')[0];

    if (!div_info || !window.location.toString().includes('/animes/')) return ;

    if (div_info && !div_info.contains(player_button)) {

        shikicinema_player = new Player();
        player_button.classList.add('b-link_button', 'dark');

        if (title != null) {
            title = title.innerHTML;
            title = title.substring(0, title.indexOf(' <span'));

            shikicinema_player.find(title);

            if (shikicinema_player.hasVideos) {
                player_button.textContent = 'Смотреть';
            } else {
                player_button.textContent = 'Видео не найдено';
                player_button.disabled = true;
            }

            div_info.appendChild(player_button);
        } else {
            console.error('Не удалось узнать название аниме!');
        }
        player_button.addEventListener('click', () => {
            shikicinema_player.show();
        });
    }
}
