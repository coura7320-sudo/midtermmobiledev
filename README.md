# 📱 WhatsApp Prototype - Mobile Dev Midterm Project

> **Application mobile React Native / Expo reproduisant fidèlement l'interface et les fonctionnalités de WhatsApp avec support temps réel WebSocket, API REST, Drawer, Tabs, Context API, Thèmes Sombre/Clair et Stockage Local Sécurisé.**

---

## 👤 Informations sur le projet
- **Étudiant(e)** : Couraba Gueye
- **Cours** : CS3542 — Mobile Application Development
- **Établissement** : Dakar American University of Science and Technology (DAUST)
- **Projet** : Midterm Project Presentation — Prototype WhatsApp

---

## 🎯 Conformité avec les Exigences du Professeur

| Exigence demandée | Statut | Emplacement dans le code | Description |
| :--- | :---: | :--- | :--- |
| **Tabs & Drawer** | ✅ Fait | `src/app/(drawer)/_layout.tsx`<br>`src/app/(drawer)/(tabs)/_layout.tsx` | Navigation Drawer latérale (Profil, Paramètres, À propos, Appareils connectés, Messages importants) + 4 onglets WhatsApp (Discussions, Actus, Communautés, Appels). |
| **Context API** | ✅ Fait | `src/context/ThemeContext.tsx`<br>`src/context/AuthContext.tsx`<br>`src/context/ChatContext.tsx` | Gestion globale de l'état sans prop drilling : gestion du thème, authentification & profil, gestion des discussions & WebSocket. |
| **Thème Sombre & Clair** | ✅ Fait | `src/constants/theme.ts`<br>`src/context/ThemeContext.tsx` | Codes couleurs officiels de WhatsApp : Vert `#008069`, Thème sombre `#1f2c34` & fond discussion `#0b141a`, bulles `#005c4b` / `#d9fdd3`. |
| **API Backend REST** | ✅ Fait | `backend/server.js`<br>`src/services/apiService.ts` | Endpoints REST (`/api/contacts`, `/api/chats`, `/api/messages`, `/api/status`, `/api/profile`, `/api/calls`). |
| **WebSocket en Temps Réel** | ✅ Fait | `backend/server.js`<br>`src/services/socketService.ts` | Serveur WebSocket natif (`ws`) : messagerie bidirectionnelle instantanée, accusés de lecture (coches bleues `✓✓`), et indicateur de saisie (*en train d'écrire...*). |
| **Stockage Local (SQLite / Key-Value & Secure Storage)** | ✅ Fait | `src/services/storageService.ts`<br>`src/hooks/useLocalStorage.ts` | 1. **Key-Value Store** persistant pour les messages et préférences.<br>2. **SecureStore** pour le jeton d'authentification chiffré.<br>3. **SQLiteStore** abstraction SQL (`executeSql`). |
| **Hooks React Appropriés** | ✅ Fait | `src/hooks/*`<br>`src/context/ChatContext.tsx` | Utilisation de `useCallback`, `useMemo`, `useRef`, `useEffect`, ainsi que des hooks personnalisés `useTheme`, `useAuth`, `useChat`, `useDebounce`, `useLocalStorage`. |

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Expo Go](https://expo.dev/go) sur votre smartphone Android / iOS (ou simulateur / navigateur Web)

---

### Étape 1 : Démarrer le Serveur Backend (REST + WebSocket)
Dans un premier terminal, placez-vous dans le dossier du projet et lancez le serveur backend :

```bash
# Dans mobile dev midterm :
npm run backend
```
*(ou directement : `node backend/server.js`)*

Le serveur démarre immédiatement :
- 🟢 **API REST** : `http://localhost:3000/api`
- ⚡ **WebSocket Server** : `ws://localhost:3000`
- 🩺 **Health Check** : `http://localhost:3000/api/health`

---

### Étape 2 : Démarrer l'Application Mobile (Expo)
Dans un deuxième terminal :

```bash
npm start
```
*(ou `npx expo start`)*

- **Sur mobile (Android / iOS)** : Scannez le QR Code affiché dans le terminal avec l'application **Expo Go**.
- **Sur navigateur Web** : Appuyez sur la touche `w` dans le terminal.
- **Sur émulateur Android** : Appuyez sur la touche `a`.

---

## 💬 Fonctionnalités Détaillées du Prototype WhatsApp

### 1. Discussions & Messagerie Temps Réel (Onglet 1)
- Liste des conversations avec photo de profil, nom, aperçu du dernier message et horodatage.
- **Accusés de réception WhatsApp authentiques** :
  - Simple coche grise `✓` : message envoyé.
  - Double coche grise `✓✓` : message distribué au serveur.
  - Double coche bleue `✓✓` : message lu par le destinataire.
- **Indicateur de saisie en direct** : affichage en vert de *"en train d'écrire..."* dès que le contact ou vous commencez à taper.
- **Bouton d'action flottant (FAB)** vert en bas à droite pour démarrer une nouvelle conversation avec le sélecteur de contacts.
- **Filtres WhatsApp** : boutons de filtres rapides (*Tous*, *Non lus*, *Favoris*, *Groupes*).
- **Simulation de réponse intelligente pour la soutenance** : Lorsque vous envoyez un message à un contact (ex: *Prof. Diop*), le serveur WebSocket simule un indicateur de saisie puis renvoie automatiquement une réponse réaliste après 1.5 seconde !

### 2. Actus / Statuts (Onglet 2)
- Section **Mon statut** pour publier de nouvelles actualités avec photo ou texte.
- Anneaux circulaires verts autour des photos des contacts ayant un statut non lu (gris pour les statuts déjà vus).
- **Visionneuse de stories plein écran** (`/status-view`) avec barre de progression animée sur 5 secondes, photo, légende et bouton de réponse.

### 3. Communautés (Onglet 3)
- Espace dédié aux groupes et annonces : Communauté officielle **DAUST Engineering Campus** avec les sous-groupes *Annonces officielles* et *CS3542 Mobile Dev Lab*.

### 4. Appels (Onglet 4)
- Journal d'appels avec icônes distinctes : appels entrants `↙` (verts), sortants `↗` (verts) et manqués `↙` (rouges).
- Écran d'appel vocal/vidéo actif (`/call-screen`) avec durée d'appel en temps réel, coupure micro, haut-parleur et bouton rouge de fin d'appel.

### 5. Menu Drawer Latéral & Paramètres
- Bannière personnalisée affichant le profil de l'utilisateur (nom, numéro, statut).
- Liens rapides : *Discussions*, *Nouveau groupe*, *Appareils connectés*, *Messages importants*, *Paramètres*, *À propos*.
- **Commutateur de Thème Sombre** directement accessible dans le Drawer et dans les Paramètres.
- Vue détaillée de l'état du serveur WebSocket et du stockage local (avec possibilité de vider le cache).

---

## 🏗️ Architecture du Projet

```text
mobile dev midterm/
├── backend/
│   ├── server.js              # Serveur Node.js natif (API REST + WebSocket ws)
│   └── package.json           # Scripts de lancement backend
├── src/
│   ├── app/                   # Expo Router (Navigation basée sur les fichiers)
│   │   ├── _layout.tsx        # Stack racine + Providers (Theme, Auth, Chat)
│   │   ├── call-screen.tsx    # Écran d'appel vocal / vidéo
│   │   ├── new-message.tsx    # Modal de nouveau message & contacts
│   │   ├── status-view.tsx    # Visionneuse de Story / Statut avec timer
│   │   ├── chat/
│   │   │   └── [id].tsx       # Écran de discussion WhatsApp avec WebSocket
│   │   ├── contact-info/
│   │   │   └── [id].tsx       # Profil détaillé du contact
│   │   └── (drawer)/          # Menu latéral Drawer
│   │       ├── _layout.tsx    # Configuration Drawer avec profil personnalisé
│   │       ├── settings.tsx   # Écran Paramètres & Thèmes
│   │       ├── about.tsx      # Écran À propos & Exigences du cours
│   │       ├── starred.tsx    # Messages importants
│   │       ├── linked-devices.tsx # Appareils connectés (WhatsApp Web)
│   │       └── (tabs)/        # Barre des 4 onglets
│   │           ├── _layout.tsx    # Configuration des 4 onglets
│   │           ├── index.tsx      # Onglet 1: Discussions (Chats)
│   │           ├── status.tsx     # Onglet 2: Actus (Status Stories)
│   │           ├── communities.tsx# Onglet 3: Communautés
│   │           └── calls.tsx      # Onglet 4: Appels (Call Logs)
│   ├── components/            # Composants graphiques réutilisables
│   │   ├── ChatBubble.tsx     # Bulles de message avec queues et coches bleues
│   │   ├── ChatItem.tsx       # Ligne de discussion avec badge non lu
│   │   ├── MessageInput.tsx   # Champ de message, émojis, pièces jointes, micro/envoi
│   │   ├── FilterChips.tsx    # Puces de filtre (Tous, Non lus, Favoris, Groupes)
│   │   ├── StatusItem.tsx     # Élément statut avec anneau coloré
│   │   ├── CallItem.tsx       # Ligne d'appel avec flèches entrant/sortant/manqué
│   │   ├── WhatsAppHeader.tsx # En-tête officiel WhatsApp avec recherche
│   │   └── WhatsAppIcon.tsx   # Composant d'icônes vectorielles WhatsApp universelles
│   ├── context/               # Context API
│   │   ├── ThemeContext.tsx   # Gestion Thème Clair / Sombre
│   │   ├── AuthContext.tsx    # Gestion Profil & Token Sécurisé
│   │   └── ChatContext.tsx    # Discussions, messages & intégration WebSocket
│   ├── hooks/                 # Hooks React personnalisés
│   │   ├── useTheme.ts        # Accès direct aux couleurs & état sombre
│   │   ├── useAuth.ts         # Accès au profil & identifiants
│   │   ├── useChat.ts         # Accès aux discussions & actions WebSocket
│   │   ├── useDebounce.ts     # Throttling de la recherche et saisie
│   │   └── useLocalStorage.ts # Hook de persistance automatique
│   ├── services/              # Logique métier & services réseau
│   │   ├── apiService.ts      # Client HTTP REST
│   │   ├── socketService.ts   # Client WebSocket avec reconnexion automatique
│   │   └── storageService.ts  # KeyValueStore, SecureStore & SQLiteStore
│   └── constants/
│       └── theme.ts           # Palettes de couleurs WhatsApp officielles
├── app.json                   # Configuration Expo
├── tsconfig.json              # Configuration TypeScript stricte
├── package.json               # Dépendances & scripts npm
└── README.md                  # Documentation du projet
```

---

## 🎨 Palettes de Couleurs WhatsApp Utilisées

| Élément | Thème Clair (Light) | Thème Sombre (Dark) |
| :--- | :--- | :--- |
| **En-tête (Header)** | `#008069` (Vert WhatsApp officiel) | `#1f2c34` (Ardoise foncé) |
| **Fond des discussions** | `#efeae2` (Beige WhatsApp chat) | `#0b141a` (Noir profond WhatsApp) |
| **Bulles envoyées (Mine)** | `#d9fdd3` (Vert menthe clair) | `#005c4b` (Vert émeraude sombre) |
| **Bulles reçues (Other)** | `#ffffff` (Blanc) | `#202c33` (Gris bleuté) |
| **Bouton d'action (FAB)** | `#008069` | `#00a884` |
| **Coches de lecture (Read)** | `#53bdeb` (Bleu ciel officiel) | `#53bdeb` (Bleu ciel officiel) |
| **Coches de distribution** | `#8696a0` (Gris discret) | `#8696a0` (Gris discret) |

---

## 🧪 Scénario de Démonstration pour la Présentation

Lors de votre soutenance avec le professeur :
1. **Démarrer le backend** (`npm run backend`) et ouvrir l'application. Remarquez le **point vert** à côté du logo WhatsApp indiquant que le **WebSocket est connecté en temps réel**.
2. **Tester la messagerie instantanée** :
   - Ouvrez la conversation avec le **Prof. Diop (Mobile Dev)**.
   - Tapez un message comme *"Bonjour Monsieur, voici mon projet midterm"* et appuyez sur envoyer.
   - Observez la coche passer immédiatement à distribué, puis après moins d'une seconde, remarquez l'affichage en vert *"Prof. Diop (Mobile Dev) est en train d'écrire..."*, suivi de sa réponse instantanée reçue via le WebSocket !
3. **Changer de thème** :
   - Ouvrez le menu latéral (Drawer) en glissant depuis la gauche ou en appuyant sur l'icône de menu.
   - Basculez le commutateur **Thème sombre** : l'ensemble des écrans, en-têtes et bulles adoptent instantanément la palette WhatsApp Dark !
4. **Tester les onglets (Tabs)** :
   - Naviguez entre **Discussions**, **Actus**, **Communautés**, et **Appels**.
   - Dans **Actus**, appuyez sur un statut pour lancer la **visionneuse de story animée** avec sa barre de décompte de 5 secondes.
   - Dans **Appels**, lancez un appel audio ou vidéo pour montrer l'interface complète d'appel avec minuteur actif.
5. **Tester le stockage local et SecureStorage** :
   - Rendez-vous dans **Paramètres > Stockage & Données**.
   - Montrez le jeton chiffré stocké dans le **SecureStore** et l'état du cache local.
   - Même si l'application est redémarrée, l'historique et les préférences de thème restent préservés !

---

*Développé avec passion pour le cours de Mobile Application Development (CS3542) — DAUST 2026.*
