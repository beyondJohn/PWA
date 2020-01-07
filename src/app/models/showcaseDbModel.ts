export class ShowcaseImagesDBModel {
    public name: string;
    public image: string;
    public timestamp: string;
    public url: string;
    public type: string;
    public description: string;
    public date: string;
    public comment: string;
    constructor(
        name: string
        , image: string
        , timestamp: string
        , url: string
        , type: string
        , description: string
        , date: string, comment: string
    ) {
        this.name = name;
        this.image = image;
        this.timestamp = timestamp;
        this.url = url;
        this.type = type;
        this.description = description;
        this.date = date;
        this.comment = comment;
    }

}