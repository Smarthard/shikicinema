export default class VideosList {

    constructor(videos) {
        this.videos = [];
        this.total_episodes = 0;

        if (videos) {
            if (videos.length > 0) {
                let episodes = videos.map(video => video.episode);

                this.videos = videos;
                this.total_episodes = Math.max.apply(null, episodes);
            }
        }
    }
}
