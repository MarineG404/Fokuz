# 🎯 Fokuz

## 📖 Description

Application mobile de productivité développée avec React Native et Expo, conçue pour améliorer la concentration et la gestion du temps. Fokuz propose des exercices de concentration avec différentes méthodes (pomodoro, deeap work) et un système de suivi complet des sessions.

L'application combine des techniques de bien-être mental avec un suivi statistique détaillé pour aider les utilisateurs à développer leurs capacités de concentration de manière progressive et mesurable.

---

## 🚀 Fonctionnalités

- [x] **Exercices de concentration** - Catalogue d'exercices avec différentes méthodes
- [x] **Timer personnalisable** - Chronomètre avec contrôles play/pause/reset et affichage temps formaté
- [x] **Suivi des sessions** - Historique complet des sessions avec statut (complétée/abandonnée)
- [x] **Statistiques détaillées** - Tableaux de bord avec taux de réussite, temps total
- [x] **Filtrage avancé** - Filtres par statut, méthode et période pour l'analyse des données
- [x] **Interface intuitive** - Navigation drawer/tabs avec design cohérent et responsive
- [x] **Persistance locale** - Sauvegarde automatique avec AsyncStorage

---

## 🛠️ Technologies utilisées

- **Framework** : React Native, Expo SDK 54
- **Langage** : TypeScript

---

## 📂 Structure du projet

```bash
Fokuz/
├── app/                      # Navigation et écrans principaux
│   ├── (drawer)/            # Layout drawer navigation
│   │   └── (tabs)/          # Layout tabs (index, history)
│   ├── timer/               # Écrans timer
│   └── method/              # Détails des méthodes
├── assets/                   # Ressources statiques
│   ├── data/                # Données exercices
│   └── images/              # Icons et splash screens
├── components/              # Composants réutilisables
│   ├── ExercicesCards.tsx   # Cartes d'exercices
│   ├── SessionCard.tsx      # Affichage sessions historique
│   ├── StatsCard.tsx        # Cartes statistiques
│   └── HeaderTitle.tsx      # Header personnalisé
├── constants/               # Constantes (couleurs, tokens)
├── themes/                  # Configuration thème
├── types/                   # Interfaces TypeScript
├── utils/                   # Services et hooks
│   ├── historyService.ts    # Gestion données historique
│   └── useTimer.ts          # Hook timer personnalisé
└── README.md
```

---

## ⚙️ Installation & utilisation

### 1. Cloner le projet

```bash
git clone https://github.com/MarineG404/Fokuz.git
cd Fokuz
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer l'application

```bash
# Démarrage du serveur de développement
npx expo start

# ou avec nettoyage du cache
npx expo start -c
```

---

## 🎮 Utilisation

1. **Écran principal** : Parcourir les exercices de concentration disponibles
2. **Sélection exercice** : Choisir une méthode (pomodoro, deap work, ...)
3. **Session timer** : Lancer le chronomètre et suivre l'exercice
4. **Historique** : Consulter les sessions passées avec filtres et statistiques
5. **Analyse** : Suivre les progrès via les cartes statistiques

---

## 👥 Auteur

- **Marine** — Développeuse Full-Stack (React Native, TypeScript, UX/UI)
