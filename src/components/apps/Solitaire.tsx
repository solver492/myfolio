import React, { useState, useCallback } from 'react';

type Suit = '♠' | '♥' | '♦' | '♣';
type Color = 'red' | 'black';
interface Card { suit: Suit; value: number; faceUp: boolean; id: string }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const SUIT_COLOR: Record<Suit, Color> = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
const VALUE_LABEL: Record<number, string> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
const label = (v: number) => VALUE_LABEL[v] ?? String(v);

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS)
    for (let v = 1; v <= 13; v++)
      deck.push({ suit, value: v, faceUp: false, id: `${suit}${v}` });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initGame() {
  const deck = buildDeck();
  const tableau: Card[][] = Array.from({ length: 7 }, () => []);
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++], faceUp: row === col };
      tableau[col].push(card);
    }
  }
  return { tableau, stock: deck.slice(idx).map((c) => ({ ...c, faceUp: false })), waste: [] as Card[], foundations: [[], [], [], []] as Card[][] };
}

function canDropOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) return card.value === 1;
  const top = foundation[foundation.length - 1];
  return top.suit === card.suit && card.value === top.value + 1;
}

function canDropOnTableau(card: Card, col: Card[]): boolean {
  if (col.length === 0) return card.value === 13;
  const top = col[col.length - 1];
  if (!top.faceUp) return false;
  return SUIT_COLOR[card.suit] !== SUIT_COLOR[top.suit] && card.value === top.value - 1;
}

