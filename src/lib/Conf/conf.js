

const conf = {
    Url : String(import.meta.env.VITE_APPWRITE_URL),
    ProjectId : String(import.meta.env.VITE_APPWRITE_PROJECTID),
    BucketId : String(import.meta.env.VITE_APPWRITE_BUCKETID),
    DatabaseId : String(import.meta.env.VITE_APPWRITE_DATABASEID),
    UserId : String(import.meta.env.VITE_APPWRITE_USER_COLLECTIONID),
    PostId : String(import.meta.env.VITE_APPWRITE_POST_COLLECTIONID),
    SaveId : String(import.meta.env.VITE_APPWRITE_SAVE_COLLECTIONID),
}

export default conf