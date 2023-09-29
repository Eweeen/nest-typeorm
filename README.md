## Installation

### Créer une base de données

Il faut créer une base de données dans un environnement MySQL ou MariaDB.

### Les variables d'envirronnement

- Copier puis coller le fichier **.env.example** et renommer la copie en **_config.env_**
- Remplir le fichier config.env avec vos informations

### Installer le projet

```bash
bun run init
```

## Lancer le projet

```bash
bun run start:dev
```

## Autres commandes

### Seeder la base de données

```bash
bun run seed
```

### Générer une nouvelle migration

Pour générer un nouveau fichier de migration, exécutez la commande suivante :

```bash
bun run migration:generate migration_name
```

Cette commande vérifie les différences entre le schéma de la base de données et les entités du projet. Le fichier de migration sera à la racine du projet. Il faudra donc le déplacer dans le dossier migrations.

### Effectuer les migrations

Pour effectuer les migrations, exécutez la commande suivante :

```bash
bun run migration:run
```

## Test

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```
