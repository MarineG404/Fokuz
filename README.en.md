# 🎯 Fokuz

\*[Français](README.md) | **English\***

## 📖 Description

A productivity mobile application built with React Native and Expo, designed to improve focus and time management. Fokuz offers concentration methods with different techniques (Pomodoro, Deep Work, 52/17) and a complete session tracking system.

The app combines mental wellness techniques with detailed statistical tracking to help users progressively and measurably develop their concentration abilities.

---

## 🚀 Features

- [x] **Focus methods** - Predefined methods catalog (Pomodoro, Deep Work, 52/17)
- [x] **Custom methods** - Create, edit and delete custom methods
- [x] **Smart timer** - Chronometer with work/break alternation and complete controls
- [x] **Session tracking** - Detailed history with status (completed/abandoned)
- [x] **Advanced statistics** - Dashboards with success rate, total time, average
- [x] **Smart filtering** - Period filters (today, 7 days, 30 days)
- [x] **Multilingual interface** - French/English support with i18next
- [x] **Responsive design** - Portrait/landscape mode interface
- [x] **Integrated audio player** - Lo-Fi music to enhance concentration
- [x] **Local persistence** - Automatic saving with AsyncStorage
- [x] **Modern navigation** - Drawer + Tabs with Expo Router

---

## 🛠️ Technologies

- **React Native & Expo** - Cross-platform mobile framework
- **TypeScript** - Typed language for enhanced robustness
- **i18n** - French/English internationalization
- **ESLint & Prettier** - Code quality and formatting

---

## 📂 Project structure

```bash
Fokuz/
├── app/                          # Navigation and screens (Expo Router)
│   ├── (drawer)/(tabs)/         # Main pages (index, history)
│   ├── method/[id].tsx          # Method detail page
│   └── settings.tsx             # Settings
├── components/                   # Reusable components
│   ├── cards/                   # MethodCard, SessionCard, StatsCard
│   ├── modals/                  # Add/Edit/ConfirmModal
│   ├── timer/TimerComponent.tsx # Main timer
│   └── ui/                      # HeaderTitle, BlockCard, FAB
├── contexts/                     # State management (custom methods)
├── hooks/                        # useAllMethods, useTimer
├── src/localization/            # i18n French/English
├── assets/data/methods.ts       # Predefined methods
└── utils/historyService.ts      # Session persistence
```

---

## ⚙️ Installation & Usage

### 1. Clone the project

```bash
git clone https://github.com/MarineG404/Fokuz.git
cd Fokuz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Available scripts

```bash
# Clean cache + start
npx expo start -c

# Linting and formatting
npm run lint                    # Check code
npm run lint:fix               # Auto-fix
npm run format                # Format with Prettier
npm run check                 # Format + lint + typecheck
```

---

## 🎮 Usage

### Main navigation

1. **Home** - Browse and select concentration methods
2. **History** - View sessions with filters and statistics
3. **Settings** - Theme and language configuration

### Method management

1. **Predefined methods** - Pomodoro (25/5), Deep Work (90min), 52/17
2. **Custom methods** - Create via + button with name, description, durations
3. **Edit/Delete** - Complete management of custom methods

### Focus sessions

1. **Selection** - Choose a method from home
2. **Configuration** - View work/break durations
3. **Timer** - Start with Lo-Fi audio, play/pause/stop controls
4. **Tracking** - Sessions automatically saved to history

### Analysis and statistics

1. **Time filters** - Today, 7 days, 30 days, all
2. **Metrics** - Success rate, total time, average duration
3. **Detailed history** - Session list with statuses

---

## 🌍 Internationalization

The application supports French and English with:

- Automatic system language detection
- User preference saving
- Complete interface translations
- Multilingual predefined methods management

---

## 👥 Author

- **Marine** — Full-Stack Developer (React Native, TypeScript, UX/UI)
