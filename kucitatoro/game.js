"use strict";

const ROWS = 10;
const COLS = 9;
const SIDES = { GREEN: "green", BLUE: "blue" };
const OTHER = { green: "blue", blue: "green" };
const SIDE_LABEL = { green: "绿方", blue: "蓝方" };
const DIAGONALS = [[-1,-1],[-1,1],[1,-1],[1,1]];
const CARDINALS = [[-1,0],[0,1],[1,0],[0,-1]];
const EIGHT = [...CARDINALS, ...DIAGONALS];

const PIECES = {
  soldier: { glyph: "兵", name: "兵", move: "斜行 1 格", attack: "正向射程 1 · 最多 1 子", summary: "斜行一格后，可射击上下左右相邻的敌子；不能击杀火、石、炮、车。" },
  bow: { glyph: "弓", name: "弓", move: "斜行 1 格", attack: "正向射程 3 · 最多 1 子", summary: "斜行一格后，沿上下左右射击三格内遇到的第一个棋子；不能击杀盾、火、石。" },
  crossbow: { glyph: "弩", name: "弩", move: "斜行 1 格", attack: "正向射程 3 · 最多 2 子", summary: "斜行一格后，可先后射击最多两次，每次瞄准任一正方向；不能击杀盾。" },
  chariot: { glyph: "車", name: "車", move: "斜行 1 或 2 格", attack: "正向射程 1 · 最多 1 子", summary: "可斜行一格或两格，途中不可越子；随后可射击正方向相邻的任意敌子。" },
  fire: { glyph: "火", name: "火", move: "斜行 1 格", attack: "燃烧 1 格 / 射程 3", summary: "斜行后，选择燃烧四个正向邻格（最多四子），或射击三格内遇到的第一个敌子。不能击杀盾。" },
  cannon: { glyph: "砲", name: "砲", move: "斜行 1 格", attack: "正向射程 1、3、5", summary: "斜行后可射击正方向第 1、3 或 5 格。能越过其他棋子，但敌方盾会挡住其后的目标。" },
  shield: { glyph: "盾", name: "盾", move: "斜行 1 格", attack: "不攻击", summary: "只斜行一格，不射击。盾能抵御弓、弩和火，是保护阵线的关键棋子。" },
  stone: { glyph: "石", name: "石", move: "斜行 1 格", attack: "八向连续跳吃", summary: "平时斜行一格；吃子时跳过邻近敌子落到其后空格，可连续跳吃，也可随时停下。" },
  bomb: { glyph: "炸", name: "炸", move: "斜行 1 格", attack: "正向跳吃", summary: "平时斜行一格；也可越过同一行或列上无阻隔的敌子，落在其后一格。不可连跳。" },
  king: { glyph: "王", name: "王", move: "斜行 1 格 / 折行 2 格", attack: "八向射程 1", summary: "可斜行一格，或经一个空的斜格折行到正方向两格外；随后可击杀八向相邻的敌子。王阵亡即告负。" },
};

const SHOOTERS = new Set(["soldier","bow","crossbow","chariot","fire","cannon","king"]);
const ATTACK_BLOCKS = {
  soldier: new Set(["fire","stone","cannon","chariot"]),
  bow: new Set(["shield","fire","stone"]),
  crossbow: new Set(["shield"]),
  fire: new Set(["shield"]),
};

const PIECE_VALUE = {
  soldier: 280, shield: 430, bow: 500, stone: 560, chariot: 620,
  bomb: 680, crossbow: 720, fire: 760, cannon: 820, king: 10000,
};

const boardEl = document.querySelector("#board");
const turnToken = document.querySelector("#turnToken");
const turnEyebrow = document.querySelector("#turnEyebrow");
const turnCopy = document.querySelector("#turnCopy");
const phaseHint = document.querySelector("#phaseHint");
const endTurnButton = document.querySelector("#endTurnButton");
const burnButton = document.querySelector("#burnButton");
const undoButton = document.querySelector("#undoButton");
const historyList = document.querySelector("#historyList");
const winnerOverlay = document.querySelector("#winnerOverlay");

