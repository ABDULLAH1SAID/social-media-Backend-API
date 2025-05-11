
import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from './../servicies/aurhservice.js';

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const headerToken = req.headers["token"];
  const token = authService.extractToken(headerToken);

  const user = await authService.verifyToken(token);

  req.user = user;
  return next();
});









