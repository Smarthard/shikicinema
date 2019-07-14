export default class VideosList {

    constructor(videos) {
        this.videos = new Set([]);

        if (videos && videos.length > 0) {
                this.videos = new Set(videos);
        }
    }
}
