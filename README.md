# shikicinema

Этот плагин для браузера возвращает возможность смотреть аниме онлайн на сайте shikimori.\[org|one\].

## Установка

[Chrome Web Store](https://chrome.google.com/webstore/detail/shikicinema/hmbjohbggdnlpmokjbholpgegcdbehjp)

Для тестирования из исходников же понадобятся следующие программы и компонеты:

 - [Node.js & npm](https://nodejs.org/)
 - [videos.csv](https://drive.google.com/open?id=1p5ZrqKchgjv5BOdP67pwhlrfBhnTnbg9)
 - Ваш браузер
 
### Подготовка к запуску

1. `npm i`;
2. `npm run bundle`;
3. Скачанный файл `videos.csv` нужно переместить в директорию `shikicinema`;

### Загрузка временного плагина в Firefox

1. Перейдите на страницу `about:debugging`;
2. Нажмите "Загрузить временное дополнение...";
3. Выберите `manifest.json` в директории `shikicinema`;

### Загрузка временного плагина в Chrome

1. Перейдите на страницу `chrome://extensions`;
2. Включите режим разработчика;
3. Нажмите "Загрузить распакованное расширение...";
4. Выберите директорию `shikicinema`;

Готово, можно проверять работу.
