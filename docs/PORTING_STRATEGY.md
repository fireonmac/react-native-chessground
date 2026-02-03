# Porting Strategy & Goals

## Goal

The primary objective is to create a **React Native** port of the `chessground` library, named `react-native-chessground`.

## Reason

While `chessground` is written in TypeScript, it is designed for the **Web** (DOM-based). Direct porting is not feasible due to platform differences.
`flutter-chessground` is an existing mobile implementation that solves mobile-specific interaction and rendering challenges.

## Strategy

We will adopt a **Hybrid Approach**:

1.  **Logic & Behavior (Source: `flutter-chessground`)**
    - **Interactions**: Drag & drop, tapping, and move validation logic should strictly follow the mobile implementation.
    - **Mobile Specifics**: Features like "tap-to-move", "drag targets", and responsive sizing are taken from the Flutter version.
    - **State**: Transient UI state (e.g., dragging piece, selected square) follows the Flutter widget state model.

2.  **Code Structure & Conventions (Source: `chessground` Web)**
    - **Language**: Since both are JS/TS, we adhere to the coding style, naming conventions, and file organization of the original web library where possible.
    - **Type Definitions**: We prefer the functional TypeScript style of the web library (Interfaces > Classes) over Dart's object-oriented patterns, provided it doesn't conflict with mobile logic.

## Summary

- **Logic**: $\approx$ `flutter-chessground`
- **Structure**: $\approx$ `chessground` (Web)
