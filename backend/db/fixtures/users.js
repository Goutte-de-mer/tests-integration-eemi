require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const CONNECTION_STRING = process.env.CONNECTION_STRING;

// Hasher un mot de passe
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Générer des utilisateurs
async function generateUsers(count = 20) {
  const users = [];
  const usedUserNames = new Set();
  const usedEmails = new Set();

  console.log("Génération des utilisateurs...");

  for (let i = 0; i < count; i++) {
    let userName, email;

    // S'assurer de l'unicité des userNames
    do {
      userName = faker.internet.username();
    } while (usedUserNames.has(userName));
    usedUserNames.add(userName);

    // S'assurer de l'unicité des emails
    do {
      email = faker.internet.email();
    } while (usedEmails.has(email));
    usedEmails.add(email);

    // Générer un mot de passe
    const plainPassword = faker.internet.password({ length: 12 });
    const hashedPassword = await hashPassword(plainPassword);

    users.push({
      userName,
      email,
      password: hashedPassword,
    });

    // Log pour les tests (optionnel)
    console.log(`${userName} | ${email} | ${plainPassword}`);
  }

  return users;
}

// Créer quelques utilisateurs de test fixes
// async function createTestUsers() {
//   return [
//     {
//       userName: "admin",
//       email: "admin@test.com",
//       password: await hashPassword("admin123"),
//     },
//     {
//       userName: "user1",
//       email: "user1@test.com",
//       password: await hashPassword("password123"),
//     },
//   ];
// }

// Charger toutes les fixtures
async function loadFixtures() {
  try {
    // Connexion
    await mongoose.connect(CONNECTION_STRING);
    console.log("✅ Connecté à MongoDB");

    // Nettoyer les utilisateurs existants
    await User.deleteMany({});
    console.log("🧹 Utilisateurs existants supprimés");

    // Créer utilisateurs de test
    // const testUsers = await createTestUsers();
    // await User.insertMany(testUsers);
    // console.log(`✅ ${testUsers.length} utilisateurs de test créés`);

    // Créer utilisateurs aléatoires
    const randomUsers = await generateUsers(15);
    await User.insertMany(randomUsers);
    console.log(`✅ ${randomUsers.length} utilisateurs aléatoires créés`);

    // Compter le total
    const totalUsers = await User.countDocuments();
    console.log(`🎉 Total: ${totalUsers} utilisateurs dans la base`);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Connexion fermée");
    process.exit();
  }
}

// Exporter les fonctions
module.exports = {
  loadFixtures,
  generateUsers,
  //   createTestUsers,
};

// Lancer si exécuté directement
if (require.main === module) {
  loadFixtures();
}
