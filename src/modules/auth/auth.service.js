import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signUpTemplate } from "../../utils/htmlTemplets.js";
import cloudinary from "../../utils/cloud.js";
import { AuthRepositry } from "./auth.repositry.js";
import { sendEmail } from "../../utils/sendemails.js";
import Randomstring from 'randomstring';
import { restePassTemp } from "../../utils/htmlTemplets.js";

export class AuthService{
    constructor(){
        this.authRepositry = new AuthRepositry()
    }
    async signup(userData, file, next){
        const { name, email, password, age, phone, gender} = userData;
        const existingUser = await this.authRepositry.findUserByEmail(email);

        if(existingUser) return next(new Error("User already exists!",{cause:409}));
        const hashedPassword =  bcrypt.hashSync(password,parseInt(process.env.SALT_ROUNDS));
        const token = jwt.sign({email},process.env.TOKEN_SECRET);

        const user = await this.authRepositry.createUser({
            name,
            email,
            age,
            phone,
            gender,
            password:hashedPassword,
        })
        const confirmationlink =`http://localhost:3000/auth/activate_account/${token}`
        const messageSent = await sendEmail({to:email,subject:"Activated Account",html:signUpTemplate(confirmationlink)});
        if(!messageSent) return next(new Error("something went wrong!"))
            
        if (file) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.CLOUD_FOLDER_NAME}/users/profilpic/photos`
            });

        const profileImage = {
             url:secure_url,
              id:public_id
            };
             await this.authRepositry.savePictutre(user,profileImage)           
        };
           return user;
    }

    async activateAccount(userData){
        const { token } = userData;
        const { email } = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await this.authRepositry.activateAccount(email); 

        return user ;
           
    }

    async login(userData, next){
        const { email, password } = userData ;
        const user = await this.authRepositry.findUserByEmail(email);
        if(!user) return next(new Error("invalid Email" , {cause:404}))
        if (!user.confirmEmail) return next(new Error("You should activate your account!"));

        const match = bcrypt.compareSync(password, user.password);
        if (!match) return next(new Error("Invalid Password!"));

        let tokenString = jwt.sign({ email, id:user._id}, process.env.TOKEN_SECRET);
        const token = await this.authRepositry.createToken({ token: tokenString, user: user._id });

        return token ;
    }

    async forgetpassword(userData, next){
        const {email} = userData 
        const user = await this.authRepositry.findUserByEmail(email);
          if(!user) return next(new Error("invalid Email" , {cause:404}))

            const code =  Randomstring.generate({
            length: 6,
            charset: 'numeric'
          })
          console.log(code)

          user.code = code 
          await this.authRepositry.save(user)

          const messageSent = await sendEmail({
            to: email,
            subject:'Reset Password',
            html: restePassTemp(code),
          })
        if(!messageSent) return next(new Error("Something went Wrong"))

        return true;

    }

    async resetPassword(userData, next){
        const{email, code, password} = userData;

        const user = await this.authRepositry.findUserByEmail(email);
        if(!user) return next(new Error("invalid Email" , {cause:403}));

        if(code!== user.code) return next(new Error("Code is invalid!"));

        const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.SALT_ROUNDS))
        await this.authRepositry.updateUserPassword(user._id, hashedPassword);

        await this.authRepositry.invalidateTokensByUserId({user: user._id})
        
        return true;
    }

    async logout(token, userId, next){
        const cleanToken = token.split(process.env.BEARER_KEY)[1];

        token = await this.authRepositry.findToken(cleanToken, userId)
        if(!token) return next(new Error("Token not found or already invalid", { cause: 404 }));
        
        token.isValid = false

        await this.authRepositry.saveToken(token)

        return true ;
    }

}
