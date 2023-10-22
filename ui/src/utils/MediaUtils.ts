export class MediaUtils {
    public static getUrlType(url: string): "file" | "image" | "video" | null {
        if (/^data:(.*?);base64,/.test(url)) {
            return "file";
        } else if (/^blob:(.*?)/.test(url)) {
            return "file";
        } else if (/\.(jpeg|jpg|gif|png|tiff|bmp)$/i.test(url)) {
            return "image";
        } else if (/\.(mp4|mkv|flv|webm|avi|mov)$/i.test(url)) {
            return "video";
        } else {
            return null;
        }
    }
}