The Retro Arcade
Developer: Thais Grays
Course: CIT190 - JavaScript Programming
Date: March 2026

Overview
"The Retro Arcade" is a web-based game hub demonstrating  HTML, CSS, and JavaScript/jQuery, no external frameworks used.
features a custom CSS UI with CRT scanline overlays, neon pulsing effects, and CSS Grid/Flexbox layouts to mimic a 90s arcade.

The Games
1. Propeller Pilot (HTML Canvas & JS)

Theme: Like Flappy Bird :A physics based side scroller featuring a drone.

Focus: Utilizes the HTML <canvas> API and requestAnimationFrame for a smooth game loop. gravity and lift constants, obstacle generation using Math.random(), and bounding-box for collision detection.


2. Go Fish:  (jQuery & HTML)

Theme: digital card matching  played against an AI opponent.

Focus: Heavily utilizes jQuery for DOM manipulation (.append(), .empty(), .text()) and event handling (.on('click')). It uses JavaScript Arrays to manage the deck and hands, uses functional Japanese/English Language Toggle using a JavaScript dictionary Object.


3. Glow Checkers (JS & CSS Grid)

Theme: A fully functional 8x8 checkers game with "Greedy AI."

Focus: focuses on Selection Structures and State Management. The board is rendered by CSS Grid. The JavaScript generates valid moves, including multi-jump combos, manages King crowning, and  AI opponent that prioritizes jimps.

Project Reflections

Target Audience:

This Arcade is intended for casual gamers, retro enthusiasts, and language number learners (via the Japanese toggle in Go Fish). The aviation and drone inside propeller pilot reflect my personal industry background, I intend to place Propeller pilot inside my company website (VenturedSkies.com)

Interactive Features:
The interface prioritizes tactile feedback. Game cards on the main menu use CSS :active states to simulate physical button presses. The Checkers board highlights valid selections and jumps, preventing illegal moves. Go Fish features a turn taking system using setTimeout to pace the computer's logic against the player's reading speed.

Layout and Color Scheme:
The layout is entirely a CSS Flexbox and Grid. The color palette is a dark #0a0a0a background with neon cyan, hot pink, and lime green accents to create a retro neon feel. A transparent body::after element is used to overlay a CSS gradient that simulates retro CRT TV scanlines without interfering with pointer events.

Menu Design:
The Main Page is a central Flexbox container. Every game has a highly visible Return to Menu or Restart button.

Coding Challenges:

Collision Jitter (Propeller Pilot): Initially, collision detection was tied to a basic setInterval, causing the drone to clip through pipes if the frame rate dropped. Resolution: Shifted the entire physics engine to requestAnimationFrame to make sure the math synced with the monitor's refresh rate.

Element Clicking (Go Fish): Standard jQuery .click() events failed to register when the deck dealt new cards to the DOM. Resolution: Implemented jQuery Event Delegation ($('#player-area').on('click', '.card', function)) to ensure the listeners applied to elements generated after the initial page load.

Infinite Turn Loops (Checkers): Putting in double jumps caused the game to lock up if the player didn't select the correct piece. Resolution: Created a specific consecutiveJumpPiece state variable. If a multi jump was detected, the game forced that exact piece to remain selected and locks all other inputs until the combo was finished.
