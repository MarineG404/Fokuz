# 🎯 Fokuz

## 📖 Description

Application mobile de productivité développée avec React Native et Expo, conçue pour améliorer la concentration et la gestion du temps. Fokuz propose des méthodes de concentration avec différentes techniques (Pomodoro, Deep Work, 52/17) et un système de suivi complet des sessions.

L'application combine des techniques de bien-être mental avec un suivi statistique détaillé pour aider les utilisateurs à développer leurs capacités de concentration de manière progressive et mesurable.

---

## 🚀 Fonctionnalités

- [x] **Méthodes de concentration** - Catalogue de méthodes prédéfinies (Pomodoro, Deep Work, 52/17)
- [x] **Méthodes personnalisées** - Création, modification et suppression de méthodes custom
- [x] **Timer intelligent** - Chronomètre avec alternance travail/pause et contrôles complets
- [x] **Suivi des sessions** - Historique détaillé avec statut (complétée/abandonnée)
- [x] **Statistiques avancées** - Tableaux de bord avec taux de réussite, temps total, moyenne
- [x] **Filtrage intelligent** - Filtres par période (aujourd'hui, 7 jours, 30 jours)
- [x] **Interface multilingue** - Support français/anglais avec i18next
- [x] **Design adaptatif** - Interface responsive avec mode portrait/paysage
- [x] **Player audio intégré** - Musique Lo-Fi pour améliorer la concentration
- [x] **Persistance locale** - Sauvegarde automatique avec AsyncStorage
- [x] **Navigation moderne** - Drawer + Tabs avec Expo Router

---

## 🛠️ Technologies utilisées

- **React Native & Expo** - Framework mobile cross-platform
- **TypeScript** - Langage typé pour plus de robustesse
- **i18n** - Internationalisation français/anglais
- **ESLint & Prettier** - Qualité et formatage du code

---

## 📂 Structure du projet

```bash
Fokuz/
├── app/                          # Navigation et écrans (Expo Router)
│   ├── (drawer)/(tabs)/         # Pages principales (index, history)
│   ├── method/[id].tsx          # Page détail méthode
│   └── settings.tsx             # Paramètres
├── components/                   # Composants réutilisables
│   ├── cards/                   # MethodCard, SessionCard, StatsCard
│   ├── modals/                  # Add/Edit/ConfirmModal
│   ├── timer/TimerComponent.tsx # Timer principal
│   └── ui/                      # HeaderTitle, BlockCard, FAB
├── contexts/                     # Gestion d'état (méthodes custom)
├── hooks/                        # useAllMethods, useTimer
├── src/localization/            # i18n français/anglais
├── assets/data/methods.ts       # Méthodes prédéfinies
└── utils/historyService.ts      # Persistance sessions
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

### 3. Scripts disponibles

```bash
# Nettoyage cache + démarrage
npx expo start -c

# Linting et formatage
npm run lint                    # Vérifier le code
npm run lint:fix               # Corriger automatiquement
npm run format                # Formater avec Prettier
npm run check                 # Format + lint + typecheck
```

---

## 🎮 Utilisation

### Navigation principale
1. **Accueil** : Parcourir et sélectionner les méthodes de concentration
2. **Historique** : Consulter les sessions avec filtres et statistiques
3. **Paramètres** : Configuration thème et langue

### Gestion des méthodes
1. **Méthodes prédéfinies** : Pomodoro (25/5), Deep Work (90min), 52/17
2. **Méthodes custom** : Créer via le bouton + avec nom, description, durées
3. **Édition/Suppression** : Gestion complète des méthodes personnalisées

### Sessions de concentration
1. **Sélection** : Choisir une méthode depuis l'accueil
2. **Configuration** : Visualiser durées travail/pause
3. **Timer** : Lancer avec audio Lo-Fi, contrôles play/pause/stop
4. **Suivi** : Sessions sauvegardées automatiquement dans l'historique

### Analyse et statistiques
1. **Filtres temporels** : Aujourd'hui, 7 jours, 30 jours, tout
2. **Métriques** : Taux de réussite, temps total, durée moyenne
3. **Historique détaillé** : Liste des sessions avec statuts

---

## 🌍 Internationalisation

L'application supporte le français et l'anglais avec :
- Détection automatique de la langue système
- Sauvegarde des préférences utilisateur
- Traductions complètes de l'interface
- Gestion des méthodes prédéfinies multilingues

---

## 👥 Auteur

- **Marine** — Développeuse Full-Stack (React Native, TypeScript, UX/UI)
