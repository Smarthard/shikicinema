export default class DB {

    static findAllByTitle(name) {
        return new Promise((resolve, reject) => {
            let rawFile = new XMLHttpRequest();
            let entries = [];

            rawFile.open("GET", chrome.extension.getURL('videos.csv'), true);
            rawFile.onreadystatechange = () => {
                if (rawFile.readyState === 4) {
                    if (rawFile.status === 200 || rawFile.status === 0) {
                        let allText = rawFile.responseText;

                        allText.split("\n").forEach(str => {
                            if (str.includes(`;${name};`)) {
                                let entry = DB.parseCSVString(str);
                                entry.src = entry.url.replace('http:', 'https:');

                                entries.push(entry);
                            }
                        });

                        if (entries.length > 0) {
                            resolve(entries.sort((a, b) => a.episode - b.episode));
                        } else {
                            reject([]);
                        }
                    } else {
                        reject([]);
                    }
                }
            };

            rawFile.send(null);
        });
    }

    static parseCSVString(str) {
        const fields = ['id', 'url', 'anime_id', 'title_eng', 'title_rus', 'episode', 'kind', 'language', 'quality', 'author'];

        let parsedString = {};
        let values = str.split(";");

        for (let i = 0; i < 10; i++) {
            parsedString[fields[i]] = values[i]
        }

        return parsedString;
    }

}
