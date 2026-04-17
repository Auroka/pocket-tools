---
name: pocket-ui
description: Design and implement frontend pages, components, and style refinements for the Pocket Tools static tools project. Use when Codex needs to create or restyle `index.html`, `tools/*/index.html`, `src/styles/*`, or related UI code while keeping a simple, restrained, desktop-first aesthetic, native HTML/CSS/JS, independent tool pages, mobile compatibility, and two-space indentation.
---

# Pocket UI

## Overview

Apply the spirit of high-quality frontend design work, but default to a quiet and practical expression. Make deliberate visual choices, avoid generic AI-looking UI, and prefer clarity, hierarchy, spacing, and usable states over decorative noise.

## Working Model

Follow this order when handling page design or style work:

1. Read the target page and nearby shared styles first.
2. Identify the page's primary user task and the single most important action.
3. State an aesthetic direction in one short phrase before major edits, such as `quiet utility`, `editorial minimal`, or `soft efficiency`.
4. Adjust layout first, then spacing, then typography, then color, then interaction states.
5. Keep the change set narrow and do not redesign unrelated tools.

## Project Fit

- Use native `HTML`, `CSS`, and `JavaScript`.
- Reuse `src/styles/` shared tokens and components when consistency improves, but do not force every page into one shell.
- Keep each tool page independent; do not add bottom navigation, tab bars, or app-style global switching unless explicitly requested.
- Treat desktop as the main usage scenario and keep the result mobile-compatible.
- Preserve established page styles unless the user explicitly asks for a redesign. This is especially important for existing pomodoro and clock pages.
- Use two-space indentation in all code.
- Keep useful comments and add comments where code would otherwise be hard to understand. Do not remove comments unless replacing stale ones.

## Visual Direction

- Commit to one restrained aesthetic direction per task instead of mixing styles.
- Prefer light backgrounds, soft surface contrast, thin borders, measured shadows, and clean edges.
- Use one memorable detail at most, such as a precise accent color, a distinctive stat layout, or a refined hover treatment.
- Avoid loud gradients, heavy glassmorphism, overdrawn decoration, oversized shadows, and novelty-only visuals.
- Avoid generic AI UI patterns such as purple-on-white gradients, empty marketing-style spacing, and decorative widgets that do not improve use.

## Layout Rules

- Build obvious reading zones. For productivity pages, prefer simple left/right or top/bottom structure when it improves scanning.
- Keep dense information compact. Do not let cards or list items become taller than the information requires.
- Use spacing to express hierarchy. Important actions and titles should stand out without needing heavy color.
- Keep one primary action area per screen or section.
- When a desktop layout uses multiple columns, make the mobile layout stack cleanly without losing context.

## Typography and Color

- Keep typography readable and calm. Prefer dependable Chinese-friendly body text and strong but not flashy headings.
- Use consistent type scale and stable line height.
- Use a limited palette: one primary accent, neutral surfaces, and clear semantic colors for success, warning, and danger.
- Keep helper text muted and concise.
- Use tabular numbers for time, countdowns, and statistics when appropriate.

## Component Rules

- Make buttons visually consistent in height, padding, and alignment. Check icons and symbols for optical centering, not just mathematical centering.
- Make primary, secondary, and danger actions immediately distinguishable.
- Keep input labels visible. Use calm fields, clear focus rings, and practical helper text.
- Keep cards useful: enough padding to breathe, enough structure to scan, no extra ornament without purpose.
- Keep list rows compact but not cramped. Put metadata on one line when it improves scan speed.
- Make affordances obvious. If a user can complete, restore, delete, or dismiss something, the control should look actionable at a glance.

## State and Feedback Rules

- Always handle empty, disabled, error, success, and loading-like states clearly when they exist.
- For browser notifications or reminders, show permission state and provide a fallback when system notification is unavailable.
- Preserve behavior and storage contracts unless the user explicitly asks to change them.

## Implementation Notes

- Prefer editing shared styles before duplicating patterns across tools.
- When changing an existing page, preserve working behavior and data flow unless the task is a redesign.
- Keep HTML structure readable. Split content and action zones cleanly when that improves maintenance.
- Keep CSS names straightforward and local to the feature unless a shared abstraction is clearly reusable.

## Finish Checklist

- Confirm the page has a clear primary action and visual hierarchy.
- Confirm spacing is consistent across cards, controls, and headings.
- Confirm controls align correctly, especially icon buttons, pills, and mixed action groups.
- Confirm desktop layout feels intentional and mobile layout still works.
- Run lightweight validation commands when appropriate.
- In the handoff, briefly state the chosen aesthetic direction and the main UI changes.
