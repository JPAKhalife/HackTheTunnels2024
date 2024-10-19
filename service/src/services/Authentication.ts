import { Ok, Err, Result } from "ts-results";
import jwt from "jsonwebtoken";
import { AccountService } from "../services";
import { JWT_SECRET } from "../config/jwt";

export const login = async (
  email: string,
  password: string,
): Promise<Result<string, Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found. You clearly are a Muggle."));
  }

  if (password !== account.password) {
    return Err(new Error("Incorrect password. Are you sure you didn't enroll at Beauxbatons?"));
  }

  const secret = JWT_SECRET;

  if (!secret) {
    return Err(new Error("JWT_SECRET not set"));
  }

  const token = jwt.sign({ data: account.email }, secret);

  return Ok(`Bearer ${token}`);
};
