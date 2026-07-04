# 🐔 El Pollo Loco

Ein spannendes Jump & Run Spiel, bei dem der mexikanische Charakter Pepe gegen verrückte Hühner und den gefährlichen Endboss kämpft!

![El Pollo Loco](img/9_intro_outro_screens/start/startscreen_1.png)

## 🎮 Über das Spiel

El Pollo Loco ist ein browserbasiertes 2D Jump & Run Spiel, das mit reinem JavaScript, HTML5 Canvas und CSS entwickelt wurde. Steuere Pepe durch eine farbenfrohe mexikanische Welt, sammle Münzen und Flaschen, besiege Hühner und stelle dich dem mächtigen Endboss!

## ✨ Features

- 🎨 Handgezeichnete Grafiken und Animationen
- 🎵 Hintergrundmusik und Sound-Effekte
- 📱 Responsive Design mit Mobile Controls
- 🎯 Objektorientierte Programmierung (OOP)
- 💾 LocalStorage für Sound-Einstellungen
- 🏆 Verschiedene Sammelgegenstände (Münzen, Flaschen)
- ⚔️ Verschiedene Gegnertypen (normale Hühner, kleine Hühner, Endboss)
- 💪 Gesundheits-, Münz- und Flaschenstatusanzeigen
- 🎮 Tastatur- und Touch-Steuerung

## 🕹️ Spielsteuerung

### Tastatur (Desktop)
- **←** Pfeil links - Nach links bewegen
- **→** Pfeil rechts - Nach rechts bewegen
- **↑** Pfeil hoch - Springen
- **Leertaste** - Flasche werfen

### Touch (Mobile)
- Verwende die Touch-Buttons auf dem Bildschirm für die Steuerung

## 🎯 Spielziel

- Besiege alle Gegner auf deinem Weg
- Sammle Münzen und Flaschen
- Stelle dich dem Endboss am Ende des Levels
- Versuche, nicht deine gesamte Energie zu verlieren!

## 🛠️ Technologien

- **HTML5** - Struktur
- **CSS3** - Styling und Animationen
- **JavaScript (ES6+)** - Spiellogik und OOP
- **Canvas API** - 2D Rendering
- **LocalStorage** - Persistente Datenspeicherung

## 🏗️ Projektstruktur

```
el_pollo_loco/
├── index.html              # Haupt-HTML-Datei
├── style.css              # Styling
├── script.js              # Startskript
├── js/
│   ├── game.js           # Hauptspiellogik
│   └── mobile-controls.js # Touch-Steuerung
├── models/               # Spielobjekt-Klassen
│   ├── character.class.js
│   ├── world.class.js
│   ├── endboss.class.js
│   ├── chicken.class.js
│   └── ...
├── levels/               # Level-Konfigurationen
│   └── level1.js
├── img/                  # Grafiken und Sprites
├── audio/               # Sound-Effekte und Musik
└── docs/                # JSDoc Dokumentation
```

## 📦 Installation & Start

1. **Repository klonen:**
   ```bash
   git clone https://github.com/DEIN-USERNAME/el_pollo_loco.git
   ```

2. **In das Projektverzeichnis wechseln:**
   ```bash
   cd el_pollo_loco
   ```

3. **Spiel starten:**
   - Öffne die `index.html` Datei in einem modernen Webbrowser
   - Oder verwende einen lokalen Server (z.B. Live Server in VS Code)

## 🎓 Entwickelt als Teil der Developer Akademie

Dieses Projekt wurde im Rahmen der **Developer Akademie** entwickelt und demonstriert:
- Objektorientierte Programmierung in JavaScript
- Game Development mit Canvas API
- Kollisionserkennung und Physik
- Event-Handling und Animation
- Code-Organisation und Best Practices

## 📝 Dokumentation

Eine vollständige JSDoc-Dokumentation aller Klassen und Methoden ist im `/docs` Ordner verfügbar.

## 🎨 Credits

- **Grafiken:** Bereitgestellt von der Developer Akademie
- **Icons:** [Pixabay](https://pixabay.com/)
- **Sounds:** [Pixabay](https://pixabay.com/)
- **Entwickler:** Oliver Geschine

## 📄 Lizenz

Dieses Projekt wurde zu Bildungszwecken erstellt.

## 🚀 Live Demo

[Spiel jetzt spielen!](#) <!-- Füge hier deine GitHub Pages URL ein -->

---

**Viel Spaß beim Spielen! 🎮🐔**
