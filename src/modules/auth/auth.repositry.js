import { Token } from "../../../DB/models/token.model.js";
import { User } from "../../../DB/models/user.model.js";

export class AuthRepositry{
    async findUserByEmail(email){
        return await User.findOne({email})
    }
    async createUser(userData){
        return await User.create(userData)
    }
    async save(user){
        return await user.save()
    }
    async savePictutre(user, profileImage){

        user.profileImage = profileImage
        return user.save();
    }

    async activateAccount(email){
        return await User.findOneAndUpdate(
            {email},
            { confirmEmail: true },
            { new: true }
        );
    }

    async createToken(tokenData){
        return await Token.create(tokenData)
    }
    
    async updateUserPassword(userId, hashedPassword) {
        return await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true });
    }

    async invalidateTokensByUserId(userId) {
        const tokens = await Token.find(userId);
        for (const token of tokens) {
            token.isValid = false;
            await token.save();
        }
    }

    async findToken(cleanToken, userId) {
        return await Token.findOne({
          token: cleanToken,
          user: userId,
          isValid: true
        });
      }

    async saveToken(token){
        return await token.save()
    }

}
