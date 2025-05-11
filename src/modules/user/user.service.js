import moment from 'moment';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utils/sendemails.js"
import { recoverAccountTemplate } from "../../utils/htmlTemplets.js";
import cloudinary from"../../utils/cloud.js";

export class UserService{
    constructor(userRepository){
        this.userRepository= userRepository
    }

    async getUserProfile(userId,next){
        const user = await this.userRepository.findById(userId,'-password');
        if(!user){
         return next(new Error("user not found!",{cause:404}));
        }
        return user ;
    }

    async updateUserProfile(userId,{name, phone, headline}, next){
        const user = await this.userRepository.findByIdAndUpdate(userId,
                {name, phone, headline},
                { new: true }).select("name phone headline -_id");
        return user
    }

    async deleteUserProfile(userId, protocol, host, next) {
        const user = await this.userRepository.findByIdAndUpdate(
              userId,
              { isDeleted: true },
              { new: true }
        ).select('name email isDeleted permanentlyDeleted');
        
        if (!user) {
            return next(new Error("user not found!",{cause:404}));
        }

        user.permanentlyDeleted = moment().add(1, 'month').toDate();
        await this.userRepository.save(user);
        const token = jwt.sign(
          { email: user.email }, 
          process.env.TOKEN_SECRET,  
          { expiresIn: '30d' } 
        );

        const recoverLink = protocol + '://' + host + '/user/recovery/' + token;
        const messageSent = await sendEmail({
          to: user.email,
          subject: 'Recover your account',
          html: recoverAccountTemplate(user.name, recoverLink)
        });
        
        if (!messageSent) {
            return next(new Error("Failed to send recovery email", { cause: 500 }));
        }
        return user;
      }

      
    async recoverUserProfile(token, next){
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await this.userRepository.findOne({email:decoded.email})
        if (!user) {
            return next(new Error("Email is no longer exist, you need to register a new account", { cause: 410 }));
            }
            
        if (!user.isDeleted) {
            return next(new Error("You already recovered your account", { cause: 410 }));
            }
        user.isDeleted = false;
        user.permanentlyDeleted = undefined;    
        await this.userRepository.save(user)

        return user;
    }

    async getUserConnectionService(userId, next){
        const user = await this.userRepository.findByIdWithConnections(userId)
        if (!user) {
          return next(new Error("User not found!", { cause: 404 }));
        }
        return user ;

    }

    async sendConnectionRequestService(requestedUserId, currentUserId, next){

        const user = await this.userRepository.findById(requestedUserId);
    
        if (!user) {
          return next(new Error('User Id is not Exist', {cause:400}));
         }
    
        if (currentUserId.equals(requestedUserId)) {
            return next (new Error('you cannot request a connection to your self',{cause:400}));
        } 
        if (user.connections.requested.includes(currentUserId)) {
          return next (new Error('Requested connection has already been sent to the user',{ cause: 410 }));
        }
        await this.userRepository.addToRequest(requestedUserId, currentUserId);

        return true;
   }
   
   async acceptRequestService(requestedUserId, currentUserId, next){
    const requesterUser = await this.userRepository.findById(requestedUserId)
      if(!requesterUser){
        return next(new Error('User Id is not Exist',{cause:404}))
      }
      const user = await this.userRepository.findById(currentUserId)
      const index = user.connections.requested.indexOf(requesterUser._id);
      if (index === -1) {
        return next(new Error('user ID is not found in Requested connections', { cause: 404 }));
      }
      user.connections.requested.splice(index, 1);
      user.connections.accepted.push(requesterUser._id);
      await this.userRepository.save(user);
      requesterUser.connections.accepted.push(currentUserId);
      await this.userRepository.save(requesterUser);
    
      const updatedUser = await this.userRepository.findByIdWithConnections(currentUserId)

      return updatedUser
   }

  async rejectConnectionService(requestedUserId, currentUserId, next){
    const user = await this.userRepository.findById(currentUserId);

    if (!user.connections.requested.includes(requestedUserId)) {
      return next(new Error('Connection request not found', {cause: 404}));  
      }
      await this.userRepository.removeFromRequested(currentUserId, requestedUserId);

    return true;

  }

  async removeConnection(connectionId, userId, next) {
    const targetUser = await this.userRepository.findById(connectionId);

    if (!targetUser) {
      return next(new Error("Target user not found", { cause: 404 }));
    }

    const user =await this.userRepository.findById(userId);
    if (!user) {
      return next(new Error("Something went wrong", { cause: 404 }));
    }

    if (!user.connections.accepted.includes(connectionId)) {
       return next(new Error("User is not a friend", { cause: 404 }));
    }
  
    if (!targetUser.connections.accepted.includes(userId)) {
      return next(new Error("User is not a friend", { cause: 404 }));
    }
    await this.userRepository.updateConnection(userId, connectionId, 'pull');
    await this.userRepository.updateConnection(connectionId, userId, 'pull');

    const updatedUser = await this.userRepository.findByIdWithConnections(userId);

    return updatedUser
    
  }

  async uploadProfileImage(userId,file,next){
    if(!file){
      return next(new Error("No file uploaded!", { cause: 400 }));
    }
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return next(new Error("User not found!", { cause: 404 }));
    }
    
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      {folder:`${process.env.CLOUD_FOLDER_NAME}/users/profilpic/photos`}
    );


    if (user.profileImage && user.profileImage.id) {
      await cloudinary.uploader.destroy(user.profileImage.id);
    }

    const profileImage = {
      url: secure_url,
      id: public_id
    };
    
    const updatedUser = await this.userRepository.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    ).select("nam email profileImage.url")  
    return updatedUser;
  }

  async deleteProfileImage(userId, next){
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return next(new Error("User not found!", { cause: 404 }));
    }

    if (!user.profileImage || !user.profileImage.id) {
      return next(new Error("No profile image found to delete", { cause: 404 }));
    }

    await cloudinary.uploader.destroy(user.profileImage.id);

    const updatedUser = await this.userRepository.findByIdAndUpdate(
      userId,
      { $unset: { profileImage: 1 } }, 
      { new: true }
    ).select("name email");

    return updatedUser;
  }
}
