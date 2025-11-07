import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, getApiKey } from "./src/handlers/auth";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let hash2: string;
  
    beforeAll(async () => {
      hash1 = await hashPassword(password1);
      hash2 = await hashPassword(password2);
    });
  
    it("should return true for the correct password", async () => {
      const result = await checkPasswordHash(password1, hash1);
      expect(result).toBe(true);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password2, hash2);
        expect(result).toBe(true);
      });
  });
  

describe("JWT make and verify", () => {
    const userID_A = "12345";
    const secret_A = "somerandomtexttotestJWT"
    const userID_B = "678E198E963";
    const secret_B = "someotherrandomextforcheckingJWTfunctions"
    let jwtCheck1: string;
    let jwtCheck2: string;

    beforeAll(async () => {
        jwtCheck1 = await makeJWT(userID_A, secret_A);
        jwtCheck2 = await makeJWT(userID_B, secret_B)
    })

    it("should return userID from the JWT", async () => {
        const result = await validateJWT(jwtCheck1 , secret_A);
        expect(result).toBe(userID_A);
      });

    it("should return userID from the JWT", async () => {
        const result = await validateJWT(jwtCheck2 , secret_B);
        expect(result).toBe(userID_B);
      });
});


describe("Get API Key from Request", () => {
  const RequestA = { headers: { authorization: "ApiKey THE_KEY_HERE" } };
  const RequestB = { headers: { authorization: "ApiKey 561868198190849404198049089018949800984" } } 

  it("should extract api key from request", async () => {
    const result = await getApiKey(RequestA);
    expect(result).toBe("THE_KEY_HERE");
  });

  it("should return true for the correct password", async () => {
      const result = await getApiKey(RequestB);
      expect(result).toBe("561868198190849404198049089018949800984");
    });
});