let state;
let undoStack = [];
let gameMode = "ai";
let humanSide = SIDES.GREEN;
let aiThinking = false;
let aiTimer = null;

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function put(board, side, type, positions) {
  positions.forEach(([r,c], index) => {
    board[r][c] = { id: `${side}-${type}-${r}-${c}-${index}`, side, type };
  });
}

function createInitialBoard() {
  const board = emptyBoard();
  put(board, SIDES.BLUE, "bomb", [[0,0],[0,8]]);
  put(board, SIDES.BLUE, "cannon", [[0,2],[0,6]]);
  put(board, SIDES.BLUE, "king", [[0,4]]);
  put(board, SIDES.BLUE, "crossbow", [[1,1],[1,7]]);
  put(board, SIDES.BLUE, "stone", [[1,3],[1,5]]);
  put(board, SIDES.BLUE, "bow", [[2,0],[2,8]]);
  put(board, SIDES.BLUE, "chariot", [[2,2],[2,6]]);
  put(board, SIDES.BLUE, "fire", [[2,4]]);
  put(board, SIDES.BLUE, "shield", [[3,1],[3,7]]);
  put(board, SIDES.BLUE, "soldier", [[3,3],[3,5]]);

  put(board, SIDES.GREEN, "soldier", [[6,3],[6,5]]);
  put(board, SIDES.GREEN, "shield", [[6,1],[6,7]]);
  put(board, SIDES.GREEN, "bow", [[7,0],[7,8]]);
  put(board, SIDES.GREEN, "chariot", [[7,2],[7,6]]);
  put(board, SIDES.GREEN, "fire", [[7,4]]);
  put(board, SIDES.GREEN, "crossbow", [[8,1],[8,7]]);
  put(board, SIDES.GREEN, "stone", [[8,3],[8,5]]);
  put(board, SIDES.GREEN, "bomb", [[9,0],[9,8]]);
  put(board, SIDES.GREEN, "cannon", [[9,2],[9,6]]);
  put(board, SIDES.GREEN, "king", [[9,4]]);
  return board;
}

function newState() {
  return {
    board: createInitialBoard(), turn: SIDES.GREEN, fullTurn: 1,
    phase: "select", selected: null, options: [], shots: 0,
    pending: null, history: [], winner: null,
  };
}

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function inBounds(r,c) { return r >= 0 && r < ROWS && c >= 0 && c < COLS; }
function at(r,c) { return inBounds(r,c) ? state.board[r][c] : null; }
function coord(r,c) { return `${c}${r}`; }
function sameSquare(a,b) { return a && b && a.r === b.r && a.c === b.c; }

function canAttack(attackerType, defenderType) {
  return !ATTACK_BLOCKS[attackerType]?.has(defenderType);
}

function stepOptions(r,c, vectors = DIAGONALS, distance = 1) {
  const result = [];
  vectors.forEach(([dr,dc]) => {
    const nr = r + dr * distance;
    const nc = c + dc * distance;
    if (inBounds(nr,nc) && !at(nr,nc)) result.push({ r:nr, c:nc, kind:"move" });
  });
  return result;
}

