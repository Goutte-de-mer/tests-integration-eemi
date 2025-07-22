# Tests d'Intégration - Authentification

**Projet :** tests-integration  
**Prénom Nom :** Marion Bailleux

## Installation et démarrage

### Backend

```bash
cd backend
npm install
npm run dev
npm run fixtures     # Génération données de test
npm test             # Exécution des tests
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev          # Démarrage développement (http://localhost:3000)
npm test             # Exécution des tests
```

### Variables d'environnement

**Backend (.env.test)**

```bash
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/test_database
TOKEN_SECRET=test-jwt-secret-key
```

## Tests implémentés

### Types de tests

#### 1. Tests unitaires (Frontend)

**Exemple - Composant LoginForm :**

```javascript
test("affiche les champs email et password", () => {
  render(<LoginForm setSuccess={mockSetSuccess} />);

  expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /se connecter/i })
  ).toBeInTheDocument();
});
```

#### 2. Tests d'intégration (Backend)

**Exemple - API Login :**

```javascript
test("Login réussi", async () => {
  const response = await request(app)
    .post("/user/login")
    .send({
      email: "admin@test.com",
      password: "admin123",
    })
    .expect(200);

  expect(response.body).toBeDefined();
  expect(typeof response.body).toBe("string"); // JWT token
});
```

### Cas de test couverts

#### Backend - API Authentification (`POST /user/login`)

- **Login réussi (200)** - Retourne un token JWT valide + cookie httpOnly
- **Mot de passe incorrect (401)** - Message d'erreur "Mot de passe incorrect"
- **Utilisateur inconnu (404)** - Message d'erreur "Email inconnu"

#### Frontend - Composant LoginForm (Next.js)

- **Rendu des champs** - Email, password, bouton submit
- **Saisie utilisateur** - Interaction avec les champs de formulaire
- **Soumission réussie** - Appel à l'action login via server action
- **Gestion d'erreurs** - Affichage des messages d'erreur utilisateur

### Données de test

**Choix : Données inline vs Fixtures**

```javascript
beforeAll(async () => {
  await User.insertMany([
    {
      userName: "admin",
      email: "admin@test.com",
      password: await hashPassword("admin123"),
    },
  ]);
});
```

**Avantages :**

- Prévisibilité (données identiques à chaque exécution)
- Lisibilité (test data visible dans le test)
- Isolation (chaque test contrôle ses données)

## Pipeline CI/CD

### Configuration GitHub Actions

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: backend

    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
          cache: "npm"
          cache-dependency-path: "backend/package-lock.json"

      - name: Install dependencies
        run: npm ci

      - name: Wait for MongoDB to be ready
        run: sleep 10

      - name: Run tests
        run: npm test
```

### Résultats des tests

**Backend Tests**

```
POST /user/login 200 105.243 ms - 237
POST /user/login 401 75.096 ms - 34
POST /user/login 404 16.234 ms - 25
 PASS  tests/login.test.js
  POST /user/login
    √ Login réussi (158 ms)
    √ Mot de passe incorrect (81 ms)
    √ Utilisateur inconnu (21 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        4.921 s, estimated 8 s
Ran all test suites.
```

**Frontend Tests**

```
 PASS  src/__tests__/LoginForm.test.js (12.116 s)
  LoginForm - Tests Unitaires
    √ affiche les champs email et password (124 ms)
    √ permet de saisir dans les champs (546 ms)
    √ réagit au clic du bouton submit (609 ms)
  LoginForm - Tests d'Intégration
    √ soumet les données saisies à la fonction login (677 ms)
    √ affiche message d'erreur si login échoue (522 ms)
    √ affiche message d'erreur si mot de passe incorrect (572 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        22.508 s
Ran all test suites.
```

## Bonnes pratiques appliquées

### Organisation des tests

- **Séparation claire** entre tests unitaires et d'intégration
- **Isolation des environnements** (`.env.test` dédié)
- **Nettoyage automatique** des données entre les tests
- **Nommage explicite** des scénarios de test

### Qualité du code

- **Gestion d'erreurs** avec codes HTTP appropriés
- **Mocking approprié** des dépendances
- **Assertions précises** sur les réponses

### CI/CD

- **Tests automatisés** sur chaque push/PR
- **Environnement isolé** pour les tests

### Sécurité

- **Hashage des mots de passe** (bcrypt)
- **Tokens JWT** pour l'authentification
- **Variables d'environnement** pour les secrets

## Commandes utiles

```bash
# Tests en local
npm test                           # Tous les tests
NODE_ENV=test npm test             # Forcer l'environnement test

# Génération de données
npm run fixtures                   # Créer des utilisateurs de test
```

**Défis rencontrés :**

- Configuration des variables d'environnement pour les tests
- Gestion asynchrone des opérations de base de données avec MongoDB
- Mock des server actions Next.js dans les tests frontend
- Timing des connexions MongoDB dans l'environnement de test
