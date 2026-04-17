# Documentation — InApp Inventory Dashboard

Ce document explique comment installer, configurer et utiliser le template "InApp Inventory Dashboard" (StockPilot). Il couvre l'installation, l'exécution en développement, la compilation pour la production, la structure du projet et les ressources utiles.

## Table des matières
- [Aperçu](#aperçu)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage en développement](#démarrage-en-d%C3%A9veloppement)
- [Compilation pour la production](#compilation-pour-la-production)
- [Structure du projet](#structure-du-projet)
- [Personnalisation rapide](#personnalisation-rapide)
- [Contribution](#contribution)
- [Support](#support)
- [Licence](#licence)

## Aperçu

Le template "InApp Inventory Dashboard" est une interface d'administration légère destinée à la gestion d'inventaire. Il s'appuie sur un front-end moderne (Vite, ES modules) et une structure de vues Blade prête pour une intégration Laravel.

## Prérequis

- Node.js (v14 ou supérieur)
- Un gestionnaire de paquets : `npm` ou `yarn`
- PHP et Composer (si vous utilisez la partie backend Laravel)
- Une base de données (MySQL, PostgreSQL, SQLite, etc.) si vous utilisez les migrations Laravel

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/Lydie1234/StockPilot.git
cd StockPilot
```

2. Installez les dépendances backend (si vous utilisez Laravel) :

```bash
composer install
```

3. Installez les dépendances frontend :

```bash
npm install
# ou
yarn install
```

4. Configurez l'environnement :

```bash
cp .env.example .env
php artisan key:generate
# Configurez les paramètres DB dans .env puis, si nécessaire :
php artisan migrate
```

> Remarque : la commande `php artisan migrate` nécessite une base de données configurée dans le `.env`.

## Démarrage en développement

Pour lancer le serveur de développement front-end (Vite) :

```bash
npm run dev
```

Pour lancer l'application Laravel en local :

```bash
php artisan serve
```

Vous pouvez exécuter les deux commandes simultanément (dans deux terminaux) pour un workflow complet front + backend.

## Compilation pour la production

Pour compiler les assets pour la production :

```bash
npm run build
```

Les fichiers compilés sont générés dans `public/build/` (configuration standard Vite/Laravel).

## Structure du projet

Arborescence principale (extrait) :

```text
StockPilot/
├── public/
│   ├── assets/
│   │   └── images/     # Images et icônes du template
│   └── build/          # Ressources compilées générées par Vite
├── resources/
│   ├── js/template/    # Sources JS du template (Vite)
│   ├── scss/template/  # Sources SCSS du template (Vite)
│   └── views/
│       ├── layouts/    # app.blade.php et auth.blade.php
│       ├── partials/   # header, sidebar, scripts, styles, footer
│       ├── pages/      # dashboard, inventory, reports, docs
│       └── auth/       # login et register
├── routes/web.php      # Routes des pages
└── vite.config.js      # Configuration standard Laravel Vite
```

## Personnalisation rapide

- Sources JS : modifiez `resources/js/template/` pour adapter le comportement et les widgets.
- Styles : personnalisez `resources/scss/template/` puis relancez la compilation.
- Vues : les pages et les composants Blade sont dans `resources/views/`.

## Tests

Si le projet contient des tests PHPUnit, lancez-les avec :

```bash
./vendor/bin/phpunit
# ou
php artisan test
```

## Contribution

Les contributions sont bienvenues : ouvrez une issue pour signaler un bug ou proposer une amélioration, puis soumettez une Pull Request en expliquant les changements.

## Support

Pour toute question, ouvrez une issue dans le dépôt GitHub. Vous pouvez également contacter l'équipe du template (référence : CodesCandy) si vous avez des besoins spécifiques.

## Licence

Consultez le fichier `LICENSE` à la racine du dépôt pour les informations de licence.

---

### Récapitulatif des commandes rapides

```bash
# Installer dépendances backend
composer install

# Installer dépendances frontend
npm install

# Développement (Vite)
npm run dev

# Servir Laravel en local
php artisan serve

# Compiler pour la production
npm run build
```

Merci d'utiliser InApp Inventory Dashboard — indiquez si vous souhaitez
que j'ajoute ce fichier automatiquement au contrôle de version et
que je crée une PR sur la branche en cours.