export class ShowcaseImagesDBModel {
    public name: string;
    public image: string;
    public timestamp: string;
    public url: string;
    public type: string;
    public description: string;
    public date: string;
    public comment: string;
    public isSeed:boolean;
    public isShared: boolean;
    public hide:boolean;
    constructor(
        name: string
        , image: string
        , timestamp: string
        , url: string
        , type: string
        , description: string
        , date: string
        , comment: string
        , isSeed:boolean
        , isShared: boolean
        , hide:boolean
    ) {
        this.name = name;
        this.image = image;
        this.timestamp = timestamp;
        this.url = url;
        this.type = type;
        this.description = description;
        this.date = date;
        this.comment = comment;
        this.isSeed = isSeed;
        this.isShared = isShared; 
        this.hide = hide;
    }

}