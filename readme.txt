The Retro Arcade
Developer: Thais Grays
Course: CIT 190 - JavaScript Programming
Date: April 2026

Overview
"The Retro Arcade" is a web-based game hub built with HTML, CSS, and vanilla JavaScript. No CSS frameworks, no JavaScript frameworks, and no jQuery. The hub uses a custom CSS UI with CRT-style scanline overlays, neon accents, and CSS Grid/Flexbox layouts to evoke a 1990s arcade. Game pages share a consistent layout: a centered main column, an "arcade cabinet" panel, and full-width action/return controls.

Assets for Propeller Pilot live in a /media folder at the project root (e.g. drone sprite, scrolling background, steel beam obstacles). Open index.html in a browser from the project folder so image paths resolve correctly.

The Games

1. Propeller Pilot (HTML Canvas & JavaScript)

Theme: A Flappy Bird-style side scroller: you steer a drone through gaps between obstacles.

Focus: Uses the HTML <canvas> API and requestAnimationFrame for the main loop. Physics use gravity and lift constants; obstacles are spawned with Math.random(); collision uses axis-aligned bounding-box checks with correct vertical overlap (so the drone does not register false hits above or below the gap). The background scrolls as a parallax layer; obstacles can be drawn with a steel beam image when available, with solid rectangles as fallback. Tuning includes scroll speed, gravity, gap height, and beam width.

2. Go Fish (Vanilla JavaScript & DOM)

Theme: Digital Go Fish against a simple AI ("Mainframe").

Focus: The deck and hands are plain JavaScript arrays. The UI is built with createElement, appendChild, and textContent. Event delegation on the player hand container (click + closest(".card")) keeps clicks working after the hand is re-dealt. A Japanese/English toggle uses a dictionary object for rank labels. The turn strip (YOUR TURN vs MAINFRAME TURN) and the message log use color coding: player vs bot lines, plus distinct colors for giving cards away vs receiving or drawing cards.

3. Checkers (JavaScript & CSS Grid)

Theme: An 8x8 checkers game on a neon-styled board with an AI opponent.

Focus: Selection logic, move generation (including jumps), king promotion, and AI turns. The board is laid out with CSS Grid. The script tracks multi-jump sequences with a consecutiveJumpPiece state so the player must finish a jump chain on the correct piece. The AI prefers jumps when available.

Project Reflections

Target Audience:
Casual gamers, retro-style UI fans, and anyone using the Japanese rank labels in Go Fish. Propeller Pilot ties to an aviation/drone theme and can sit on a personal or company site (e.g. VenturedSkies.com).

Interactive Features:
The hub menu uses :active styles on game cards for a button-press feel. Checkers highlights selection and enforces valid moves. Go Fish paces the AI with setTimeout so messages stay readable. Each game page includes Return to Menu (and in-game controls where applicable).

Layout and Color Scheme:
Layout relies on Flexbox and Grid. The palette is a dark #0a0a0a base with neon cyan, magenta, hot pink, and lime/green accents. index.html applies a body::after scanline gradient with pointer-events: none so it does not block clicks.

Coding Challenges

Collision Accuracy (Propeller Pilot): Early collision checks could register a hit when the drone was above the top obstacle. The logic was updated to test real vertical overlap with the top and bottom bars, in addition to horizontal overlap.

Smooth Frame Loop (Propeller Pilot): Physics and drawing run on requestAnimationFrame so updates stay aligned with the display refresh.

Dynamic Card Clicks (Go Fish): Clicks must work on cards created after deal. Fix: one listener on the player area and event.target.closest(".card") so dynamically added cards do not need per-card rebinding.

Infinite Turn Loops (Checkers): Incomplete multi-jump handling could leave the game stuck. Fix: consecutiveJumpPiece forces the jumping piece to stay selected until the chain is resolved.
