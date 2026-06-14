# Tarsia — Puzzles mathématiques
## Par Oceanic Software

### Fichiers à déployer

Mettre tous les fichiers suivants dans le **même dossier** sur un serveur web :

| Fichier | Description |
|---------|-------------|
| `tarsia-pwa.html` | Application principale |
| `manifest.json` | Manifeste PWA (installation sur écran d'accueil) |
| `service-worker.js` | Service worker (fonctionnement hors ligne) |
| `favicon.svg` | Favicon navigateur |
| `icon-192.svg` | Icône PWA 192×192 |
| `icon-512.svg` | Icône PWA 512×512 |
| `icon-maskable-512.svg` | Icône PWA adaptative (Android) |
| `apple-touch-icon.svg` | Icône iOS/iPadOS |

### Prérequis serveur

- HTTPS obligatoire pour l'installation PWA et le service worker
- En-têtes MIME correctes pour `.svg` (`image/svg+xml`) et `.json` (`application/json`)
- Pas de dépendance serveur — tout est statique

### Fonctionnement hors ligne

Après la première visite, l'application fonctionne **complètement hors ligne** grâce au service worker (sauf KaTeX CDN au premier chargement — mis en cache ensuite).

### Installation sur iPad / iPhone

1. Ouvrir l'URL dans Safari
2. Bouton Partager → « Ajouter à l'écran d'accueil »
3. Nom : Tarsia → Ajouter

### Installation sur Android / Chrome

Bannière d'installation automatique, ou menu ⋮ → « Ajouter à l'écran d'accueil »

### Installation sur macOS / Windows

Chrome/Edge : icône ⊕ dans la barre d'adresse → Installer

---
Développé avec Oceanic Software • Haut-Lac École Internationale
