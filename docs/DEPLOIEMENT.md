# Production de Revizz

## Site actuel

- Environnement : Hébergement privé sécurisé.
- Serveur : Vinext exécuté sur Cloudflare Workers.
- Accès : privé, géré par Sites avec la connexion ChatGPT.
- IA : Cloudflare Workers AI, via une route serveur de même origine.

Le code du dépôt est compilable en local et dans GitHub Actions. La publication de cette version reste gérée par Sites : le proxy d’identité, les secrets et l’autorisation d’accès dépendent de cet hébergement. Déployer le serveur tel quel sur un Worker indépendant ne fournirait pas cette protection. Une migration vers un autre hébergement nécessite une intégration d’authentification adaptée.

## Vérifier une version

Avec Git et Node.js 24 installés, depuis la racine du projet :

```sh
npm ci
npm run check
npm run build
```

La compilation génère `dist/`. `npm start` permet de contrôler la compilation localement sur l’adresse affichée par Wrangler ; la connexion d’essai de développement n’est pas présente dans ce mode. Pour les essais interactifs, utiliser `npm run dev` ou `node serve.mjs`.

## Publier sur le site existant

1. Ouvrir le dossier de travail de Revizz dans Codex avec le plugin Sites disponible et demander sa publication sur le site existant indiqué dans `.openai/hosting.json`.
2. Le workflow Sites ouvre et synchronise la source officielle. Reporter les changements GitHub dans cette source si les deux dépôts ont divergé ; la publication doit utiliser un commit poussé dans le dépôt source Sites.
3. Exécuter les vérifications et la compilation avec les helpers Sites, puis créer l’archive de production depuis ce même commit.
4. Enregistrer et déployer cette version avec l’opération privée Sites. Conserver le projet, l’audience et les secrets existants.
5. Attendre le statut `succeeded`, puis vérifier un scan suivi d’une génération avec un cours d’essai.

Une modification poussée uniquement sur GitHub ne remplace pas la version en ligne. Le workflow de vérification GitHub n’effectue aucun déploiement.

## Secrets

Les deux variables de production sont configurées dans les secrets natifs Sites :

```dotenv
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

Leur nom seul figure dans `.env.example`. Les valeurs locales de `.env.local` ne sont pas envoyées automatiquement à la production. Elles ne doivent entrer ni dans GitHub, ni dans le bundle navigateur, ni dans le manifeste d’hébergement.

Le jeton actuel est dédié à Workers AI. Les quotas et les conditions du compte Cloudflare continuent de s’appliquer. Le statut `/api/ai` confirme la présence de la configuration, mais une génération réelle reste nécessaire pour vérifier les permissions et le quota.

## Revenir à une version précédente

Dans Sites, sélectionner une version enregistrée qui a déjà fonctionné et la redéployer, en conservant l’accès privé. Une nouvelle publication modifie le code serveur et les fichiers servis ; elle ne migre pas les données conservées dans le navigateur des utilisateurs.