function movementOptions(r,c,piece) {
  if (piece.type === "stone") {
    return [...stepOptions(r,c), ...stoneCaptures(r,c,piece.side)];
  }
  if (piece.type === "bomb") {
    return [...stepOptions(r,c), ...bombCaptures(r,c,piece.side)];
  }
  if (piece.type === "chariot") {
    const result = stepOptions(r,c);
    DIAGONALS.forEach(([dr,dc]) => {
      const mr = r + dr, mc = c + dc, nr = r + 2*dr, nc = c + 2*dc;
      if (inBounds(nr,nc) && !at(mr,mc) && !at(nr,nc)) result.push({r:nr,c:nc,kind:"move"});
    });
    return result;
  }
  if (piece.type === "king") {
    const result = stepOptions(r,c);
    CARDINALS.forEach(([dr,dc]) => {
      const nr = r + 2*dr, nc = c + 2*dc;
      if (!inBounds(nr,nc) || at(nr,nc)) return;
      const intermediates = dr !== 0
        ? [[r+dr,c-1],[r+dr,c+1]]
        : [[r-1,c+dc],[r+1,c+dc]];
      if (intermediates.some(([ir,ic]) => inBounds(ir,ic) && !at(ir,ic))) {
        result.push({r:nr,c:nc,kind:"move",fold:true});
      }
    });
    return dedupe(result);
  }
  return stepOptions(r,c);
}

function stoneCaptures(r,c,side) {
  const result = [];
  EIGHT.forEach(([dr,dc]) => {
    const mr=r+dr, mc=c+dc, nr=r+2*dr, nc=c+2*dc;
    const jumped = at(mr,mc);
    if (inBounds(nr,nc) && jumped?.side === OTHER[side] && !at(nr,nc)) {
      result.push({r:nr,c:nc,kind:"stone-capture",capture:{r:mr,c:mc}});
    }
  });
  return result;
}

function bombCaptures(r,c,side) {
  const result = [];
  CARDINALS.forEach(([dr,dc]) => {
    let nr=r+dr, nc=c+dc;
    while (inBounds(nr,nc) && !at(nr,nc)) { nr+=dr; nc+=dc; }
    if (!inBounds(nr,nc) || at(nr,nc)?.side !== OTHER[side]) return;
    const lr=nr+dr, lc=nc+dc;
    if (inBounds(lr,lc) && !at(lr,lc)) result.push({r:lr,c:lc,kind:"bomb-capture",capture:{r:nr,c:nc}});
  });
  return result;
}

function dedupe(options) {
  const seen = new Set();
  return options.filter(o => { const key=`${o.r},${o.c},${o.kind}`; if(seen.has(key)) return false; seen.add(key); return true; });
}

function rayTargets(r,c,maxRange,type) {
  const result=[];
  CARDINALS.forEach(([dr,dc]) => {
    for(let d=1; d<=maxRange; d++) {
      const nr=r+dr*d, nc=c+dc*d;
      if(!inBounds(nr,nc)) break;
      const target=at(nr,nc);
      if(!target) continue;
      if(target.side === OTHER[state.turn] && canAttack(type,target.type)) result.push({r:nr,c:nc,kind:"attack"});
      break;
    }
  });
  return result;
}

function cannonTargets(r,c) {
  const result=[];
  CARDINALS.forEach(([dr,dc]) => {
    for(let d=1; d<=5; d++) {
      const nr=r+dr*d, nc=c+dc*d;
      if(!inBounds(nr,nc)) break;
      const target=at(nr,nc);
      if(target?.side === OTHER[state.turn] && [1,3,5].includes(d)) result.push({r:nr,c:nc,kind:"attack"});
      if(target?.side === OTHER[state.turn] && target.type === "shield") break;
    }
  });
  return result;
}

function attackOptions(r,c,piece) {
  switch(piece.type) {
    case "soldier": return rayTargets(r,c,1,piece.type);
    case "bow": return rayTargets(r,c,3,piece.type);
    case "crossbow": return rayTargets(r,c,3,piece.type);
    case "chariot": return rayTargets(r,c,1,piece.type);
    case "fire": return rayTargets(r,c,3,piece.type);
    case "cannon": return cannonTargets(r,c);
    case "king": return EIGHT.flatMap(([dr,dc]) => {
      const nr=r+dr,nc=c+dc,target=at(nr,nc);
      return inBounds(nr,nc) && target?.side === OTHER[state.turn] ? [{r:nr,c:nc,kind:"attack"}] : [];
    });
    default: return [];
  }
}

