# SkibidiWriter - document explicatif

## Organisation

- Une personne a pris la connexion, la 2FA, le profil et l'admin. L'autre a pris les fichiers, le temps reel, le CRDT, le partage et le chat.
- Le paquet `shared` sert de contrat entre les deux : memes types et memes regles partout.

## Choix techniques

- **TypeScript partout** (serveur, site, code commun) : un seul langage, des types partages.
- **Bun** : lance le TypeScript direct, workspaces et WebSocket integres.
- **Hono** : petit framework rapide. Son client donne au site les types de l'API sans les recopier.
- **Postgres + Drizzle** : les donnees sont liees (utilisateurs, dossiers, fichiers, partages), donc une base relationnelle. Les fichiers envoyes y sont stockes (8 Mo max), une seule sauvegarde a faire.
- **better-auth** : mots de passe, sessions, 2FA et role admin. On ne reinvente pas la securite des comptes. Le reste est fait par nous.
- **CRDT fait maison** : Yjs est exclu et le sujet demande de creer l'appli nous-memes. Chaque lettre a un identifiant unique et se place apres une autre lettre. Une suppression marque juste la lettre comme effacee. Tout le monde arrive au meme texte, quel que soit l'ordre des messages.
- **React, Vite, Tailwind, shadcn** : un front rapide a mettre en place. TanStack Query gere les appels a l'API.
- **Zod** : les memes regles de validation cote site et cote serveur.

## Architecture : deux serveurs

- **Serveur 1 : le frontend.** Le site construit (`bun run build`), des fichiers statiques.
- **Serveur 2 : le backend et la base.** Bun + Hono + Postgres : API, WebSocket, donnees.

Pourquoi : le site est statique et leger. Le backend garde un etat (WebSocket, documents ouverts en memoire) et a besoin de son propre serveur. Chacun se redemarre sans toucher l'autre.

Communication : HTTP et JSON pour l'API, WebSocket pour le temps reel, cookie de session. Le backend n'accepte que l'adresse du frontend. Les deux serveurs doivent etre sur le meme domaine parent (ex : `app.exemple.fr` et `api.exemple.fr`), sinon le cookie est bloque.

Pas de replication : les documents ouverts vivent en memoire d'un seul processus backend.

## Qualite et securite

- Coupure de connexion : les modifs restent dans le navigateur et repartent a la reconnexion. Le serveur sauvegarde le document 500 ms apres le dernier changement, et quand la derniere personne part.
- Acces controle a chaque requete : un fichier n'est visible que par son proprietaire et les personnes invitees. Seul le proprietaire peut le renommer, deplacer, remplacer, supprimer et partager.
- Entrees validees avec Zod, CORS limite au frontend, controle de l'origine (requetes et WebSocket).
- Fichiers telecharges en piece jointe (`nosniff`, CSP `sandbox`).
- Bloquer un compte coupe ses sessions et ses WebSocket.
- Ergonomie : glisser-deposer, menus clic droit, chargements, theme clair et sombre.

## Ce qu'on n'a pas fait

- L'appel audio
- Les curseurs des autres personnes (seule la liste des presents existe)
- Le chat n'est pas sauvegarde (100 derniers messages en memoire)
- La mise en forme riche du texte
