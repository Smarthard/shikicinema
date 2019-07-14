
import VideosList from './videos-list';

export default class PlayerVideo {

    constructor() {
        this.element = document.createElement('div');
        this.video = document.createElement('iframe');
        this.videos_list = new VideosList([]);


        this.element.id = 'shikicinema-player-ratio';

        this.video.id = 'shikicinema-video';
        this.video.setAttribute('allowFullScreen', '');
        this.current_video = null;
        this.element.appendChild(this.video);
    }

    addVideos(videos) {
        videos.forEach(vid => this.videos_list.videos.add(vid));
    }

    getVideos() {
        return this.videos_list;
    }

    setVideos(videos) {
        this.videos_list = new VideosList(videos);
    }

    changeVideo(video) {
        let url = video.url;
        this.current_video = video;

        if (url.includes('http://')) {
            console.log(`Forcing https connection for ${url}`);

            url = url.replace('http:', 'https:');
        }

        this.video.src = url;
    }

    stopVideo() {
        this.video.src = this.video.src;
    }
}
