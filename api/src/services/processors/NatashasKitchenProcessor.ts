import cheerio from "cheerio";

export class NatashasKitchenProcessor {
    public extractRelevantHtml(html: string) {
        const $ = cheerio.load(html);
        return $('div.wprm-recipe-container').contents().text() || "";
    }
}