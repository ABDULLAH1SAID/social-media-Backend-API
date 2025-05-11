import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
import logger from "../utils/logger.js";
class AuthService{
constructor() {
    if (AuthService.instance) return AuthService.instance;
    AuthService.instance = this;

    this.secret = process.env.TOKEN_SECRET;
    this.prefix = process.env.BEARER_KEY;
  }
  extractToken(headerToken) {
    if (!headerToken || !headerToken.startsWith(this.prefix)) {
      logger.error("Missing or invalid token prefix.");
      throw new Error("Valid token is required!");
    }
    return headerToken.split(this.prefix)[1];
  }

  async verifyToken(token) {
    try{
    const payload = jwt.verify(token, this.secret);

    const tokenDB = await Token.findOne({ token, isValid: true });
    if (!tokenDB) {
      logger.info("Token extracted successfully.");
      throw new Error("Token is invalid!");
    }

    const user = await User.findById(payload.id);
    if (!user){
      logger.warn(`User not found with ID: ${payload.id}`);
      throw new Error("User not found!");
    } 
    logger.info(`User authenticated: ${user.email || user._id}`);
    return user;
  }
  catch(error){

    logger.error(`Token verification failed: ${error.message}`);
    throw error;
  }

  }
}
export const authService = new AuthService();