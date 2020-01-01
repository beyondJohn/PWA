export const directory = {
    "name": "meBloggyPWA"
    , "version": "1.0"
    , "published": "1/1/2020"
    , "tiers": [
        {
            "type": "Angular 8 Application"
            , "directory": "meBloggySecure"
            , "port": 5554
            , "description": "This is the top teir of the teirs. The app in this teir is is user facing."
        }
        ,{
            "type": "Node.js"
            , "directory": "MeBloggyAPI"
            , "port": 4111
            , "description": "This teir contains the majority of meBloggy's business logic. This business logic includes account creation and a JSON file based db used to store references to uploaded content."
        }
    ]
}