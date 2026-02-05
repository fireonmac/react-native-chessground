# Porting Verification Checklist

This checklist defines the criteria for a "perfect port" of `flutter-chessground` to `react-native-chessground`.
All items must be verified to ensure the React Native package matches the behavior and quality of the Flutter original.

## 1. Configuration & Props

- [x] **FEN Loading**: Board correctly renders any valid FEN string.
- [ ] **Orientation**:
  - [ ] `white` (default): White pieces at bottom.
  - [ ] `black`: Black pieces at bottom.
- [ ] **Interactive Mode**:
  - [ ] `game` provided: User can move pieces.
  - [ ] `game` null (or `viewOnly`): Board is read-only.
- [ ] **Settings (`ChessboardSettings`)**:
  - [x] `colorScheme`: Custom colors for board, highlights, etc.
  - [x] `pieceAssets`: Support for different piece sets (images/SVGs).
  - [x] `pieceShiftMethod`:
    - [x] `DRAG_OR_TAP`: Both valid.
    - [ ] `DRAG_ONLY`: Tapping ignored for movement.
    - [ ] `TAP_TWO_SQUARES`: Dragging ignored (optional, verify if needed).
  - [ ] `dragTargetKind`:
    - [ ] `SQUARE`: Drag feedback centers on finger.
    - [ ] `CIRCLE`: Drag feedback offset (finger doesn't cover piece).
  - [x] `enableCoordinates`: Toggle valid rank/file labels.
  - [x] `showValidMoves`: Toggle moving dots/rings.
  - [x] `showLastMove`: Toggle last move highlight.

## 2. Rendering

- [x] **Board Background**: Correct Light/Dark square colors based on `colorScheme`.
- [ ] **Coordinates**:
  - [x] Correctly positioned (corner/edge).
  - [x] Correct text (1-8, a-h).
  - [x] Correct colors (contrast against square).
- [ ] **Pieces**:
  - [x] Render pieces at correct square positions.
  - [ ] `opponentsPiecesUpsideDown`: Rotate opponent pieces 180° if enabled.
- [x] **Highlights**:
  - [x] **Last Move**: Highlight `from` and `to` squares.
  - [x] **Selected Square**: Highlight currently selected piece's square.
  - [x] **Check**: Special highlight (usually gradient/red) for King in check.
  - [x] **Valid Moves**:
    - [x] **Empty Square**: Small dot/circle.
    - [x] **Occupied Square**: Ring/Corner markers (don't obscure piece).

## 3. State & Logic

- [x] **Game Data**:
  - [x] `validMoves`: Respects the map of valid destinations.
  - [x] `sideToMove`: Updates correctly.
  - [x] `isCheck`: Triggers check highlight.
- [x] **Promotion**:
  - [x] Valid pawn move to last rank triggers promotion selector.
  - [x] Selector UI renders 4 pieces (Queen, Rook, Bishop, Knight).
  - [x] Selector orientation matches board/player.
  - [x] Selecting piece callback fires.
  - [x] Canceling promotion resets state.

## 4. Interactions (Gestures)

- [x] **Tap to Move**:
  1. Tap Piece -> Select (Highlight).
  2. Tap Valid Destination -> Move.
  3. Tap Invalid Destination (Empty) -> Deselect.
  4. Tap Invalid Destination (Piece) -> Select new piece (if own color).
- [x] **Drag and Drop**:
  - [x] **Drag Start**: Requires small threshold movement (prevent accidental drags).
  - [x] **Drag Feedback**: "Ghost" piece follows finger.
  - [x] **Drag End**:
    - [x] Valid Square -> Move.
    - [x] Invalid Square -> Snap back / Cancel.
  - [x] **Visuals**: Piece being dragged should be hidden on original square? (Check Flutter behavior: ghost vs hidden).
- [x] **Premove** (If mapped):
  - [x] Select piece during opponent turn.
  - [x] Highlight intended move.
  - [x] Auto-execute when legal.
  - [x] Cancel when illegal.

## 5. Animations

- [x] **Piece Translation**:
  - [x] When FEN changes (move played), piece slides smoothly from `from` to `to`.
  - [x] Duration configurable (`animationDuration`).
- [ ] **Piece Fading**:
  - [ ] Captured pieces fade out.
  - [ ] Promoted pawn fades out (replaced by new piece).