function burnTargets(r,c) {
  return CARDINALS.flatMap(([dr,dc]) => {
    const nr=r+dr,nc=c+dc,target=at(nr,nc);
    return inBounds(nr,nc) && target?.side === OTHER[state.turn] && canAttack("fire",target.type)
      ? [{r:nr,c:nc,kind:"burn"}] : [];
  });
}

function isComputerTurn() {
  return gameMode === "ai" && state.turn === OTHER[humanSide] && !state.winner;
}

function actorLabel(side) {
  if(gameMode !== "ai") return SIDE_LABEL[side];
  return side === humanSide ? `玩家（${side===SIDES.GREEN?"绿":"蓝"}）` : `电脑（${side===SIDES.GREEN?"绿":"蓝"}）`;
}

function withPreviewMove(from, option, piece, callback) {
  const destinationPiece = state.board[option.r][option.c];
  const capturedPiece = option.capture ? state.board[option.capture.r][option.capture.c] : null;
  state.board[from.r][from.c] = null;
  state.board[option.r][option.c] = piece;
  if(option.capture) state.board[option.capture.r][option.capture.c] = null;
  const result = callback();
  state.board[from.r][from.c] = piece;
  state.board[option.r][option.c] = destinationPiece;
  if(option.capture) state.board[option.capture.r][option.capture.c] = capturedPiece;
  return result;
}

function optionCaptureValue(option) {
  const target = option.capture ? at(option.capture.r,option.capture.c) : null;
  return target ? PIECE_VALUE[target.type] : 0;
}

function targetScore(option) {
  const target=at(option.r,option.c);
  return target ? PIECE_VALUE[target.type] : 0;
}

function scoreAIMove(from, option, piece) {
  let score = optionCaptureValue(option) * 4;
  const progress=piece.side===SIDES.BLUE ? option.r-from.r : from.r-option.r;
  score += progress * 7;
  score += (4 - Math.abs(option.c - 4)) * 2;
  const homeDistance=piece.side===SIDES.BLUE ? option.r : ROWS-1-option.r;
  if(piece.type === "king") score -= homeDistance * 5;

  score += withPreviewMove(from, option, piece, () => {
    if(!SHOOTERS.has(piece.type)) return 0;
    const shots=attackOptions(option.r,option.c,piece).map(targetScore).sort((a,b)=>b-a);
    let best=piece.type === "crossbow" ? (shots[0]||0)+(shots[1]||0) : (shots[0]||0);
    if(piece.type === "fire") {
      const burn=burnTargets(option.r,option.c).reduce((sum,target)=>sum+targetScore(target),0);
      best=Math.max(best,burn);
    }
    return best * 3;
  });
  return score + Math.random() * 16;
}

function chooseAIMove() {
  const choices=[];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
    const piece=at(r,c);
    if(piece?.side !== OTHER[humanSide]) continue;
    movementOptions(r,c,piece).forEach(option => {
      choices.push({from:{r,c},option,piece,score:scoreAIMove({r,c},option,piece)});
    });
  }
  choices.sort((a,b)=>b.score-a.score);
  return choices[0] || null;
}

function scheduleAI(delay=520) {
  clearTimeout(aiTimer);
  if(!isComputerTurn()) { aiThinking=false; return; }
  aiThinking=true;
  render();
  aiTimer=setTimeout(() => {
    aiThinking=false;
    runAIStage();
  },delay);
}

