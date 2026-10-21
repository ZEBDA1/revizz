# Publier le code sur GitHub

Revizz est une application complète de révision assistée par IA. Mettre le code sur GitHub permet de versionner le projet et de bénéficier des vérifications automatiques GitHub Actions.

## Méthode simple avec GitHub Desktop

1. Extraire `revizz-github.zip` dans un nouveau dossier. Le sous-dossier `revizz` contient le projet complet, y compris `.github`, `.openai`, `.gitignore` et `.env.example`.
2. Dans GitHub Desktop, choisir **File → Add local repository**, sélectionner ce sous-dossier, puis **create a repository here**. Utiliser ce même dossier, sans créer un second sous-dossier.
3. Créer le premier commit si nécessaire, puis choisir **Publish repository**. Choisir la visibilité du dépôt selon le partage souhaité pour le code.
4. Dans l’onglet **Actions** du dépôt, vérifier le résultat du workflow « Vérification de Revizz » après publication.

L’archive contient uniquement les fichiers de la version enregistrée. Les clés, `.env.local`, les dépendances installées, les fichiers compilés, les captures de test et l’historique Git local sont exclus. La configuration `.openai/hosting.json` identifie le site existant ; elle ne contient aucun secret et n’accorde pas un accès au site.

## Méthode en ligne de commande

Créer un dépôt GitHub vide, sans README ajouté par GitHub, puis ouvrir un terminal dans le dossier `revizz` extrait :

```sh
git init -b main
git add .
git commit -m "Version de production de Revizz"
git remote add origin URL_DU_DEPOT_GITHUB
git push -u origin main
```

Remplacer `URL_DU_DEPOT_GITHUB` par l’URL HTTPS ou SSH du dépôt créé. Cette méthode démarre un historique propre pour GitHub et conserve le dépôt de travail Sites d’origine.

## Développement après publication

```sh
npm ci
npm run check
npm run build
```

Les vérifications automatiques n’ont besoin d’aucune clé et ne consomment pas le quota IA. Pour essayer l’IA en local, créer son propre `.env.local` à partir de `.env.example` ; ne jamais ajouter ce fichier au dépôt.

Pour créer un nouvel export après avoir enregistré un commit :

```sh
npm run export:github -- ../revizz-github-nouvelle-version.zip
```

Le script refuse les modifications non enregistrées et les fichiers confidentiels détectés. Il ne remplace pas un export existant.

## Hébergement et mises à jour

Ce dépôt contient l’interface et le serveur IA. [GitHub Pages héberge des sites statiques](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) : il ne peut pas exécuter la route serveur `/api/ai` de Revizz. Conserver l’hébergement Sites actuel pour cette version.

Le workflow GitHub vérifie et compile le projet. Il ne déploie pas automatiquement et n’a besoin d’aucun secret de production. La procédure de publication sur le site existant est décrite dans [DEPLOIEMENT.md](DEPLOIEMENT.md).
