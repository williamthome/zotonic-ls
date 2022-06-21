import { FileSnippetProvider } from "../../file-provider";

export class TagImageSnippetProvider extends FileSnippetProvider {
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
            pattern: /(?<={%\s*image(_data)?(_url)?\s*\").*?(?=")/,
            filenameRegExp(rootsEscaped: string) {
                return new RegExp(`(?<=\\/(${rootsEscaped})\\/).*`);
            },
            transformSnippet(snippet) {
                snippet.description = "A image file located at '<apps|apps_user>/<module>/priv/(files/archives|lib/images)'.";
                return snippet;
            },
        });
    }
}
