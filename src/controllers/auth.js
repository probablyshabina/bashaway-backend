import asyncHandler from "../middleware/async"
import {authRegister, authLogin, updateVerify} from "../services/auth"
import {makeResponse} from "../utils/response"
import {sendTokenResponse} from "../utils/jwt";

export const register = asyncHandler(async (req, res) => {
    const result = await authRegister(req.body);
    if (!result) return makeResponse({ res, status: 500, message: "Failed to register user" });
    if (result.status) return makeResponse({ res, ...result });
    return makeResponse({ res, message: "User created successfully" });
});

export const login = asyncHandler(async (req, res) => {
    const user = await authLogin(req.body);
    if (!user) return makeResponse({ res, status: 401, message: "Invalid email or password" })
    if (!user.is_verified) return makeResponse({ res, status: 401, message: "Account not verified. Please check your email" });
    if (!user.is_active) return makeResponse({ res, status: 401, message: "Your account has been deactivated. Please contact a bashaway administrator to resolve it" });
    return sendTokenResponse(res, user, "User logged in successfully")
});

export const verifySuccess = asyncHandler(async(req, res, next) => {
    const verification_code = req.params.id;
    const user = await updateVerify(verification_code);
    if (user) return makeResponse({res, user, message:"User verified successfully"});
    return makeResponse({res, status: 401, message:"Invalid verification code"});
})

export const logout = asyncHandler(async(req, res, next) => {})

export const logout = asyncHandler(async (req, res, next) => { })

export const current = asyncHandler(async (req, res, next) => { })
