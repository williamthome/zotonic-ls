import { TplFileCompletionItemProvider } from "../tplFileCompletionItemProvider";

export class ImageCompletionItemProvider extends TplFileCompletionItemProvider {
    constructor() {
        super({
            extensions: [
                "apng",
                "gif",
                "ico",
                "cur",
                "jpg",
                "jpeg",
                "jfif",
                "pjpeg",
                "pjp",
                "png",
                "svg",
            ],
            roots: [
                ["priv", "files", "archive"],
                ["priv", "lib", "images"]
            ],
            pattern: /(?<={%\s*image(_data)?(_url)?\s*\").*?(?=")/
        });
    }
}
