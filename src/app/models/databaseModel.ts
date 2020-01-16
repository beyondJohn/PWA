import { Preferences } from './preferencesModel';
import { People } from './peopleModel';
import { ImagesDBModel } from './showcaseDbModel';
export class Database {
    public preferences: Preferences;
    public people: People;
    public imagesDb: ImagesDBModel[];
    constructor(
        preferences: Preferences,
        people: People,
        imagesDb: ImagesDBModel[]
    ) {
        this.preferences = preferences;
        this.people = people;
        this.imagesDb = imagesDb
    }
}