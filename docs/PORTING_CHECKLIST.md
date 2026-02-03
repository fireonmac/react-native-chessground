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
  - [ ] `pieceShiftMethod`:
    - [ ] `DRAG_OR_TAP`: Both valid.
    - [ ] `DRAG_ONLY`: Tapping ignored for movement.
    - [ ] `TAP_TWO_SQUARES`: Dragging ignored (optional, verify if needed).
  - [ ] `dragTargetKind`:
    - [ ] `SQUARE`: Drag feedback centers on finger.
    - [ ] `CIRCLE`: Drag feedback offset (finger doesn't cover piece).
  - [ ] `enableCoordinates`: Toggle valid rank/file labels.
  - [ ] `showValidMoves`: Toggle moving dots/rings.
  - [ ] `showLastMove`: Toggle last move highlight.

## 2. Rendering

- [x] **Board Background**: Correct Light/Dark square colors based on `colorScheme`.
- [ ] **Coordinates**:
  - [ ] Correctly positioned (corner/edge).
  - [ ] Correct text (1-8, a-h).
  - [ ] Correct colors (contrast against square).
- [ ] **Pieces**:
  - [x] Render pieces at correct square positions.
  - [ ] `opponentsPiecesUpsideDown`: Rotate opponent pieces 180° if enabled.
- [ ] **Highlights**:
  - [ ] **Last Move**: Highlight `from` and `to` squares.
  - [ ] **Selected Square**: Highlight currently selected piece's square.
  - [ ] **Check**: Special highlight (usually gradient/red) for King in check.
  - [ ] **Valid Moves**:
    - [ ] **Empty Square**: Small dot/circle.
    - [ ] **Occupied Square**: Ring/Corner markers (don't obscure piece).

## 3. State & Logic

- [ ] **Game Data**:
  - [ ] `validMoves`: Respects the map of valid destinations.
  - [ ] `sideToMove`: Updates correctly.
  - [ ] `isCheck`: Triggers check highlight.
- [ ] **Promotion**:
  - [ ] Valid pawn move to last rank triggers promotion selector.
  - [ ] Selector UI renders 4 pieces (Queen, Rook, Bishop, Knight).
  - [ ] Selector orientation matches board/player.
  - [ ] Selecting piece callback fires.
  - [ ] Canceling promotion resets state.

## 4. Interactions (Gestures)

- [ ] **Tap to Move**:
  1. Tap Piece -> Select (Highlight).
  2. Tap Valid Destination -> Move.
  3. Tap Invalid Destination (Empty) -> Deselect.
  4. Tap Invalid Destination (Piece) -> Select new piece (if own color).
- [ ] **Drag and Drop**:
  - [ ] **Drag Start**: Requires small threshold movement (prevent accidental drags).
  - [ ] **Drag Feedback**: "Ghost" piece follows finger.
  - [ ] **Drag End**:
    - [ ] Valid Square -> Move.
    - [ ] Invalid Square -> Snap back / Cancel.
  - [ ] **Visuals**: Piece being dragged should be hidden on original square? (Check Flutter behavior: ghost vs hidden).
- [ ] **Premove** (If mapped):
  - [ ] Select piece during opponent turn.
  - [ ] Highlight intended move.

## 5. Animations

- [ ] **Piece Translation**:
  - [ ] When FEN changes (move played), piece slides smoothly from `from` to `to`.
  - [ ] Duration configurable (`animationDuration`).
- [ ] **Piece Fading**:
  - [ ] Captured pieces fade out.
  - [ ] Promoted pawn fades out (replaced by new piece).
