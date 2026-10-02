import jwt from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  try {
    const verified = jwt.verify(token, secret);
    return {
      success:true,
      data:verified
    };
  } catch (error:any) {
    console.error("Token verification failed:", error);
    return{
      success:false,
      error:error.message
    };
  }
};

export const jwtUtils = {
  verifyToken,
};
