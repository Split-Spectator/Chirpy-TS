import * as argon2 from "argon2";
import { JsonWebTokenError } from "jsonwebtoken";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string> {
try {
  const hash = await argon2.hash(password);
  return hash;
} catch (err) { 
   throw new Error("Hashing password failed");
}
};

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        throw new Error("Checking password failed")  
      }
}

//type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const payload = { iss: "chirpy", sub: userID, iat, exp: iat + expiresIn };
  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  const decoded = jwt.verify(tokenString, secret) as JwtPayload;
  if (!decoded.sub) throw new Error("invalid token");
  return decoded.sub;
}

