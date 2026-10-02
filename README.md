# SkibidiWriter

Une appli web pour ecrire des documents a plusieurs, en temps reel.
C'est notre projet Spe 4.

Les choix techniques sont expliques dans `DOCUMENT_EXPLICATIF.md`.

## Ce qu'on peut faire

- Creer un compte, se connecter, se deconnecter
- Activer la double authentification (2FA, appli de codes)
- Creer des dossiers et des documents texte
- Ecrire a plusieurs en direct, avec sauvegarde auto sur le serveur
- Envoyer des fichiers (PDF, images...) et les telecharger
- Remplacer un fichier : on renvoie un fichier avec le meme nom, un bouton "Remplacer" apparait
- Voir pour chaque fichier la date et la derniere personne qui l'a modifie
- Partager un document avec d'autres personnes
- Discuter dans le chat du document
- Admin : ajouter un compte, bloquer et debloquer un compte

On n'a pas fait l'appel audio.

## Le code

- `skibidiwriter-backend` : l'API et le temps reel (Bun, Hono, Postgres)
- `skibidiwriter-frontend` : le site (React, Vite)
- `skibidiwriter-shared` : le code commun (types, validation, CRDT)

## Lancer en local

Il faut Bun et Postgres.

1. Lancer un Postgres avec Docker :

```bash
docker run --name skibidi-db -e POSTGRES_PASSWORD=skibidi -e POSTGRES_DB=skibidiwriter -p 5432:5432 -d postgres:17
```

2. Installer les dependances, a la racine :

```bash
bun install
```

3. Creer `skibidiwriter-backend/.env.local` :

```
DATABASE_URL=postgres://postgres:skibidi@localhost:5432/skibidiwriter
FRONTEND_URL_NO_SLASH=http://localhost:5173
PORT=3600
BETTER_AUTH_SECRET=une-longue-chaine-au-hasard
BETTER_AUTH_URL=http://localhost:3600
```

4. Creer `skibidiwriter-frontend/.env.local` :

```
VITE_API_URL=http://localhost:3600
VITE_BETTER_AUTH_URL=http://localhost:3600
```

5. Lancer le backend, puis le frontend (deux terminaux) :

```bash
cd skibidiwriter-backend && bun dev
cd skibidiwriter-frontend && bun dev
```

6. Ouvrir http://localhost:5173

## Le premier admin

1. Creer un compte depuis la page d'inscription.
2. Le passer admin dans la base :

```bash
docker exec -it skibidi-db psql -U postgres -d skibidiwriter -c "UPDATE \"user\" SET role = 'admin' WHERE email = 'admin@exemple.fr';"
```

3. Se reconnecter. La page Profil permet de gerer les membres.

## Production

- Backend : `bun db:push` puis `bun run src/index.ts`
- Frontend : `bun run build`, puis servir le dossier `dist/`