function runAIStage() {
  if(!isComputerTurn()) return;
  if(state.phase === "select") {
    const choice=chooseAIMove();
    if(!choice) {
      state.history.push("电脑无可行棋，本回合跳过");
      if(state.turn===SIDES.BLUE) state.fullTurn+=1;
      state.turn=OTHER[state.turn];
      render();
      return;
    }
    state.selected=choice.from;
    state.options=movementOptions(choice.from.r,choice.from.c,choice.piece);
    beginMove(choice.option);
  } else if(state.phase === "chain") {
    const choice=[...state.options].sort((a,b)=>optionCaptureValue(b)-optionCaptureValue(a))[0];
    if(choice) continueStone(choice); else finishTurn();
  } else if(state.phase === "attack") {
    const piece=at(state.selected.r,state.selected.c);
    const shots=[...state.options].sort((a,b)=>targetScore(b)-targetScore(a));
    if(piece?.type === "fire") {
      const burns=burnTargets(state.selected.r,state.selected.c);
      const burnScore=burns.reduce((sum,target)=>sum+targetScore(target),0);
      if(burnScore > 0 && burnScore >= (shots[0] ? targetScore(shots[0]) : 0)) performBurn();
      else if(shots[0]) performAttack(shots[0]);
      else finishTurn();
    } else if(shots[0]) performAttack(shots[0]);
    else finishTurn();
  }
  if(isComputerTurn()) scheduleAI(360);
}

function selectPiece(r,c) {
  const piece=at(r,c);
  if(!piece || piece.side !== state.turn || state.winner || isComputerTurn() || aiThinking) return;
  state.selected={r,c};
  state.options=movementOptions(r,c,piece);
  render();
}

function beginMove(option) {
  const from={...state.selected};
  const piece=at(from.r,from.c);
  undoStack.push(cloneState(state));
  state.board[option.r][option.c]=piece;
  state.board[from.r][from.c]=null;
  state.pending={side:piece.side,type:piece.type,from,to:{r:option.r,c:option.c},captures:[],mode:""};

  if(option.capture) captureAt(option.capture.r,option.capture.c);
  state.selected={r:option.r,c:option.c};

  if(state.winner) {
    finishTurn();
    return;
  }

  if(option.kind === "stone-capture") {
    state.phase="chain";
    state.options=stoneCaptures(option.r,option.c,piece.side);
    if(!state.options.length) finishTurn(); else render();
    return;
  }
  if(option.kind === "bomb-capture" || piece.type === "shield" || piece.type === "stone" || piece.type === "bomb") {
    finishTurn();
    return;
  }
  if(SHOOTERS.has(piece.type)) {
    state.phase="attack";
    state.shots=0;
    state.options=attackOptions(option.r,option.c,piece);
    if(!state.options.length) {
      finishTurn();
      return;
    }
    render();
    return;
  }
  finishTurn();
}

function continueStone(option) {
  const from={...state.selected};
  const piece=at(from.r,from.c);
  state.board[option.r][option.c]=piece;
  state.board[from.r][from.c]=null;
  captureAt(option.capture.r,option.capture.c);
  state.selected={r:option.r,c:option.c};
  if(state.winner) {
    finishTurn();
    return;
  }
  state.options=stoneCaptures(option.r,option.c,piece.side);
  if(!state.options.length) finishTurn(); else render();
}

function performAttack(option) {
  captureAt(option.r,option.c);
  if(state.winner) {
    finishTurn();
    return;
  }
  const piece=at(state.selected.r,state.selected.c);
  state.shots += 1;
  if(piece.type === "crossbow" && state.shots < 2) {
    state.options=attackOptions(state.selected.r,state.selected.c,piece);
    if(state.options.length) { render(); return; }
  }
  finishTurn();
}

function performBurn() {
  if(state.phase !== "attack") return;
  const piece=at(state.selected.r,state.selected.c);
  if(piece?.type !== "fire") return;
  const targets=burnTargets(state.selected.r,state.selected.c);
  if(!targets.length) return;
  state.pending.mode="燃烧";
  targets.forEach(target => captureAt(target.r,target.c));
  finishTurn();
}

function captureAt(r,c) {
  const victim=at(r,c);
  if(!victim) return;
  state.pending.captures.push({r,c,type:victim.type});
  state.board[r][c]=null;
  if(victim.type === "king") state.winner=state.pending.side;
}

