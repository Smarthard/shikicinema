
// const pvideos_list = require('./videos-list');

import VideosList from './videos-list';

export default class PlayerVideo {

    constructor() {
        this.element = document.createElement('div');
        this.video = document.createElement('iframe');
        this.videos_list = new VideosList([]);


        this.element.id = 'shikicinema-player-ratio';

        this.video.id = 'shikicinema-video';
        this.video.setAttribute('allowFullScreen', '');
        this.element.appendChild(this.video);
    }

    getVideos() {
        return this.videos_list;
    }

    setVideos(videos) {
        this.videos_list = new VideosList(videos);
    }

    changeVideo(url) {

        if (url.includes('http://')) {
            console.log(`Forcing https connection for ${url}`);

            url = url.replace('http:', 'https:');
        }

        this.video.src = url;
    }
}
