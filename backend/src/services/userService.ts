import { User } from "../models/user";
import * as auth from "../utils/authUtils";
import type { UserAttributes, UserCreationAttributes } from "../models/user";

interface UserPerms {
  uploadPerm: boolean;
  downloadPerm: boolean;
  searchPerm: boolean;
  adminPerm: boolean;
}

class UserService {
  /**
   * Creates a new user in the database
   * @param user: UserCreationAttributes (see models/user.ts)
   * @returns undefined if successful, Error if failed
   */
  public async createUser(user: UserCreationAttributes): Promise<undefined> {
    /* TODO: Check for "strong" password */
    const hashedPassword = await auth.hashPassword(user.password);
    user.password = hashedPassword;
    try {
      await User.create(user);
      return;
    } catch (err) {
      throw new Error("Failed to create user: " + err);
    }
  }

  /**
   * Deletes a user from the database
   * @param username: string
   * @returns undefined if successful, Error if failed
   */
  public async deleteUser(username: string): Promise<undefined> {
    const user = await this.getUser(username);
    if (user) {
      await User.destroy({ where: { ID: user.ID } });
      return;
    }
    throw new Error("User not found");
  }

  /**
   * Gets a user by username from the database
   * @param username: string
   * @returns UserCreationAttributes (see models/user.ts), null if user not found
   */
  public async getUser(username: string): Promise<UserAttributes | null> {
    return await User.findOne({ where: { username: username } });
  }

  /**
   * Verifies a user's password
   * @param username: string
   * @param password: string
   * @returns true if user is verified, false if not, Error if user not found
   */
  public async verifyUser(username: string, password: string): Promise<boolean> {
    const user = await this.getUser(username);
    return user ? await auth.comparePassword(password, user.password) : false;
  }

  /**
   * Generates a JWT token for a user
   * @param username: string
   * @returns JWT token if user is verified, Error if user not found
   */
  public async generateToken(username: string): Promise<string> {
    const user = await this.getUser(username);
    if (!user) {
      throw new Error("User not found");
    }
    await User.update({ tokenUses: 1000 }, { where: { ID: user.ID } });
    return await auth.generateToken(username);
  }

  /**
   * Verifies a JWT token
   * @param token: string
   * @returns username if token is verified, Error if token is invalid or user not found
   */
  public async verifyToken(token: string): Promise<string> {
    try {
      const username = await auth.verifyToken(token);
      const user = await this.getUser(username);
      if (user) {
        if (user.tokenUses > 0) {
          await User.update({ tokenUses: user.tokenUses - 1 }, { where: { ID: user.ID } }); // TODO: Potential Race Condition
          return username;
        } else {
          throw new Error("Token uses exceeded");
        }
      }
    } catch (err) {
      throw new Error("Invalid token");
    }
    throw new Error("User not found");
  }

  /**
   * Get a user's group
   * @param username: string
   * @returns string if user is found, Error if user not found
   */
  public async getUserGroup(username: string): Promise<string> {
    const user = await this.getUser(username);
    if (user) {
      return user.userGroup;
    }
    throw new Error("User not found");
  }

  /**
   * Get a user's permissions
   * @param username: string
   * @returns UserPerms if user is found, Error if user not found
   */
  public async getUserPerms(username: string): Promise<UserPerms> {
    const user = await this.getUser(username);
    if (user) {
      return {
        uploadPerm: user.uploadPerm,
        downloadPerm: user.downloadPerm,
        searchPerm: user.searchPerm,
        adminPerm: user.adminPerm
      };
    }
    throw new Error("User not found");
  }
}

export default new UserService();