function finishTurn() {
  if(!state.pending) return;
  state.history.push(formatHistory(state.pending));
  if(state.winner) { state.phase="over"; state.options=[]; render(); return; }
  if(state.turn === SIDES.BLUE) state.fullTurn += 1;
  state.turn=OTHER[state.turn];
  state.phase="select";
  state.selected=null;
  state.options=[];
  state.shots=0;
  state.pending=null;
  render();
  if(isComputerTurn()) scheduleAI();
}

function formatHistory(move) {
  const captureText=move.captures.length
    ? ` · ${move.mode || "击杀"} ${move.captures.map(v => `${coord(v.r,v.c)}${PIECES[v.type].glyph}`).join("、")}`
    : "";
  return `${actorLabel(move.side)} ${coord(move.from.r,move.from.c)}→${coord(move.to.r,move.to.c)} ${PIECES[move.type].glyph}${captureText}`;
}

function handleCell(r,c) {
  if(state.winner || isComputerTurn() || aiThinking) return;
  const option=state.options.find(item => item.r===r && item.c===c);
  if(state.phase === "select") {
    if(option) beginMove(option); else selectPiece(r,c);
  } else if(state.phase === "attack") {
    if(option) performAttack(option);
  } else if(state.phase === "chain") {
    if(option) continueStone(option);
  }
}

function pieceAria(piece,r,c) {
  return `${SIDE_LABEL[piece.side]}${PIECES[piece.type].name}，坐标${coord(r,c)}`;
}

function renderBoard() {
  boardEl.replaceChildren();
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
    const cell=document.createElement("button");
    cell.type="button";
    const squareSide=(r+c)%2===0 ? SIDES.BLUE : SIDES.GREEN;
    const home=(squareSide===SIDES.BLUE && r<5)||(squareSide===SIDES.GREEN && r>=5);
    cell.className=`cell ${squareSide} ${home?"home":"away"}`;
    cell.setAttribute("role","gridcell");
    cell.dataset.row=r; cell.dataset.col=c;
    const piece=at(r,c);
    const option=state.options.find(o=>o.r===r&&o.c===c);
    if(sameSquare(state.selected,{r,c})) cell.classList.add("selected");
    if(option) cell.classList.add(state.phase==="select" && option.kind==="move" ? "legal" : "capture");
    const cellLabel=piece ? pieceAria(piece,r,c) : `空格，坐标${coord(r,c)}`;
    cell.setAttribute("aria-label", `${cellLabel}${option?"，可选择":""}`);
    cell.disabled=isComputerTurn() || aiThinking;
    if(piece) {
      const token=document.createElement("span");
      token.className=`piece ${piece.side} ${piece.type}`;
      const glyph=document.createElement("span"); glyph.textContent=PIECES[piece.type].glyph;
      token.append(glyph); cell.append(token);
    }
    cell.addEventListener("click",()=>handleCell(r,c));
    boardEl.append(cell);
  }
}