export function Solitaire() {
  const [state, setState] = useState(initGame);
  const [selected, setSelected] = useState<{ source: string; cardIdx: number } | null>(null);
  const [won, setWon] = useState(false);

  const checkWin = (foundations: Card[][]) => foundations.every((f) => f.length === 13);

  const drawFromStock = useCallback(() => {
    setState((prev) => {
      if (prev.stock.length === 0) {
        if (prev.waste.length === 0) return prev;
        return { ...prev, stock: [...prev.waste].reverse().map((c) => ({ ...c, faceUp: false })), waste: [] };
      }
      const card = { ...prev.stock[prev.stock.length - 1], faceUp: true };
      return { ...prev, stock: prev.stock.slice(0, -1), waste: [...prev.waste, card] };
    });
    setSelected(null);
  }, []);

  const selectWaste = useCallback(() => {
    setState((prev) => {
      if (prev.waste.length === 0) return prev;
      setSelected({ source: 'waste', cardIdx: prev.waste.length - 1 });
      return prev;
    });
  }, []);

  const selectTableau = useCallback((col: number, cardIdx: number) => {
    const card = state.tableau[col][cardIdx];
    if (!card.faceUp) return;
    if (selected) {
      // Try to drop
      const { source, cardIdx: fromIdx } = selected;
      let cards: Card[] = [];
      if (source === 'waste') {
        cards = [state.waste[state.waste.length - 1]];
      } else {
        const fromCol = parseInt(source.replace('tab', ''));
        cards = state.tableau[fromCol].slice(fromIdx);
      }
      if (cards.length > 0 && canDropOnTableau(cards[0], state.tableau[col].slice(0, cardIdx))) {
        setState((prev) => {
          const newState = { ...prev, tableau: prev.tableau.map((c) => [...c]), waste: [...prev.waste] };
          newState.tableau[col] = [...prev.tableau[col], ...cards];
          if (source === 'waste') {
            newState.waste = prev.waste.slice(0, -1);
          } else {
            const fromCol = parseInt(source.replace('tab', ''));
            newState.tableau[fromCol] = prev.tableau[fromCol].slice(0, fromIdx);
            if (newState.tableau[fromCol].length > 0) {
              newState.tableau[fromCol][newState.tableau[fromCol].length - 1] = { ...newState.tableau[fromCol][newState.tableau[fromCol].length - 1], faceUp: true };
            }
          }
          return newState;
        });
        setSelected(null);
        return;
      }
      setSelected(null);
    }
    setSelected({ source: `tab${col}`, cardIdx });
  }, [selected, state]);

  const dropOnFoundation = useCallback((foundIdx: number) => {
    if (!selected) return;
    const { source, cardIdx: fromIdx } = selected;
    let card: Card | null = null;
    if (source === 'waste') card = state.waste[state.waste.length - 1];
    else {
      const fromCol = parseInt(source.replace('tab', ''));
      const cards = state.tableau[fromCol].slice(fromIdx);
      if (cards.length === 1) card = cards[0];
    }
    if (!card || !canDropOnFoundation(card, state.foundations[foundIdx])) { setSelected(null); return; }
    setState((prev) => {
      const newFound = prev.foundations.map((f, i) => i === foundIdx ? [...f, card!] : f);
      const newState = { ...prev, foundations: newFound, tableau: prev.tableau.map((c) => [...c]), waste: [...prev.waste] };
      if (source === 'waste') {
        newState.waste = prev.waste.slice(0, -1);
      } else {
        const fromCol = parseInt(source.replace('tab', ''));
        newState.tableau[fromCol] = prev.tableau[fromCol].slice(0, fromIdx);
        if (newState.tableau[fromCol].length > 0)
          newState.tableau[fromCol][newState.tableau[fromCol].length - 1] = { ...newState.tableau[fromCol][newState.tableau[fromCol].length - 1], faceUp: true };
      }
      if (checkWin(newFound)) setWon(true);
      return newState;
    });
    setSelected(null);
  }, [selected, state]);

  const CardEl = ({ card, small = false, isSelected = false }: { card: Card; small?: boolean; isSelected?: boolean }) => (
    <div style={{
      width: small ? 50 : 60, height: small ? 70 : 85,
      background: card.faceUp ? 'white' : 'linear-gradient(135deg, #0044AA 25%, #0066CC 25%, #0066CC 50%, #0044AA 50%, #0044AA 75%, #0066CC 75%)',
      backgroundSize: card.faceUp ? undefined : '8px 8px',
      border: `2px solid ${isSelected ? '#FFD700' : '#888'}`,
      borderRadius: 4,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2px 4px',
      fontSize: small ? 11 : 13, fontWeight: 'bold', userSelect: 'none', cursor: 'pointer',
      color: card.faceUp ? (SUIT_COLOR[card.suit] === 'red' ? '#CC0000' : '#000000') : 'transparent',
      boxShadow: isSelected ? '0 0 6px #FFD700' : '1px 1px 3px rgba(0,0,0,0.3)',
      flexShrink: 0,
    }}>
      {card.faceUp && <><span>{label(card.value)}</span><span>{card.suit}</span></>}
    </div>
  );

  return (
    <div style={{ fontFamily: 'var(--xp-font)', padding: 8, background: '#076324', minHeight: '100%', overflow: 'auto' }}>
      {won && (
        <div style={{ textAlign: 'center', background: '#FFD700', padding: '8px', marginBottom: 8, fontSize: 14, fontWeight: 'bold', borderRadius: 4 }}>
          🎉 Félicitations ! Vous avez gagné ! 🎉
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Stock */}
        <div onClick={drawFromStock} style={{ width: 60, height: 85, border: '2px dashed #AAA', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>
          {state.stock.length > 0 ? '🂠' : '↩'}
        </div>
        {/* Waste */}
        <div onClick={selectWaste} style={{ position: 'relative', width: 60, height: 85 }}>
          {state.waste.length > 0
            ? <CardEl card={state.waste[state.waste.length - 1]} isSelected={selected?.source === 'waste'} />
            : <div style={{ width: 60, height: 85, border: '2px dashed #AAA', borderRadius: 4 }} />}
        </div>
        <div style={{ flex: 1 }} />
        {/* Foundations */}
        {state.foundations.map((f, i) => (
          <div key={i} onClick={() => dropOnFoundation(i)} style={{ width: 60, height: 85, border: '2px dashed #AAA', borderRadius: 4, cursor: 'pointer', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {f.length > 0 ? <CardEl card={f[f.length - 1]} /> : <span style={{ color: 'white', fontSize: 20 }}>{SUITS[i]}</span>}
          </div>
        ))}
        <button className="xp-btn" style={{ fontSize: 10, height: 22, padding: '0 8px', alignSelf: 'center' }} onClick={() => { setState(initGame()); setWon(false); setSelected(null); }}>
          Nouveau
        </button>
      </div>

      {/* Tableau */}
      <div style={{ display: 'flex', gap: 6 }}>
        {state.tableau.map((col, ci) => (
          <div key={ci} style={{ position: 'relative', width: 62, minHeight: 90 }}
            onClick={() => col.length === 0 && selected ? selectTableau(ci, 0) : undefined}>
            {col.length === 0 && (
              <div style={{ width: 60, height: 85, border: '2px dashed #AAA', borderRadius: 4 }} />
            )}
            {col.map((card, ri) => (
              <div key={card.id} style={{ position: ri === 0 ? 'relative' : 'absolute', top: ri === 0 ? 0 : ri * 20, left: 0, zIndex: ri }}
                onClick={(e) => { e.stopPropagation(); selectTableau(ci, ri); }}>
                <CardEl card={card} isSelected={selected?.source === `tab${ci}` && ri >= (selected?.cardIdx ?? 999)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
