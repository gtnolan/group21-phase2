import sequelize from "./db";
import { Package } from "./models/package";
import { Version } from "./models/version";
import UserService from "./services/userService";
import router from "./app";
import express from "express";

const app = express();
app.use(express.json());
app.use(router);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

sequelize.sync({ force: true })
  .then(async () => {
    const defaultCreated = await UserService.createUser({
      username: "ece30861defaultadminuser",
      password: "correcthorsebatterystaple123(!__+@**(A'\"`;DROP TABLE packages;",
      adminPerm: true,
      searchPerm: true,
      downloadPerm: true,
      uploadPerm: true,
      userGroup: "admin",
    });
    if (defaultCreated) {
      console.log("Default user created");
    }
    await Package.create({
      name: "React",
    });
    await Version.create({
      packageID: 1,
      version: "1.2.3",
      packagePath: "none",
      packageUrl: "https://reactjs.org/",
      author: "Facebook",
      accessLevel: "public",
      programPath: "none",
    });
    await Package.create({
      name: "Lodash",
    });
    await Version.create({
      packageID: 2,
      version: "17.0.2",
      packagePath: "none",
      packageUrl: "https://reactjs.org/",
      author: "Facebook",
      accessLevel: "public",
      programPath: "none",
    });
    await Package.create({
      name: "UnderScore",
    });
    await Version.create({
      packageID: 3,
      version: "1.2.3",
      packagePath: "none",
      packageUrl: "https://reactjs.org/",
      author: "Facebook",
      accessLevel: "public",
      programPath: "none",
    });
    await Version.create({
      packageID: 1,
      version: "1.2.4",
      packagePath: "none",
      packageUrl: "https://reactjs.org/",
      author: "Facebook",
      accessLevel: "public",
      programPath: "none",
    });
});