function renderTurn() {
  const side=state.turn;
  turnToken.className=`turn-token ${side}`;
  turnToken.textContent=side===SIDES.GREEN?"绿":"蓝";
  turnEyebrow.textContent=`第 ${state.fullTurn} 回合`;
  document.querySelector("#greenPlayer").classList.toggle("active",side===SIDES.GREEN);
  document.querySelector("#bluePlayer").classList.toggle("active",side===SIDES.BLUE);

  if(state.winner) turnCopy.textContent=`${actorLabel(state.winner)}获胜`;
  else if(aiThinking) turnCopy.textContent="电脑正在思考…";
  else if(state.phase==="select") turnCopy.textContent=`${actorLabel(side)}行棋 · 请选择棋子`;
  else if(state.phase==="chain") turnCopy.textContent="石可继续跳吃，或结束回合";
  else if(state.phase==="attack") turnCopy.textContent="移动完成 · 选择射击目标";

  const selected=state.selected ? at(state.selected.r,state.selected.c) : null;
  if(aiThinking) phaseHint.textContent="电脑正在评估走法、攻击目标和王的安全。";
  else if(state.phase==="select") phaseHint.textContent=state.selected
    ? (state.options.length ? `已选${PIECES[selected.type].name}：请选择标记的落点。` : "这枚棋子目前没有可行位置，请选择其他棋子。")
    : `点击一枚${SIDE_LABEL[side]}棋子，棋盘会标出可行位置。`;
  if(state.phase==="attack") phaseHint.textContent=state.options.length
    ? `${PIECES[selected.type].name}已就位：选择金色标记的目标，或不射击直接结束。`
    : `${PIECES[selected.type].name}已就位，但当前没有可攻击目标。`;
  if(state.phase==="chain") phaseHint.textContent="选择金色标记继续跳吃；也可以现在停下。";

  endTurnButton.hidden=isComputerTurn() || !(state.phase==="attack"||state.phase==="chain");
  const fireReady=!isComputerTurn() && state.phase==="attack" && selected?.type==="fire";
  burnButton.hidden=!fireReady;
  burnButton.disabled=fireReady && burnTargets(state.selected.r,state.selected.c).length===0;
}

function renderSelected() {
  const piece=state.selected ? at(state.selected.r,state.selected.c) : null;
  const name=document.querySelector("#selectedName");
  const preview=document.querySelector("#piecePreview");
  const summary=document.querySelector("#pieceSummary");
  const stats=document.querySelector("#pieceStats");
  if(!piece) {
    name.textContent="尚未选择"; preview.textContent="斜"; preview.className="piece-preview";
    summary.textContent="选择棋子后，这里会显示它的走法和攻击方式。"; stats.hidden=true; return;
  }
  const info=PIECES[piece.type];
  name.textContent=`${SIDE_LABEL[piece.side]} · ${info.name}`;
  preview.textContent=info.glyph; preview.className=`piece-preview ${piece.side}`;
  summary.textContent=info.summary; stats.hidden=false;
  document.querySelector("#moveStat").textContent=info.move;
  document.querySelector("#attackStat").textContent=info.attack;
}

function renderCounts() {
  const counts={green:0,blue:0};
  state.board.flat().forEach(piece=>{if(piece) counts[piece.side]++;});
  document.querySelector("#greenCount").textContent=counts.green;
  document.querySelector("#blueCount").textContent=counts.blue;
}

function renderHistory() {
  historyList.replaceChildren();
  if(!state.history.length) {
    const li=document.createElement("li"); li.className="empty-history"; li.textContent="棋局开始，绿方先行。"; historyList.append(li); return;
  }
  state.history.forEach(entry=>{const li=document.createElement("li"); li.textContent=entry; historyList.append(li);});
  historyList.scrollTop=historyList.scrollHeight;
}

function renderWinner() {
  winnerOverlay.hidden=!state.winner;
  if(state.winner) {
    document.querySelector("#winnerTitle").textContent=`${actorLabel(state.winner)}获胜`;
    document.querySelector("#winnerCopy").textContent=`${actorLabel(OTHER[state.winner])}的王已阵亡，本局结束。`;
  }
}

