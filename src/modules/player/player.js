
import PlayerButton from './player-button';
import PlayerVideo from './player-video';
import PlayerEdit from './player-edit';
import DB from './db-functions';
import ShikiAPI from "../shikimori-api";

const storage = window.localStorage;

export default class Player {

    constructor() {

        this.hasVideos = true;
        this.episodes_watched = document.querySelector('span.current-episodes');

        this.close_button = document.createElement('button');
        this.div_player = document.createElement('div');
        this.player = new PlayerVideo();
        this.videos_list = document.createElement('ul');

        this.episode_edit = new PlayerEdit('#', {pattern: '[0-9]+'});
        this.kind_selection = document.createElement('select');
        this.author_selection = document.createElement('select');
        this.quality_selection = document.createElement('select');

        this.div_controls = document.createElement('div');
        this.prev_button = new PlayerButton(chrome.runtime.getURL('./assets/fastbackward.png'), 'Предыдущий');
        this.inc_button = new PlayerButton(chrome.runtime.getURL('./assets/check_mark.png'), 'Просмотрено');
        this.next_button = new PlayerButton(chrome.runtime.getURL('./assets/fastforward.png'), 'Следующий');


        this.init();
    }

    init() {

        ShikiAPI.isLoggedIn().then(value => {
            this.inc_button.disabled = !value;
        });

        this.div_player.id = 'shikicinema-player';
        this.div_player.classList.add('shikicinema-player-content');

        this.div_controls.id = 'shikicinema-controls';

        this.inc_button.element.id = "watched-button";

        this.close_button.textContent = '✕';
        this.close_button.classList.add('b-link_button', 'dark', 'shikimori-close-button');

        document.body.appendChild(this.div_player);
        this.div_player.appendChild(this.close_button);
        this.div_player.appendChild(this.player.element);
        this.hide();

        this.div_player.appendChild(this.kind_selection);
        this.div_player.appendChild(this.author_selection);
        this.div_player.appendChild(this.quality_selection);

        this.div_player.appendChild(this.div_controls);

        this.div_controls.appendChild(this.prev_button.element);
        this.div_controls.appendChild(this.episode_edit.element);
        this.div_controls.appendChild(this.next_button.element);
        this.div_controls.appendChild(this.inc_button.element);

        this.div_player.appendChild(this.videos_list);

        this.close_button.addEventListener('click', () => {
            this.hide();
        });

    }

    find(title) {
        DB.findAllByTitle(title).then(values => {

            this.hasVideos = true;
            this.player.setVideos(values);

            if (this.episodes_watched) {
                this.episodes_watched = parseInt(this.episodes_watched.textContent);
                this.episode_edit.getEdit().value = Math.min(this.episodes_watched + 1, this.player.getVideos().total_episodes);
            } else {
                this.episode_edit.getEdit().value = 1;
            }

            this.fillKindSelection(values);
            this.fillAuthorSelection(values);
            this.fillQualitySelection(values);

            this.episode_edit.getEdit().addEventListener('input', () => {
                this.filterAnimesAuto(values);
            });
            this.kind_selection.addEventListener('change', () => {
                let kind = this.kind_selection;

                this.filterAnimesAuto(values);
            });
            this.author_selection.addEventListener('change', () => {
                let author = this.author_selection;

                this.filterAnimesAuto(values);
            });
            this.quality_selection.addEventListener('change', () => {
                let quality = this.quality_selection;

                this.filterAnimesAuto(values);
            });


            this.next_button.element.addEventListener('click', () => {
                this.setStorageItem(this.player.current_video);

                if (this.episode_edit.getEdit().value < this.player.videos_list.total_episodes) {
                    this.episode_edit.getEdit().value++;
                    this.changeVideoToLastFav(this.filterAnimesAuto(values));
                }
            });

            this.prev_button.element.addEventListener('click', () => {
                this.setStorageItem(this.player.current_video);

                if (this.episode_edit.getEdit().value > 1) {
                    this.episode_edit.getEdit().value--;
                    this.changeVideoToLastFav(this.filterAnimesAuto(values));
                }
            });

            this.changeVideoToLastFav(this.filterAnimesAuto(values));

        }).catch(err => {
            console.error(err);
            this.hasVideos = false;
        });
    }

    changeVideoToLastFav(options) {
        try {
            const video = this.getStorageItem();
            let available = options;

            if (video.author) {
                available = this.filterAnimes(available, {author: video.author});
            }

            if (video.url) {
                available = this.filterAnimes(available, {url: video.url});
            }

            if (video.kind) {
                available = this.filterAnimes(available, {kind: video.kind});
            }

            if (available.length > 0) {
                this.player.changeVideo(available[0]);
            } else throw new Error('не найдено рекомендованных источников')
        } catch (e) {
            console.error(e);
            this.player.changeVideo(options[0]);
        } finally {
            this.filterAnimesAuto(options);
        }
    }

    filterAnimesAuto(animes) {
        let filters = {
            episode: '',
            kind: '',
            author: '',
            quality: ''
        };

        filters.episode = parseInt(this.episode_edit.getEdit().value);
        filters.kind = this.kind_selection.options[this.kind_selection.selectedIndex].value;
        filters.author = this.author_selection.options[this.author_selection.selectedIndex].value;
        filters.quality = this.quality_selection.options[this.quality_selection.selectedIndex].value;

        return this.filterAnimes(animes, filters);
    }

