# 坦克大战 - Tank Battle

## 1. Project Overview
- **Type**: Single HTML file game (Canvas-based)
- **Core**: Classic tank battle game inspired by NES Battle City
- **Players**: Single player vs AI enemy tanks

## 2. Visual & Rendering
- Canvas rendering at 480x480px
- Pixel-art style graphics drawn via Canvas API
- Grid-based map (13x13 tiles, 32px each)
- Color palette: dark military greens, browns, grays

## 3. Game Mechanics
- **Player tank**: Controlled by arrow keys (move) + Space (shoot)
- **Enemies**: 5 enemy tanks that respawn after destruction
- **Bullets**: Player and enemy bullets, destroy tanks on hit
- **Map**: Steel walls (indestructible), brick walls (destructible), river (blocks movement)
- **Win condition**: Destroy all enemy tanks
- **Lives**: Player has 3 lives, respawn on death

## 4. Controls
- Arrow Keys → Move tank (up/down/left/right)
- Space → Fire bullet
- Enter → Start / Restart game

## 5. Technical
- Single `index.html` with embedded CSS/JS
- No external dependencies
- 60 FPS game loop via `requestAnimationFrame`
- GitHub Pages compatible (static HTML)

## 6. Acceptance Criteria
- Game loads and shows title screen
- Player can move and shoot
- Enemies move and shoot automatically
- Collision detection works (walls, bullets, tanks)
- Score display updates on enemy kill
- Game over / victory screens work
