'use strict';

import ShikiAPI from './modules/shikimori-api';
import Player from './modules/player/player';


let player_button = document.createElement('button');
let div_info = document.body.getElementsByClassName('c-info-right')[0];
let title = document.body.getElementsByTagName('h1')[0];
let shikicinema_player = null;


console.log(`shikicinema loaded`);

main();

async function main() {

    if (div_info) {
        shikicinema_player = new Player();
        player_button.classList.add('b-link_button', 'dark');

        ShikiAPI.isLoggedIn().then(value => {
            shikicinema_player.inc_button.disabled = !value;
        });

        if (title != null) {
            title = title.innerHTML;
            title = title.substring(0, title.indexOf(' <span'));

            shikicinema_player.find(title);

            if (shikicinema_player.isAnyVideoAvailable) {
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
