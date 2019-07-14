import axios from "axios";

export default class DB {

    static findAllByTitle(name, episode) {
        return axios.get(new URL(`https://smarthard.net/api/shikivideos/search?title=${name}&episode=${episode}&limit=all`).toString())
            .then(response => {
                let data = response.data;

                if (data.length > 0) {
                    data = data.sort((a, b) => {
                        let compare = 0;

                        try {
                            compare = a.episode - b.episode;
                        } catch (e) {
                            compare = 0;
                        }

                        return compare;
                    });
                }

                return data;
            });
    }

    static getAnimeLength(anime_id) {
        return axios.get(new URL(`https://smarthard.net/api/shikivideos/${anime_id}/length`).toString())
            .then(response => {
                return response.data.length;
            })
    }
}