    filterAnimes(animes, filters) {
        const episode = filters.episode;
        const kind = filters.kind;
        const author = filters.author;
        const quality = filters.quality;
        const url = filters.url;
        const watched_button = this.inc_button.element;

        let filtered_animes = animes;

        try {
            if (episode <= this.episodes_watched && !watched_button.classList.contains('green-filter')) {
                watched_button.classList.add('green-filter');
                watched_button.disabled = true;
            } else if (episode > this.episodes_watched) {
                watched_button.classList.remove('green-filter');
                watched_button.disabled = false;
            }
        } catch (e) {
            console.error(e);
        }

        while (this.videos_list.firstChild) {
            this.videos_list.removeChild(this.videos_list.firstChild);
        }

        if (episode) {
            filtered_animes = filtered_animes.filter(anime => {
                if (!isNaN(episode)) {
                    return anime.episode == episode;
                } else {
                    return true;
                }
            });
        }

        if (kind) {
            filtered_animes = filtered_animes.filter(anime => {
                if (kind != 'Озвучка/Субтитры') {
                    return anime.kind == kind;
                } else {
                    return true;
                }
            });
        }

        if (author) {
            filtered_animes = filtered_animes.filter(anime => {
                if (author != 'Студия') {
                    return anime.author == author;
                } else {
                    return true;
                }
            });
        }

        if (quality) {
            filtered_animes = filtered_animes.filter(anime => {
                if (quality != 'Качество') {
                    return anime.quality == quality;
                } else {
                    return true;
                }
            });
        }

        if (url) {
            filtered_animes = filtered_animes.filter(anime => {
                let anime_src = Player.identifyVideoSrc(anime.url);
                let match_src = Player.identifyVideoSrc(url);

                return anime_src == match_src;
            });
        }

        filtered_animes.forEach(val => {
            let li = document.createElement('li');
            let a = document.createElement('a');
            let no_episode = val.episode;
            let title = val.title_rus;
            let quality = val.quality != 'неизвестное' ? val.quality.toLocaleUpperCase() : '';
            let source = Player.identifyVideoSrc(val.url);

            li.innerHTML = `#${no_episode} `;
            a.innerHTML = `${title} (${val.kind}: <span class="shc-author">${val.author || "неизвестно"}</span>, 
                            проигрыватель: <span class="shc-source">${source}</span>) ${quality}`;

            a.addEventListener('click', () => {
                this.player.changeVideo(val)
            });

            li.appendChild(a);
            this.videos_list.appendChild(li);
        });

        return filtered_animes;
    }

    static identifyVideoSrc(url) {
        let source;

        switch (true) {

            case /animedia/.test(url):
                source = 'Animedia';
                break;
            case /sibnet/.test(url):
                source = 'Sibnet';
                break;
            case /smotretanime/.test(url):
                source = 'SmotretAnime';
                break;
            case /sovetromanti/.test(url):
                source = 'SovetRomantica';
                break;
            case /mail.ru/.test(url):
                source = 'Mail.ru';
                break;
            case /mediafile/.test(url):
                source = 'MediaFile';
                break;
            case /ok.ru/.test(url):
                source = 'Одноклассники';
                break;
            case /vk.com/.test(url):
                source = 'Вкотакте';
                break;
            case /myvi/.test(url):
                source = 'Myvi';
                break;
            case /stormo/.test(url):
                source = 'Stromo';
                break;
            case /youtu/.test(url):
                source = 'YouTube';
                break;

            default:
                source = 'неизвестен';
        }

        return source;
    }

    getURL() {
        return window.location.toString().split('animes/')[1];
    }

    getStorageItem() {
        return JSON.parse(storage.getItem(this.getURL()));
    }

    setStorageItem(item) {
        storage.setItem(this.getURL(), JSON.stringify(item));
    }

    fillKindSelection(options) {
        let kinds = new Set(['Озвучка/Субтитры']);

        options.forEach(option => {
            kinds.add(option.kind);
        });

        kinds.forEach(kind => {
            let opt = document.createElement('option');
            opt.value = kind;
            opt.innerHTML = kind;

            this.kind_selection.appendChild(opt);
        })
    }

    fillAuthorSelection(options) {
        let authors = new Set();

        options.forEach(option => {
            if (option.author == '' || option.author == 'unknown') {
                authors.add('неизвестно');
            } else {
                authors.add(option.author);
            }
        });

        authors = Array.from(authors).sort((a, b) => a.localeCompare(b));
        authors.unshift('Студия');

        authors.forEach(author => {
            let opt = document.createElement('option');
            opt.value = author;
            opt.innerHTML = author;

            this.author_selection.appendChild(opt);
        })
    }

    fillQualitySelection(options) {
        let qualities = new Set(['Качество']);

        options.forEach(option => {
            qualities.add(option.quality != '' ? option.quality : 'неизвестное');
        });

        qualities.forEach(qual => {
            let opt = document.createElement('option');
            opt.value = qual;
            opt.innerHTML = qual;

            this.quality_selection.appendChild(opt);
        })
    }

    hide() {
        this.player.stopVideo();
        this.div_player.hidden = true;
    }

    show() {
        this.div_player.hidden = false;
    }
}
