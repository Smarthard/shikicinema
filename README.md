# shikicinema

Браузерное расширение, возвращающее возможность смотреть аниме онлайн на сайте [Shikimori](https://shikimori.one), с поддержкой учета просмотра и возможностью добавления видео.

-   [FAQ](https://github.com/Smarthard/shikicinema#faq)
    -   [Почему стоит пользоваться именно Shikicinema](https://github.com/Smarthard/shikicinema#%D0%BF%D0%BE%D1%87%D0%B5%D0%BC%D1%83-%D1%81%D1%82%D0%BE%D0%B8%D1%82-%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F-%D0%B8%D0%BC%D0%B5%D0%BD%D0%BD%D0%BE-shikicinema)
    -   [Недостатки Shikicinema](https://github.com/Smarthard/shikicinema#%D0%BD%D0%B5%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%BA%D0%B8-shikicinema)
    -   [Куда загружаются видео](https://github.com/Smarthard/shikicinema#%D0%BA%D1%83%D0%B4%D0%B0-%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B6%D0%B0%D1%8E%D1%82%D1%81%D1%8F-%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE)
    -   [Какие видео можно загружать](https://github.com/Smarthard/shikicinema#%D0%BA%D0%B0%D0%BA%D0%B8%D0%B5-%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE-%D0%BC%D0%BE%D0%B6%D0%BD%D0%BE-%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B6%D0%B0%D1%82%D1%8C)
    -   [Загрузки с рейтингом Rx](https://github.com/Smarthard/shikicinema#%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8-%D1%81-%D1%80%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%D0%BE%D0%BC-rx)
    -   [Какая информация хранится на сервере о пользователях](https://github.com/Smarthard/shikicinema#%D0%BA%D0%B0%D0%BA%D0%B0%D1%8F-%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D1%85%D1%80%D0%B0%D0%BD%D0%B8%D1%82%D1%81%D1%8F-%D0%BD%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B5-%D0%BE-%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F%D1%85)
    -   [API для получения списка видео](https://github.com/Smarthard/shikicinema#api-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D1%8F-%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0-%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE)
    -   [Получение OAuth2 доступа](https://github.com/Smarthard/shikicinema#%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-oauth2-%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%B0)

-   [Дисклеймер](https://github.com/Smarthard/shikicinema#%D0%B4%D0%B8%D1%81%D0%BA%D0%BB%D0%B5%D0%B9%D0%BC%D0%B5%D1%80)

-   [Для правообладателей](https://github.com/Smarthard/shikicinema#%D0%B4%D0%BB%D1%8F-%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D0%BE%D0%B1%D0%BB%D0%B0%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%B9)

-   [Установка](https://github.com/Smarthard/shikicinema#%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0)

-   [Privacy Policy](https://github.com/Smarthard/shikicinema#privacy-policy)

## FAQ

### Сравнение Shikicinema с аналогами

|Название            |Браузеры<sup>\[1\]</sup>|Библиотека                       |Загрузка видео|Лицензия               |Сторонний аккаунт?  |Комментарии   |
|--------------------|------------------------|---------------------------------|--------------|-----------------------|--------------------|--------------|
|Shikicinema         |Firefox, Chrome         |Пополняемая: собственная, Kodik  |Есть          |Свободная, BSD 2-Clause|Не нужен            |Есть, Шикимори|
|Play Шикимори Online|Firefox, Opera          |Пополняемая: smotret-anime.online|Есть          |Свободная, GPL v3      |smotret-anime.online|Есть, Шикимори|
|PlayShiki App       |Firefox                 |Статичная:   собственная         |Нет           |Свободная, OSL 3       |Не нужен            |Нет           |
|PlaShiki            |Все                     |Пополняемая: собственная         |Есть          |Свободная, AGPL v3     |Не нужен            |Нет           |

Примечания:

1.  Указаны браузеры, для которых есть страница расширения в официальном магазине, либо работающие без расширений.


### Куда загружаются видео

На мой сервер. [Smarthard.net](https://smarthard.net).

### Какие видео можно загружать

Те, что относятся к выбранному тайтлу, т.е. содержат видео с озвучкой, субтитрами или оригиналом. Помните, что у всех есть разные ограничения по доступным сайтам. Например, Smotretanime полностью перешел на платную основу, а Myvi, как оказалось, недавно был заблокирован РКН. Лучшим из вариантов до сих пор остаётся Sibnet и Youtube.

### Загрузки с рейтингом Rx

Запретов нет, лишь бы только тайтл имел страницу на Шикимори.

### Какая информация хранится на сервере о пользователях

Прочтите [Privacy Policy](https://github.com/Smarthard/shikicinema#privacy-policy).

### API для получения списка видео

[Документация](https://smarthard.net/docs/swagger/#/Shikivideos). Пользоваться можно свободно.

### Получение OAuth2 доступа

Вам в любом случае понадобиться аккаунт на моём сервере, поэтому сначала стоит связаться со мной по почте (указана в профиле и футере Shikicinema).

## Дисклеймер

Может содержать материалы 18+.

## Для правообладателей

Shikicinema и сайт Smarthard.net не располагают физическими (или какими-либо другими) копиями предоставляемых видеоматериалов, а лишь являются агрегаторами ссылок из открытых источников, предназначенных для домашнего ознакомительного просмотра. Если Вы являетесь правообладателем или его официальным представителем и нашли материалы, нарушающие Ваши авторские права - пожалуйста, обратитесь на почтовый ящик th3smartchan@gmail.com с приложением заверенных копий документов подтвержающих ваши права.

## Установка

Если вы просто хотите воспользоваться аддоном:
[Firefox AMO](https://addons.mozilla.org/en-US/firefox/addon/shikicinema/) | [Chrome Web Store](https://chrome.google.com/webstore/detail/shikicinema/hmbjohbggdnlpmokjbholpgegcdbehjp)

Для тестирования из исходников же понадобятся следующие программы и компонеты:

-   [Node.js & npm](https://nodejs.org/)
-   [Angular CLI](https://www.npmjs.com/package/@angular/cli)
-   Ваш браузер

### Подготовка к запуску

Для полностью функциональной сборки необходимы следующие переменные окружения:

-   `KODIK_TOKEN=                 # Токен для использования Kodikapi`
-   `EPISODE_NOTIFICATION_TOKEN=  # Токен для создания уведомлений о новой серии (https://shikimori.one/api/doc/2.0/episode_notifications/create)`
-   `SHIKIVIDEOS_CLIENT_ID=       # SmarthardNet OAuth client id`
-   `SHIKIVIDEOS_CLIENT_SECRET=   # SmarthardNet OAuth client secret`
-   `SHIKIMORI_CLIENT_ID=         # Shikimori OAuth client id`
-   `SHIKIMORI_CLIENT_SECRET=     # Shikimori OAuth client secret`

1.  `npm run install-deps`;
2.  `npm run release` или `npm run bundle`;

Также можно использовать `npm run watch`, если вы активно вносите изменения в код UI.

### Загрузка временного плагина в Firefox

1.  Перейдите на страницу `about:debugging`;
2.  Нажмите "Загрузить временное дополнение...";
3.  Выберите `manifest.json` в директории `shikicinema`;

### Загрузка временного плагина в Chrome

1.  Перейдите на страницу `chrome://extensions`;
2.  Включите режим разработчика;
3.  Нажмите "Загрузить распакованное расширение...";
4.  Выберите директорию `shikicinema`;

Готово, можно проверять работу.

## Privacy Policy

-   Shikicinema __НЕ__ собирает информацию о пользователе или его действиях;

-   Shikicinema может собирать информацию о функционировании плеера для статистики __ТОЛЬКО С РАЗРЕШЕНИЯ__ пользователя;

-   Shikicinema __НЕ__ передаёт информацию о пользователях или его действиях сторонним ресурсам;

-   В Shikicinema используются два архива видео: [основной](https://smarthard.net) и база [Kodik](https://kodik.biz);
    -   Основной архив является собственностью разработчика Shikicinema;
    -   База Kodik является сторонним ресурсом;

-   Для загрузки видео в основной архив используется ID пользователя с сайта Шикимори для предотвращения случаев недобросовестного использования данной возможности;

-   Для удобства пользователя при работе с нескольких устройств используетcя браузерное API storage.sync, позволяющее синхронизироваться с Шикимори без запроса нового токена доступа;

-   На устройстве пользователя хранится информация о просмотрах серий для автоматического учета его предпочтений;

-   Пользовательские запросы к Шикимори или к архивам видео используют шифрование посредством HTTPS-соединения.