function renderMode() {
  const aiButton=document.querySelector("#aiModeButton");
  const humanButton=document.querySelector("#humanModeButton");
  const aiActive=gameMode==="ai";
  aiButton.classList.toggle("active",aiActive);
  humanButton.classList.toggle("active",!aiActive);
  aiButton.setAttribute("aria-pressed",String(aiActive));
  humanButton.setAttribute("aria-pressed",String(!aiActive));
  const playerFirst=humanSide===SIDES.GREEN;
  document.querySelector("#brandSubtitle").textContent=`第二版 · ${aiActive?`人机对战 · 玩家${playerFirst?"先手":"后手"}`:"双人对弈"}`;
  document.querySelector("#greenRole").textContent=aiActive ? `${playerFirst?"玩家":"电脑"} · 先手` : "先手";
  document.querySelector("#blueRole").textContent=aiActive ? `${playerFirst?"电脑":"玩家"} · 后手` : "后手";
  const sideChoice=document.querySelector("#sideChoice");
  sideChoice.hidden=!aiActive;
  const greenButton=document.querySelector("#playGreenButton");
  const blueButton=document.querySelector("#playBlueButton");
  greenButton.classList.toggle("active",playerFirst);
  blueButton.classList.toggle("active",!playerFirst);
  greenButton.setAttribute("aria-pressed",String(playerFirst));
  blueButton.setAttribute("aria-pressed",String(!playerFirst));
}

function render() {
  renderBoard(); renderTurn(); renderSelected(); renderCounts(); renderHistory(); renderWinner(); renderMode();
  const awaitingFirstHumanMove=gameMode==="ai" && state.turn===humanSide && state.phase==="select" && undoStack.length<2;
  undoButton.disabled=undoStack.length===0 || aiThinking || isComputerTurn() || awaitingFirstHumanMove;
}

function restart() {
  clearTimeout(aiTimer);
  aiThinking=false;
  state=newState(); undoStack=[]; render();
  if(isComputerTurn()) scheduleAI(620);
}

function undo() {
  if(!undoStack.length) return;
  clearTimeout(aiTimer);
  aiThinking=false;
  const steps=gameMode==="ai" && state.turn===humanSide && state.phase==="select" && undoStack.length>1 ? 2 : 1;
  for(let i=0;i<steps;i++) state=undoStack.pop();
  state.phase="select";
  state.selected=null;
  state.options=[];
  state.pending=null;
  state.shots=0;
  state.winner=null;
  render();
}

function setGameMode(mode) {
  if(mode===gameMode) return;
  if((state.history.length || state.pending) && !confirm("切换模式会重新开始当前棋局，继续吗？")) return;
  gameMode=mode;
  restart();
}

function setHumanSide(side) {
  if(side===humanSide) return;
  if((state.history.length || state.pending) && !confirm("更换先后手会重新开始当前棋局，继续吗？")) return;
  humanSide=side;
  restart();
}

function buildRuleGrid() {
  const grid=document.querySelector("#ruleGrid");
  Object.values(PIECES).forEach(info=>{
    const item=document.createElement("div"); item.className="rule-item";
    item.innerHTML=`<span class="rule-glyph">${info.glyph}</span><span><strong>${info.name}</strong><span>${info.move}；${info.attack}</span></span>`;
    grid.append(item);
  });
}

endTurnButton.addEventListener("click",finishTurn);
burnButton.addEventListener("click",performBurn);
undoButton.addEventListener("click",undo);
document.querySelector("#restartButton").addEventListener("click",()=>{ if(confirm("要放弃当前棋局并重新摆棋吗？")) restart(); });
document.querySelector("#playAgainButton").addEventListener("click",restart);
document.querySelector("#aiModeButton").addEventListener("click",()=>setGameMode("ai"));
document.querySelector("#humanModeButton").addEventListener("click",()=>setGameMode("human"));
document.querySelector("#playGreenButton").addEventListener("click",()=>setHumanSide(SIDES.GREEN));
document.querySelector("#playBlueButton").addEventListener("click",()=>setHumanSide(SIDES.BLUE));

const rulesDialog=document.querySelector("#rulesDialog");
document.querySelector("#rulesButton").addEventListener("click",()=>rulesDialog.showModal());
document.querySelector("#closeRulesButton").addEventListener("click",()=>rulesDialog.close());
rulesDialog.addEventListener("click",event=>{if(event.target===rulesDialog) rulesDialog.close();});

buildRuleGrid();
restart();
