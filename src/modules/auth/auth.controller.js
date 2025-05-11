import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthService } from "./auth.service.js";
export class AuthController{
  constructor(){
    this.authService = new AuthService();
  }
  signup = asyncHandler(async (req, res, next) => {
    const user = await this.authService.signup(req.body, req.file, next)
    return res.status(201).json({success:true, message:"Check your email!",results:user})
  }); 
  
  activateAccount = asyncHandler(async (req, res, next) => {
    const user = await this.authService.activateAccount(req.params)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(201).json({ success: true, message: "Account activated, try to login!" });
});

  login = asyncHandler(async (req, res, next) => {

    const token = await this.authService.login(req.body, next)

    return res.status(200).json({ success: true, message: "Login successfully", token });
});

 forgetpassword = asyncHandler(async(req, res, next)=>{
  await this.authService.forgetpassword(req.body, next)
  return res.json({success:true , message:"Check your email"})
}); 

 resetpassword = asyncHandler(async(req, res, next)=>{
  await this.authService.resetPassword(req.body, next);

  return res.json({success:true,message:"try to login again!"})
})

  logout = asyncHandler(async (req, res, next) => {

  let token = req.headers["token"];
  await this.authService.logout(token, req.user._id, next)
   
  return res.status(200).json({ success: true, message: "Logged out successfully" });  
})}