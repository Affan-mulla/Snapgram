import conf from "../Conf/conf";
import { Client, Account, ID, Avatars, Databases, Storage, Query } from "appwrite";

export class AuthService {
    client = new Client();
    account;
    databases;
    storage;
    avatars;

    constructor() {

        this.createPost = this.createPost.bind(this);
        this.client
            .setEndpoint(conf.Url)
            .setProject(conf.ProjectId);

        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        this.avatars = new Avatars(this.client);
    }

    async createAccount({ email, password, name , username}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name, username);
            if (!userAccount) throw new Error("Account creation failed.");

            const avatarUrl = this.avatars.getInitials(name);
            const newUser = await this.saveUserToDB({
                account: userAccount.$id, // Assuming you want to store the user ID
                email,
                name,
                avatarUrl,
                username, // If username is meant to be the same as name
            });

            return newUser;

        } catch (error) {
            throw error;
        }
    }

    async saveUserToDB({ account, email, name, avatarUrl, username }) {
        try {
            return await this.databases.createDocument(
                conf.DatabaseId,
                conf.UserId, // Ensure this is CollectionId, not ProjectId
                ID.unique(),
                {
                    username,
                    email,
                    accountid: account,
                    name,
                    imageUrl:avatarUrl,
                }
            );
        } catch (error) {
            throw new Error("Failed to save user to database: " + error.message);
        }
    }

    async SignInAccount({email,password}) {
        try {
            const session = await this.account.createEmailPasswordSession(email,password)
            return session;
        } catch (error) {
            console.log(error);
            
        }
    }

    async getCurrentUser() {
        try {
            const currentAccount = await this.account.get();
            if (!currentAccount) {
                throw error;
            }

            const currentUser = await this.databases.listDocuments(
                conf.DatabaseId,
                conf.UserId,
                [Query.equal('accountid',currentAccount.$id )]
            )

            if(!currentUser) throw error;

            return currentUser.documents[0];
        } catch (error) {
            console.log(error);
            
        }
    }

    async signOutAccount() {
        try {
            const session = await this.account.deleteSession("current");
            return session;
        } catch (error) {
            console.log(error);
            
        }
    }

    async createPost({userId, caption, file, location, tags}){
        try {

            //upload image 
            const uploadedFile = await this.uploadFile(file[0])
            
            if (!uploadedFile) throw error;

            //get file url
            const fileUrl = await this.getFilePreview(uploadedFile.$id);
            
            if (!fileUrl) {
                this.deleteFile(uploadedFile.$id)
                throw error
            }

            //convert tags in an array
            const tag = tags?.replace(/ /g,'').split(',') || [];

            //save post to DB
          
            
            const newPost = await this.databases.createDocument(
                conf.DatabaseId,
                conf.PostId,
                ID.unique(),
                {
                    creator : userId,
                    caption: caption,
                    imageUrl : fileUrl,
                    imageId : uploadedFile.$id,
                    location : location,
                    tags : tag
                }
            )
            

            if (!newPost) {
                await this.deleteFile(uploadedFile.$id)
                throw error
            }

        } catch (error) {
            console.log(error);
            
        }
    }

    async uploadFile(file) {
        try {
            const uploadedFile = await this.storage.createFile(
                conf.BucketId,
                ID.unique(),
                file
            )

            return uploadedFile;
        } catch (error) {
            console.log(error);
            
        }
    }

    async getFilePreview(fileId) {
        try {
            const fileUrl = this.storage.getFilePreview(
                conf.BucketId,
                fileId,
                2000,
                2000,
                "top",
                100,
            )
            
            return fileUrl;
        } catch (error) {
            console.log(error);
            
        }
    }

    async deleteFile(fileId){
        try {
            await this.storage.deleteFile(
                conf.BucketId,
                fileId
            )

            return {status : 'OK'}
        } catch (error) {
            console.log(error);
            
        }
    }

    async getRecentPost() {
        const posts = await this.databases.listDocuments(
            conf.DatabaseId,
            conf.PostId,
            [Query.orderDesc('$createdAt', Query.limit(20))]
        )

        if (!posts) {
            throw error
        }
        
        return posts;
    }

    async likePost({postId, likesArray}) {
        try {
            
            const updatePost = await this.databases.updateDocument(
                conf.DatabaseId,
                conf.PostId,
                postId,
                {
                    like : likesArray
                }
            )

            if (!updatePost) {
                throw error;
            }

            return updatePost;
        } catch (error) {
            console.log(error);
            
        }
    }

    async savePost({postId, userId}) {
        try {
            const updatePost = await this.databases.createDocument(
                conf.DatabaseId,
                conf.SaveId,
                ID.unique(),
                {
                    user : userId,
                    post : postId
                }
            )

            if (!updatePost) {
                throw error;
            }

            return updatePost;
        } catch (error) {
            console.log(error);
            
        }
    }


    async deleteSavePost(savedRecordId) {
        try {
            const statusCode = await this.databases.deleteDocument(
                conf.DatabaseId,
                conf.SaveId,
                savedRecordId,
                
            )

            if (!statusCode) {
                throw error;
            }

            return {status : 'OK'};
        } catch (error) {
            console.log(error);
            
        }
    }

    async getPostById(postId) {
        try {
            const post = await this.databases.getDocument(
                conf.DatabaseId,
                conf.PostId,
                postId
            )

            return post;
        } catch (error) {
            console.log(error);
            
        }
    }

    async updatePost({postId, caption, file, location, tags, imageId, imageUrl}){

        const hasFileToUpdate  =  file.length > 0;
        try {

            let image = {
                imageUrl : imageUrl,
                imageId: imageId,
            }

            if (hasFileToUpdate) { 
                const uploadedFile = await this.uploadFile(file[0])
                if(!uploadedFile) throw error;

                const fileUrl = await this.getFilePreview(uploadedFile.$id)

                console.log({fileUrl});

                if (!fileUrl) {
                    this.deleteFile(uploadedFile.$id)
                    throw error
                }
                
                image = { imageUrl : fileUrl, imageId : uploadedFile.$id}


            }

            //convert tags in an array
            const tag = tags?.replace(/ /g,'').split(',') || [];

            //save post to DB
          
            
            const updatedPost = await this.databases.updateDocument(
                conf.DatabaseId,
                conf.PostId,
                postId,
                {
                    caption: caption,
                    imageUrl : image.imageUrl,
                    imageId : image.imageId,
                    location : location,
                    tags : tag
                }
            )
            

            if (!updatedPost) {
                await this.deleteFile(imageId)
                throw error
            }

            return updatedPost;

        } catch (error) {
            console.log(error);
            
        }

       
    }

    async deletePost({postId, imageId}){
        if (!postId || !imageId) {
            throw error;
        }

        try {
            await this.databases.deleteDocument(
                conf.DatabaseId,
                conf.PostId,
                postId
            )

            return {status : "ok"}
        } catch (error) {
            console.log(error);
            
        }
    }

    async getInfinitePost({ pageParam }) {
        const queries = [Query.orderDesc('$createdAt'), Query.limit(9)];
      
        if (pageParam) {
          queries.push(Query.cursorAfter(pageParam.toString()));
        }
      
        try {
          const posts = await this.databases.listDocuments(
            conf.DatabaseId,
            conf.PostId,
            queries
          );
          if (!posts) throw new Error("No posts found");
          return posts;
        } catch (error) {
          console.log(error);
          throw error;  // Ensure error is propagated
        }
      }

    async searchPost(searchTerm) {
        try {
            
            const posts = await this.databases.listDocuments(
                conf.DatabaseId,
                conf.PostId,
                [Query.search('caption', searchTerm)]
            )
            if (!posts) throw error;
            

            return posts;
        } catch (error) {
            console.log(error);
            
        }
    }

    async getUserById(id) {
        try {
            const UserDetails = await this.databases.getDocument(
                conf.DatabaseId,
                conf.UserId,
                id
            )

            if (!UserDetails) {
                throw error;
            }
            return UserDetails
        } catch (error) {
            console.log(error);
            
        }
    }

    
    async updateUserProfile({userId, bio, file, imageUrl,username, name, email}){

        const hasFileToUpdate  =  file.length > 0;
        try {

            let image = {
                imageUrl : imageUrl,

            }

            if (hasFileToUpdate) { 
                const uploadedFile = await this.uploadFile(file[0])
                if(!uploadedFile) throw error;

                const fileUrl = await this.getFilePreview(uploadedFile.$id)

                console.log({fileUrl});

                if (!fileUrl) {
                    this.deleteFile(uploadedFile.$id)
                    throw error
                }
                
                image = { imageUrl : fileUrl}


            }
          
            
            const updatedPost = await this.databases.updateDocument(
                conf.DatabaseId,
                conf.UserId,
                userId,
                {
                    bio: bio,
                    imageUrl : image.imageUrl,
                    username : username,
                    name : name,
                    email: email,
                }
            )
            

            if (!updatedPost) {
                await this.deleteFile(imageId)
                throw error
            }

            return updatedPost;

        } catch (error) {
            console.log(error);
            
        }

       
    }

    async savedPost({userId}) {
        
        try {
            const saved = await this.databases.listDocuments(
                conf.DatabaseId,
                conf.SaveId,
                [Query.equal('user',userId)]
            )
            if (!saved) {
                throw error
            }
            const savedArr = [];
            
            for (const post of saved.documents) {
                savedArr.push(post.post);
            }
            
            
            
            return savedArr.reverse()
        } catch (error) {
            console.log(error);
            
        }
    }

    async allUsers() {
       
        try {
            const currentAccount = await this.getCurrentUser()
            if(!currentAccount) throw error

            const users = await this.databases.listDocuments(
                conf.DatabaseId,
                conf.UserId,
                [Query.limit(10),
                Query.notEqual('$id',currentAccount.$id)
                ],
            )

            if (!users) throw error
         
            return [users.documents, currentAccount.$id];
        } catch (error) {
            console.log(error);
            
        }
    }

    async toggleFollow({ followId, followerId }) {

    
        try {
            // Fetch current followings and followers
            const followingsDoc = await this.databases.getDocument(
                conf.DatabaseId,
                conf.UserId,
                followId
            );
    
            const followerDoc = await this.databases.getDocument(
                conf.DatabaseId,
                conf.UserId,
                followerId
            );
    
            const isFollowing = followingsDoc.following.includes(followerId);
    
            if (isFollowing) {
                // User is already being followed, so unfollow
                const updatedFollowing = followingsDoc.following.filter(id => id !== followerId);
                const updatedFollower = followerDoc.follower.filter(id => id !== followId);
    
                // Update followings and followers
                await this.databases.updateDocument(
                    conf.DatabaseId,
                    conf.UserId,
                    followId,
                    {
                        following: updatedFollowing
                    }
                );
    
                await this.databases.updateDocument(
                    conf.DatabaseId,
                    conf.UserId,
                    followerId,
                    {
                        follower: updatedFollower
                    }
                );
    
                console.log("Unfollowed successfully");
                return { following: updatedFollowing, follower: updatedFollower };
    
            } else {
                // User is not being followed, so follow
                const updatedFollowing = [...followingsDoc.following, followerId];
                const updatedFollower = [...followerDoc.follower, followId];
                
                // Update followings and followers
                await this.databases.updateDocument(
                    conf.DatabaseId,
                    conf.UserId,
                    followId,
                    {
                        following: updatedFollowing
                    }
                );
    
                await this.databases.updateDocument(
                    conf.DatabaseId,
                    conf.UserId,
                    followerId,
                    {
                        follower: updatedFollower
                    }
                );
    
                console.log("Followed successfully");
                return { following: updatedFollowing, follower: updatedFollower };
            }
    
            // return { following: updatedFollowing, follower: updatedFollower };
    
        } catch (error) {
            console.log(error);
        }
    }

    async searchUsers(username) {
        console.log(username);
        
        try {
            const searchedUsers = await this.databases.listDocuments(
                conf.DatabaseId,
                conf.UserId,
                [Query.search('username', username)]
            )
            if (!searchedUsers) throw error
            console.log(searchedUsers);
            
            return searchedUsers
        } catch (error) {
            console.log(error);
            
        }
    }    
   
    
}

const authService = new AuthService();
export default authService;
