const request = require("supertest");
const app = require("../app");
const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

describe("POST /user/login", () => {
  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await User.deleteMany({});

    await User.insertMany([
      {
        userName: "admin",
        email: "admin@test.com",
        password: await hashPassword("admin123"),
      },
      {
        userName: "user1",
        email: "user1@test.com",
        password: await hashPassword("password123"),
      },
    ]);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test("Login réussi", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: "admin@test.com",
        password: "admin123",
      })
      .expect(200);

    expect(response.body).toBeDefined();
    expect(typeof response.body).toBe("string");
  });

  test("Mot de passe incorrect", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: "admin@test.com",
        password: "mauvais_password",
      })
      .expect(401);

    expect(response.body.error).toBe("Mot de passe incorrect");
  });

  test("Utilisateur inconnu", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: "inconnu@test.com",
        password: "password123",
      })
      .expect(404);

    expect(response.body.error).toBe("Email inconnu");
  });
});
