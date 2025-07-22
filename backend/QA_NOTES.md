# QA Notes - Tests d'authentification

## Architecture des tests

### Structure des fichiers

```
backend/
├── tests/
│   └── login.test.js          # Tests route login
├── db/
│   └── fixtures/
│       └── users.js           # Donées fictives
├── .env.test                  # Variables d'environnement pour tests
└── db/connection.js           # Connexion DB avec fallback pour tests
```

## Stratégie de données de test

### Fixtures vs Données inline

**Fixtures disponibles (`loadFixtures.js`)** :

- Génération de 15+ utilisateurs avec Faker.js
- Mots de passe hashés automatiquement
- Usernames et emails uniques garantis
- Script exécutable : `npm run fixtures`

**Choix actuel - Données inline dans les tests** :

```javascript
await User.insertMany([
  {
    userName: "admin",
    email: "admin@test.com",
    password: await hashPassword("admin123"),
  },
]);
```

**Pourquoi ce choix ?**

- **Prévisibilité** : Données identiques à chaque run
- **Simplicité** : Pas de dépendance externe aux fixtures
- **Lisibilité** : Test data visible dans le test même
- **Isolation** : Chaque test contrôle ses propres données

**Quand utiliser les fixtures ?**

- Tests de performance avec gros volumes
- Tests de bout-en-bout complets
- Développement local avec données réalistes

### Gestion de l'environnement

**Configuration des tests (`/.env.test`)** :

```bash
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/test_database
TOKEN_SECRET=test-jwt-secret-key
```

**Isolation des environnements** :

- Tests chargent `.env.test` automatiquement si `NODE_ENV=test`
- Fallbacks dans `db/connection.js` pour éviter les undefined
- GitHub Actions override les variables via workflow

## Choix techniques détaillés

### Helpers et utilitaires

- `generateUsers(count)` - Génération avec Faker
- `loadFixtures()` - Chargement complet de la DB

## CI/CD - GitHub Actions

### Configuration

- Node.js LTS
- MongoDB
- Working directory: `backend/`

## Couverture des tests

### Scénarios couverts

- Login réussi (200) - Token JWT valide retourné
- Mot de passe incorrect (401) - Mot de passe incorrect
- Utilisateur inconnu (404) - Email inconnu

### Assertions

- Codes de statut HTTP corrects
- Structure de la réponse (token string vs error object)
- Messages d'erreur explicites

## Commandes utiles

```bash
# Tests locaux
npm test

# Tests avec variables d'environnement
NODE_ENV=test npm test  # Linux/Mac
$env:NODE_ENV="test"; npm test  # Windows PowerShell

# Génération de fixtures pour dev
npm run fixtures

```
