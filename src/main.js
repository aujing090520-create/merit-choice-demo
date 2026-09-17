import './style.css';

const batches = [
  [
    { id: 'LA-001', theme: '破冰', returnToChat: true, returnPriority: 3, q: '认识一个有趣的人时，更喜欢？', a: '慢慢熟悉', b: '很快聊到深处', sameA: '慢慢熟悉这件事，最让你觉得舒服的是什么？', sameB: '什么样的聊天，会让你愿意很快聊到深处？', different: '慢慢熟悉和很快聊到深处，各自最吸引你的地方是什么？' },
    { id: 'LA-013', theme: '被在意', returnToChat: true, returnPriority: 2, q: '更容易感到被在意的是？', a: '对方认真听我说', b: '对方记得我说过的小事', sameA: '被认真听见的那一刻，通常是什么感觉？', sameB: '你最喜欢被记住哪一类小细节？', different: '被认真听见和被记住小细节，哪一种更让人安心？' },
    { id: 'LA-025', theme: '日常', returnToChat: true, returnPriority: 1, q: '为一件小事庆祝时，更喜欢？', a: '简单开心就好', b: '稍微有点仪式感', sameA: '最近有什么小事，值得简单开心一下？', sameB: '你心里的小仪式感，会是什么样？', different: '一件小事要怎么庆祝，才刚刚好？' }
  ],
  [
    { id: 'LA-004', theme: '破冰', returnToChat: true, returnPriority: 3, q: '刚认识时，更容易从哪里开始聊？', a: '日常小事', b: '一个有意思的话题', sameA: '最近有什么日常小事，意外让你记得很久？', sameB: '什么样的话题，会让你愿意继续说下去？', different: '日常小事和有意思的话题，哪一种更容易打开你？' },
    { id: 'LA-020', theme: '聊天感受', returnToChat: true, returnPriority: 2, q: '和人聊天舒服，通常因为？', a: '对方会回应我的感受', b: '对方会记住小细节', sameA: '被回应感受时，哪一句话最能让你放松？', sameB: '别人记住过你的哪件小事，让你很意外？', different: '被回应和被记住，哪一个瞬间更容易让人觉得被在意？' },
    { id: 'LA-031', theme: '分享欲', returnToChat: true, returnPriority: 1, q: '听到一首很适合当下的歌，更会？', a: '自己循环听', b: '发给想分享的人', sameA: '哪一首歌，是你会一个人循环很久的？', sameB: '最近有没有一首歌，正想分享给谁？', different: '一首歌想留给自己还是分享出去，通常取决于什么？' }
  ]
];

const state = {
  page: 'chat',
  tools: false,
  gameSheet: false,
  eligible: true,
  invited: false,
  invitationState: 'idle',
  phase: 'invite',
  batch: 0,
  selfQuestion: 0,
  otherQuestion: 0,
  roundAnswers: [],
  summaryPosted: false,
  sessionEnd: null,
  review: false,
  selectedRule: null
};

const rules = [
  ['FR-MQ-001', '资格开关', '游戏工具入口'],
  ['FR-MQ-002', '双方同意', '邀请卡'],
  ['FR-MQ-003', '同步作答', '二选一卡'],
  ['FR-MQ-004', '同时揭晓', '结果区'],
  ['FR-MQ-005', '重开与退出', '结算/退出']
];

const app = document.querySelector('#app');
const htAsset = '/ht/';
const icon = (name) => ({ plus: '＋', game: '⌘', back: '‹', more: '•••', close: '×', check: '✓', spark: '✦', clock: '◷' }[name] || '•');
const chatIcon = (name) => {
  const paths = {
    back: '<path d="m15 18-6-6 6-6"/>',
    more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.3a4.5 4.5 0 0 0 7 0M9 9.3h.01M15 9.3h.01"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 17 5-4 3 3 3-2 5 4"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-3 0h6"/>',
    phone: '<path d="m6.6 2.8 3.2 2.1-1.7 3.1c1.2 2.5 3.2 4.5 5.7 5.7l3.1-1.7 2.1 3.2c.3.4.2 1-.2 1.3l-1.5 1.1c-.7.5-1.5.6-2.3.3C8.9 15.8 4.2 11.1 2.2 5c-.3-.8-.2-1.7.3-2.3l1.1-1.5c.3-.4.9-.5 1.3-.2Z"/>',
    search: '<circle cx="10.5" cy="10.5" r="4.5"/><path d="m14 14 4.2 4.2"/>',
    shield: '<path d="M12 3 5.5 6v5c0 4.2 2.6 7.8 6.5 9.7 3.9-1.9 6.5-5.5 6.5-9.7V6Z"/>',
    exchange: '<path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3"/><circle cx="12" cy="12" r="8"/>',
    bookmark: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.8L6 21Z"/>',
    study: '<path d="M4 6.5 12 3l8 3.5-8 3.5Z"/><path d="M7 9.2V14c2.8 2 7.2 2 10 0V9.2M20 7v6"/>',
    game: '<path d="M7.2 7.3h9.6c2.1 0 3.7 1.6 4.1 3.6l.9 4.4c.4 2-1.9 3.4-3.2 1.8l-1.8-2.1H7.2l-1.8 2.1c-1.3 1.6-3.6.2-3.2-1.8l.9-4.4c.4-2 2-3.6 4.1-3.6Z"/><path d="M8 10.5v4m-2-2h4M16.5 12.3h.01M19 14h.01"/>',
    location: '<path d="M20 10.5c0 5.2-8 10.5-8 10.5S4 15.7 4 10.5a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10.5" r="2.5"/>',
    vote: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8M8 8h5M8 16h4"/>'
  };
  return `<svg class="chat-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.more}</svg>`;
};
const current = (index = state.selfQuestion) => batches[state.batch][index];
const marker = (id) => state.review ? `<span class="marker" data-rule="${id}" role="button" tabindex="0" aria-label="${id} 的规则标记">${id.slice(-1)}</span>` : '';

function resetRound() {
  state.phase = 'invite'; state.selfQuestion = 0; state.otherQuestion = 0; state.roundAnswers = []; state.summaryPosted = false; state.sessionEnd = null;
}

function roundComplete() {
  return batches[state.batch].every((q) => {
    const answer = state.roundAnswers.find((item) => item.id === q.id);
    return answer?.self && answer?.other;
  });
}

function answerFor(index) {
  const q = current(index);
  let answer = state.roundAnswers.find(item => item.id === q.id);
  if (!answer) {
    answer = { id: q.id, q: q.q, self: null, other: null };
    state.roundAnswers.push(answer);
  }
  return answer;
}

function answerText(q, value) {
  return value === 'a' ? q.a : q.b;
}

function conversationHighlight() {
  const sources = batches.flat();
  const candidates = state.roundAnswers
    .filter(item => item.self && item.other)
    .map(item => ({ item, source: sources.find(question => question.id === item.id) }))
    .filter(({ source }) => source?.returnToChat)
    .sort((left, right) => ((right.source.returnPriority + (right.item.self !== right.item.other ? 10 : 0)) - (left.source.returnPriority + (left.item.self !== left.item.other ? 10 : 0))));
  const selected = candidates[0];
  if (!selected) return null;
  const { item, source } = selected;
  const different = item.self !== item.other;
  const prompt = different ? source.different : item.self === 'a' ? source.sameA : source.sameB;
  return {
    ...item,
    self: source ? answerText(source, item.self) : item.self,
    other: source ? answerText(source, item.other) : item.other,
    prompt,
    different: Boolean(different)
  };
}

function setDemoState(view) {
  const questions = batches[state.batch];
  state.page = view === 'chat-result' ? 'chat' : 'game';
  state.tools = false; state.gameSheet = false; state.invited = true; state.summaryPosted = false;
  state.phase = 'question'; state.invitationState = 'accepted'; state.selfQuestion = 0; state.otherQuestion = 0;
  state.roundAnswers = []; state.sessionEnd = null;
  if (view === 'invite') { state.phase = 'invite'; state.invitationState = 'waiting'; return; }
  if (view === 'ready') { state.phase = 'invite'; state.invitationState = 'ready'; return; }
  if (view === 'expired') { state.phase = 'invite'; state.invitationState = 'expired'; return; }
  if (view === 'ended') { state.sessionEnd = 'ended'; return; }
  if (view === 'reveal') {
    state.roundAnswers = [{ id: questions[0].id, q: questions[0].q, self: 'a', other: 'b' }];
    return;
  }
  const sameAnswer = view === 'finish-same-a' ? 'a' : view === 'finish-same-b' ? 'b' : null;
  state.roundAnswers = questions.map((q, index) => ({ id: q.id, q: q.q, self: sameAnswer || ['a', 'a', 'b'][index], other: sameAnswer || ['b', 'a', 'a'][index] }));
  state.selfQuestion = 3; state.otherQuestion = 3;
  state.summaryPosted = true;
}

function renderSummaryCard(isCompanion = false) {
  if (!state.summaryPosted) return '';
  const highlight = conversationHighlight();
  if (!highlight) return '';
  const mine = isCompanion ? highlight.other : highlight.self;
  const theirs = isCompanion ? highlight.self : highlight.other;
  const partner = isCompanion ? '对方' : 'Mía';
  const sender = `<img class="chat-avatar" src="${htAsset}avatar-mia.png" alt="发起方"/>`;
  const card = `<section class="chat-summary-card"><div class="summary-card-head"><span>✦ 默契二选一</span><small>这一轮的小发现</small></div><p class="summary-question">${highlight.q}</p><div class="summary-answers"><span>你：<b>${mine}</b></span><span>${partner}：<b>${theirs}</b></span></div><div class="summary-prompt"><i>⌁</i><p>${highlight.prompt}</p></div></section>`;
  return isCompanion
    ? `<div class="message-row theirs summary-row">${sender}${card}</div>`
    : `<div class="message-row mine summary-row">${card}${sender}</div>`;
}

function renderChat() {
  return `<div class="phone-page chat-page">
    <header class="thread-header">
      <button class="thread-button" aria-label="返回">${chatIcon('back')}</button>
      <div class="thread-identity"><div><strong>Mía</strong><span class="profile-badge">✓</span></div><small>英语 · 日语</small></div>
      <span class="header-space"></span><button class="thread-button thread-search" aria-label="搜索">⌕</button><button class="thread-button" aria-label="更多">${chatIcon('more')}</button>
    </header>
    <main class="messages">
      <div class="message-time">今天 20:16</div>
      <div class="message-row theirs"><img class="chat-avatar" src="${htAsset}avatar-yuki.png" alt="Mía"/><div class="bubble other">I finally finished my presentation! 🎉</div></div>
      <div class="message-row mine"><div class="bubble self">That’s great! You did it.</div><img class="chat-avatar" src="${htAsset}avatar-mia.png" alt="你"/></div>
      ${state.invited && !state.summaryPosted ? `<button class="game-card ${state.invitationState === 'expired' ? 'expired-game-card' : ''}" ${state.invitationState === 'expired' ? 'data-action="open-expired"' : ''}><div class="game-symbol">✦</div><div><b>默契二选一</b><span>${state.invitationState === 'expired' ? '本次邀请已失效' : state.invitationState === 'accepted' ? '双方已同意，准备开始' : state.invitationState === 'ready' ? 'Mía 已进入，等待开始' : '邀请对方玩 3 个轻松的小问题'}</span></div></button>` : ''}
      ${renderSummaryCard()}
    </main>
    <footer class="chat-composer ${state.tools ? 'tools-expanded' : ''}">
      <div class="input-line"><input class="chat-input" aria-label="Message" placeholder="输入消息…"/><button class="asset-button" aria-label="语音"><img src="${htAsset}composer_mic.png" alt="语音"/></button></div>
      <div class="toolbar"><button class="asset-button tools-toggle ${state.tools ? 'is-open' : ''}" data-action="tools" aria-label="更多功能">${state.tools ? `<span class="toolbar-close">${chatIcon('close')}</span>` : `<img src="${htAsset}composer_plus.png" alt="更多"/>`}</button><button class="asset-button" aria-label="照片"><img src="${htAsset}composer_photo.png" alt="照片"/></button><button class="asset-button" aria-label="表情"><img src="${htAsset}composer_emoji.png" alt="表情"/></button><button class="asset-button" aria-label="安全">${chatIcon('shield')}</button><button class="asset-button" aria-label="更多">${chatIcon('more')}</button></div>
      ${state.tools ? renderTools() : ''}
    </footer>
    ${state.page === 'game' ? renderPlaySheet('self') : state.gameSheet ? renderGameSheet() : ''}
  </div>`;
}

function renderTools() {
  const tile = (file, label, action = '', rule = '') => `<button class="tool-tile ${label === '小游戏' ? 'featured' : ''}" ${action ? `data-action="${action}"` : ''} ${rule ? `data-rule="${rule}"` : ''}>${file ? `<img src="${htAsset}${file}" alt=""/>` : `<i>${chatIcon('study')}</i>`}<span>${label}</span>${rule ? marker(rule) : ''}</button>`;
  const gameTile = state.eligible ? tile('tool_game.png', '小游戏', 'open-game', 'FR-MQ-001') : '';
  return `<section class="tools-panel">${tile('tool_voice.png', '语音通话')}${tile('tool_bookmark.png', '收藏')}${tile('', '付费陪练')}${tile('tool_calendar.png', '学习计划')}${tile('tool_draw.png', '涂鸦')}${tile('tool_intro.png', '介绍好友')}${tile('tool_location.png', '位置')}${gameTile}</section>`;
}

function renderGameSheet() {
  return `<div class="sheet-backdrop" data-action="close-game-sheet"><section class="mini-sheet" aria-label="小游戏面板">
    <button class="sheet-close" data-action="close-game-sheet" aria-label="关闭">${chatIcon('close')}</button><h2>小游戏</h2>
    <div class="mini-list"><button><span class="mini-mark question">?</span><span>36问</span></button><button><span class="mini-mark hands">✌︎</span><span>猜拳</span></button><button><span class="mini-mark dice">⚄</span><span>掷骰子</span></button><button><span class="mini-mark exchange-mini">${chatIcon('exchange')}</span><span>以图换图</span></button><button class="merit-game" data-action="start-game"><span class="mini-mark">${chatIcon('game')}</span><span>默契二选一</span>${marker('FR-MQ-001')}</button></div>
  </section></div>`;
}

function renderPlaySheet(owner) {
  const isCompanion = owner === 'companion';
  const index = isCompanion ? state.otherQuestion : state.selfQuestion;
  const action = isCompanion ? 'other-answer' : 'self-answer';
  const title = isCompanion ? 'Mía' : '你';
  const selfPortrait = isCompanion ? 'avatar-yuki.png' : 'avatar-mia.png';
  const otherPortrait = isCompanion ? 'avatar-mia.png' : 'avatar-yuki.png';
  const people = `<div class="people"><img class="avatar avatar-self" src="${htAsset}${selfPortrait}" alt="你"/><div class="orbit">✦</div><img class="avatar avatar-other" src="${htAsset}${otherPortrait}" alt="Mía"/></div>`;
  let body = '';
  if (state.sessionEnd === 'ended') {
    body = `<div class="play-finish concise-finish end-state"><div class="result-burst">⌁</div><h2>本局已结束</h2><p>对方已退出本局。</p><button class="primary" data-action="back-chat">回到聊天</button></div>`;
  } else if (state.invitationState === 'expired') {
    body = `<div class="play-finish concise-finish end-state"><div class="result-burst">◷</div><h2>邀请已失效</h2><p>本次邀请已结束，暂时无法开始。</p><button class="primary" data-action="back-chat">知道了</button></div>`;
  } else if (state.phase === 'invite') {
    if (state.invitationState === 'waiting') {
      body = `<div class="play-wait">${people}<h2>等待 Mía 的回应</h2><p>双方都同意后才会开始。</p><div class="waiting-card"><span>${icon('clock')}</span> 对方还没有确认</div><button class="quiet" data-action="back-chat">先不玩</button></div>`;
    } else if (state.invitationState === 'ready') {
      body = isCompanion
        ? `<div class="play-invite">${people}<h2>要开始这一轮吗？</h2><p>一共 3 题，每题各选一个答案。</p><button class="primary" data-action="start-round">开始</button><button class="quiet" data-action="back-chat">暂不开始</button></div>`
        : `<div class="play-wait">${people}<h2>Mía 已进入游戏</h2><p>等她点击开始，就一起答第 1 题。</p><div class="waiting-card"><span>${icon('clock')}</span> 等待对方开始</div><button class="quiet" data-action="back-chat">先不玩</button></div>`;
    } else {
      body = `<div class="play-invite">${people}<h2>来玩 3 个轻松的小问题？</h2><p>每题各选一个答案，双方选完自动揭晓。</p><button class="primary" data-action="send-invite">邀请 Mía 一起玩</button><button class="quiet" data-action="back-chat">先不玩</button></div>`;
    }
  } else if (index >= 3) {
    const highlight = conversationHighlight();
    const mine = isCompanion ? highlight.other : highlight.self;
    const theirs = isCompanion ? highlight.self : highlight.other;
    const partner = isCompanion ? '对方' : 'Mía';
    const outcome = highlight.different ? `你选了「${mine}」，${partner} 选了「${theirs}」` : `你们都选了「${mine}」`;
    body = `<div class="play-finish social-finish concise-finish"><h2>想听听你为什么选这个</h2><p class="finish-outcome">${outcome}</p><section class="finish-prompt"><i>“</i><p>${highlight.prompt}</p></section><button class="primary" data-action="return-to-chat">回到聊天聊聊</button></div>`;
  } else {
    const q = current(index);
    const answer = answerFor(index);
    const selected = isCompanion ? answer.other : answer.self;
    const otherSelected = isCompanion ? answer.self : answer.other;
    const bothAnswered = answer.self && answer.other;
    if (bothAnswered) {
      const same = answer.self === answer.other;
      const mine = answerText(q, isCompanion ? answer.other : answer.self);
      const theirs = answerText(q, isCompanion ? answer.self : answer.other);
      const nextAction = isCompanion ? 'other-next' : 'self-next';
      body = `<div class="play-result"><div class="result-burst">${same ? '✦' : '⌁'}</div><p class="play-step">第 ${index + 1} / 3 题</p><h2>${same ? '原来你也会选这个' : '原来你会这样想'}</h2><p class="result-copy">${same ? '这一次，你们想到一块去了。' : '和我的选择不一样，但我有点想听你说说。'}</p><section class="result-recap"><p>${q.q}</p><div><span>你</span><b>${mine}</b></div><div><span>${isCompanion ? '对方' : 'Mía'}</span><b>${theirs}</b></div></section><button class="primary" data-action="${nextAction}">${index === 2 ? '看看这一轮' : '下一题'}</button></div>`;
    } else {
    const status = selected
      ? `你已选择，等待${isCompanion ? '对方' : ' Mía '}选择`
      : otherSelected
        ? `${isCompanion ? '对方' : 'Mía'}已选择，等你选择`
        : '';
      const guide = selected
        ? `已选好，等 ${isCompanion ? '对方' : 'Mía'} 选完就自动揭晓。`
        : otherSelected
          ? `${isCompanion ? '对方' : 'Mía'} 已经选好，你选完就自动揭晓。`
          : '凭第一感觉选，选完就自动揭晓。';
      body = `<div class="play-question"><p class="play-step">第 ${index + 1} / 3 题</p><h2>${q.q}</h2><div class="choices ${selected ? 'locked' : ''}"><button data-action="${action}" data-value="a" class="choice ${selected === 'a' ? 'chosen' : ''}"><span>A</span>${q.a}</button><button data-action="${action}" data-value="b" class="choice ${selected === 'b' ? 'chosen' : ''}"><span>B</span>${q.b}</button></div>${status ? `<div class="waiting-card"><span>${icon('clock')}</span> ${status}</div>` : ''}<div class="question-footnote"><i><b></b><b></b></i><span>${guide}</span></div></div>`;
    }
  }
  const subtitle = state.sessionEnd === 'ended' ? '本局已结束' : state.invitationState === 'expired' ? '邀请已失效' : state.phase === 'invite' ? '一起选，自动揭晓' : index >= 3 ? `${title} 已完成这一轮` : `${title} 正在作答`;
  return `<div class="play-backdrop"><section class="play-sheet" aria-label="默契二选一"><i class="play-grab" aria-hidden="true"></i><header><button data-action="exit" aria-label="关闭">${icon('close')}</button><div><b>默契二选一</b><small>${subtitle}</small></div><span></span></header>${body}</section></div>`;
}

function renderInvite() {
  const waiting = state.invitationState === 'waiting';
  return `<div class="game-screen">
    <header class="game-nav"><button data-action="back-chat">${icon('back')}</button><b>默契二选一</b><button data-action="exit">${icon('close')}</button></header>
    <main class="game-body invite-body">
      <div class="people"><div class="avatar avatar-self">你</div><div class="orbit">✦</div><div class="avatar avatar-other">M</div></div>
      <h1>${waiting ? '等待 Mía 的回应' : '来玩 3 个轻松的小问题？'}</h1>
      <p>${waiting ? '双方都同意后才会开始。' : '每题各选一个答案，完成后一起揭晓。'}</p>
      ${marker('FR-MQ-002')}
      ${waiting ? `<div class="waiting-card"><span>${icon('clock')}</span> 对方还没有确认</div>` : `<button class="primary" data-action="send-invite">邀请 Mía 一起玩</button>`}
      <button class="quiet" data-action="back-chat">先不玩</button>
    </main>
  </div>`;
}

function renderQuestion() {
  const q = current();
  const complete = state.self && state.other;
  const selfText = state.self ? (state.self === 'a' ? q.a : q.b) : '等待你选择';
  const otherText = state.other ? (state.other === 'a' ? q.a : q.b) : '等待 Mía 选择';
  return `<div class="game-screen">
    <header class="game-nav"><button data-action="exit">${icon('close')}</button><div><b>默契二选一</b><small>第 ${state.question + 1} / 3 题</small></div><span></span></header>
    <main class="game-body question-body">
      <div class="progress"><i style="width:${((state.question + (state.revealed ? 1 : 0)) / 3) * 100}%"></i></div>
      <p class="eyebrow">一起选一个更像自己的答案</p>
      <h2>${q.q}</h2>${marker('FR-MQ-003')}
      <div class="choices ${state.self ? 'locked' : ''}">
        <button data-action="self-answer" data-value="a" class="choice ${state.self === 'a' ? 'chosen' : ''}"><span>A</span>${q.a}</button>
        <button data-action="self-answer" data-value="b" class="choice ${state.self === 'b' ? 'chosen' : ''}"><span>B</span>${q.b}</button>
      </div>
      ${state.self && !state.other ? `<div class="waiting-card"><span>${icon('clock')}</span> 等待 Mía 选择</div>` : ''}
      ${complete ? `<section class="answer-status"><div><i>你</i><strong>${selfText}</strong></div><div><i>Mía</i><strong>${otherText}</strong></div>${!state.revealed ? `<button class="primary" data-action="reveal">一起揭晓</button>` : ''}</section>` : ''}
    </main>
  </div>`;
}

function renderReveal() {
  const q = current(); const same = state.self === state.other;
  return `<div class="game-screen reveal-screen"><header class="game-nav"><button data-action="exit">${icon('close')}</button><b>默契二选一</b><span></span></header>
    <main class="game-body"><div class="result-burst">${same ? '✦' : '⌁'}</div><p class="eyebrow">第 ${state.question + 1} / 3 题</p><h2>${same ? '原来你也会选这个' : '原来你会这样想'}</h2>${marker('FR-MQ-004')}
    <p class="result-copy">${same ? '这一次，你们想到一块去了。' : '和我的选择不一样，但我有点想听你说说。'}</p>
    <div class="result-pair"><div><i>你</i><b>${state.self === 'a' ? q.a : q.b}</b></div><div><i>Mía</i><b>${state.other === 'a' ? q.a : q.b}</b></div></div>
    <button class="primary" data-action="next">${state.question === 2 ? '看看这一轮' : '下一题'}</button></main></div>`;
}

function renderFinish() {
  return `<div class="game-screen finish-screen"><header class="game-nav"><button data-action="exit">${icon('close')}</button><b>默契二选一</b><span></span></header><main class="game-body"><div class="finish-mark">${icon('check')}</div><h1>3 个问题聊完啦</h1><p>不打分，也不用解释。想继续的话，再来 3 题。</p>${marker('FR-MQ-005')}<button class="primary" data-action="again">再来 3 题</button><button class="quiet" data-action="exit">结束这一轮</button></main></div>`;
}

function renderPhone() {
  return renderChat();
}

function renderCompanionPhone() {
  const card = state.invited && !state.summaryPosted ? (state.invitationState === 'waiting' ? `<button class="game-card received-invite" data-action="accept-from-card"><div class="game-symbol">✦</div><div><b>默契二选一</b><span>对方邀请你一起玩 3 个轻松的问题</span></div></button>` : `<button class="game-card ${state.invitationState === 'expired' ? 'expired-game-card' : ''}" ${state.invitationState === 'expired' ? 'data-action="open-expired"' : ''}><div class="game-symbol">✦</div><div><b>默契二选一</b><span>${state.invitationState === 'expired' ? '本次邀请已失效' : state.invitationState === 'ready' ? '已进入游戏，等待开始' : '双方已同意，准备开始'}</span></div></button>`) : '';
  const chat = `<div class="phone-page chat-page">
    <header class="thread-header"><button class="thread-button" aria-label="返回">${chatIcon('back')}</button><div class="thread-identity"><div><strong>你</strong><span class="profile-badge">✓</span></div><small>英语 · 中文</small></div><span class="header-space"></span><button class="thread-button thread-search" aria-label="搜索">⌕</button><button class="thread-button" aria-label="更多">${chatIcon('more')}</button></header>
    <main class="messages"><div class="message-time">今天 20:16</div><div class="message-row theirs"><img class="chat-avatar" src="${htAsset}avatar-mia.png" alt="你"/><div class="bubble other">That’s great! You did it.</div></div><div class="message-row mine"><div class="bubble self">I finally finished my presentation! 🎉</div><img class="chat-avatar" src="${htAsset}avatar-yuki.png" alt="Mía"/></div>${card}${renderSummaryCard(true)}</main>
    <footer class="chat-composer"><div class="input-line"><input class="chat-input" aria-label="Message" placeholder="输入消息…"/><button class="asset-button" aria-label="语音"><img src="${htAsset}composer_mic.png" alt="语音"/></button></div><div class="toolbar"><button class="asset-button" aria-label="更多"><img src="${htAsset}composer_plus.png" alt="更多"/></button><button class="asset-button" aria-label="照片"><img src="${htAsset}composer_photo.png" alt="照片"/></button><button class="asset-button" aria-label="表情"><img src="${htAsset}composer_emoji.png" alt="表情"/></button><button class="asset-button" aria-label="安全">${chatIcon('shield')}</button><button class="asset-button" aria-label="更多">${chatIcon('more')}</button></div></footer>
  </div>`;
  return `<section class="phone-shell companion-phone"><div class="status"><span>9:41</span><span>●●● ᴡɪꜰɪ ▰</span></div>${chat}${state.page === 'game' && (state.sessionEnd || state.invitationState === 'expired' || state.phase !== 'invite' || state.invitationState === 'ready') ? renderPlaySheet('companion') : ''}</section>`;
}

function renderCompanionQuestion() {
  const q = current();
  const bothAnswered = state.self && state.other;
  return `<div class="game-screen"><header class="game-nav"><button data-action="exit">${icon('close')}</button><div><b>默契二选一</b><small>第 ${state.question + 1} / 3 题</small></div><span></span></header><main class="game-body question-body"><div class="progress"><i style="width:${((state.question + (state.revealed ? 1 : 0)) / 3) * 100}%"></i></div><p class="eyebrow">一起选一个更像自己的答案</p><h2>${q.q}</h2><div class="choices ${state.other ? 'locked' : ''}"><button data-action="other-answer" data-value="a" class="choice ${state.other === 'a' ? 'chosen' : ''}"><span>A</span>${q.a}</button><button data-action="other-answer" data-value="b" class="choice ${state.other === 'b' ? 'chosen' : ''}"><span>B</span>${q.b}</button></div>${state.other && !state.self ? `<div class="waiting-card"><span>${icon('clock')}</span> 等待对方选择</div>` : ''}${bothAnswered ? `<button class="primary companion-reveal" data-action="reveal">一起揭晓</button>` : ''}</main></div>`;
}

function renderControls() {
  return `<aside class="control-panel"><div class="control-heading"><span>Demo 控制台</span><small>不属于 App 画面</small></div>
    <label class="toggle-row"><span>双方均 18 岁及以上</span><input type="checkbox" data-control="eligible" ${state.eligible ? 'checked' : ''}/><i></i></label>
    <div class="control-block"><b>对方操作</b><p>${state.page === 'chat' ? '从聊天工具打开“默契二选一”后可模拟。' : state.phase === 'invite' && state.invitationState === 'waiting' ? '等待邀请回应。' : state.phase === 'question' ? '对方可完成本题选择。' : '当前无需对方操作。'}</p>
      ${state.page !== 'chat' && state.phase === 'invite' && state.invitationState === 'waiting' ? `<button data-control="accept">Mía 同意开始</button><button class="subtle" data-control="decline">Mía 暂不加入</button>` : ''}
      ${state.page !== 'chat' && state.phase === 'question' && state.self && !state.other ? `<button data-control="other-a">Mía 选 A</button><button data-control="other-b">Mía 选 B</button>` : ''}
    </div>
    <div class="control-block scenario-block"><b>快捷状态</b><p>直接查看关键界面，不影响 App 画面。</p><div class="scenario-grid"><button data-control="state-invite">邀请已发出</button><button data-control="state-ready">接收方待开始</button><button data-control="state-reveal">第 1 题揭晓</button><button data-control="state-finish">结束页·答案不同</button><button data-control="state-finish-same-a">结束页·同选 A</button><button data-control="state-finish-same-b">结束页·同选 B</button><button data-control="state-expired">邀请已失效</button><button data-control="state-ended">中途退出</button><button data-control="state-chat-result">聊天结果卡</button></div></div>
    <label class="toggle-row"><span>Review 映射</span><input type="checkbox" data-control="review" ${state.review ? 'checked' : ''}/><i></i></label>
    <button class="reset" data-control="reset">重置演示</button>
  </aside>`;
}

function renderReview() {
  if (!state.review) return '';
  return `<aside class="review-panel"><div class="review-title">规则映射 <small>点击定位</small></div>${rules.map(([id, title, target]) => `<button class="rule-card ${state.selectedRule === id ? 'active' : ''}" data-rule="${id}"><b>${id}</b><span>${title}</span><small>${target}</small></button>`).join('')}</aside>`;
}

function drawConnector() {
  const old = document.querySelector('.connector-layer'); old?.remove();
  if (!state.review || !state.selectedRule || window.innerWidth < 980) return;
  const source = document.querySelector(`.rule-card[data-rule="${state.selectedRule}"]`);
  const target = document.querySelector(`.marker[data-rule="${state.selectedRule}"]`);
  if (!source || !target) return;
  const a = source.getBoundingClientRect(), b = target.getBoundingClientRect(), root = document.querySelector('.workbench').getBoundingClientRect();
  const x1 = a.left - root.left, y1 = a.top - root.top + a.height / 2, x2 = b.left - root.left + b.width / 2, y2 = b.top - root.top + b.height / 2;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.classList.add('connector-layer'); svg.setAttribute('viewBox', `0 0 ${root.width} ${root.height}`);
  svg.innerHTML = `<path d="M ${x1} ${y1} C ${x1 - 70} ${y1}, ${x2 + 70} ${y2}, ${x2} ${y2}"/>`;
  document.querySelector('.workbench').append(svg);
}

function render() {
  app.innerHTML = `<main class="workbench"><section class="dual-phone-stage"><div class="dual-header"><b>默契二选一</b><span>双方聊天视角</span></div><div class="role-labels"><span>发起方 · 你</span><i>双方状态实时同步</i><span>接收方 · Mía</span></div><div class="phones"><section class="phone-shell primary-phone"><div class="status"><span>9:41</span><span>●●● ᴡɪꜰɪ ▰</span></div>${renderPhone()}</section>${renderCompanionPhone()}</div></section>${renderControls()}${renderReview()}</main>`;
  requestAnimationFrame(drawConnector);
}

function handleAction(action, value) {
  if (action === 'tools') state.tools = !state.tools;
  if (action === 'open-game') { state.gameSheet = true; state.tools = false; }
  if (action === 'close-game-sheet') state.gameSheet = false;
  if (action === 'start-game') { state.page = 'game'; state.gameSheet = false; state.tools = false; resetRound(); }
  if (action === 'accept-from-card') state.invitationState = 'ready';
  if (action === 'start-round') { state.invitationState = 'accepted'; state.phase = 'question'; }
  if (action === 'back-chat') { state.page = 'chat'; state.tools = false; state.gameSheet = false; }
  if (action === 'exit') {
    if (state.phase === 'question') { state.sessionEnd = 'ended'; state.page = 'game'; }
    else if (state.phase === 'invite' && state.invitationState === 'waiting') { state.invitationState = 'expired'; state.page = 'game'; }
    else { state.page = 'chat'; state.tools = false; state.gameSheet = false; resetRound(); }
  }
  if (action === 'open-expired') { state.page = 'game'; state.phase = 'invite'; }
  if (action === 'send-invite') { state.invited = true; state.invitationState = 'waiting'; }
  if (action === 'self-answer') { const answer = answerFor(state.selfQuestion); if (!answer.self) answer.self = value; if (roundComplete()) state.summaryPosted = true; }
  if (action === 'other-answer') { const answer = answerFor(state.otherQuestion); if (!answer.other) answer.other = value; if (roundComplete()) state.summaryPosted = true; }
  if (action === 'self-next') state.selfQuestion += 1;
  if (action === 'other-next') state.otherQuestion += 1;
  if (action === 'return-to-chat') { state.summaryPosted = true; state.page = 'chat'; state.tools = false; state.gameSheet = false; }
  if (action === 'again') { state.batch = (state.batch + 1) % batches.length; state.selfQuestion = 0; state.otherQuestion = 0; state.roundAnswers = []; state.phase = 'question'; }
  render();
}

app.addEventListener('click', (event) => {
  const reviewMarker = event.target.closest('.marker[data-rule]');
  if (reviewMarker && state.review) { state.selectedRule = reviewMarker.dataset.rule; render(); return; }
  const action = event.target.closest('[data-action]'); if (action) return handleAction(action.dataset.action, action.dataset.value);
  const rule = event.target.closest('[data-rule]'); if (rule && state.review) { state.selectedRule = rule.dataset.rule; render(); return; }
  const control = event.target.closest('[data-control]'); if (!control) return;
  const type = control.dataset.control;
  if (type === 'eligible' || type === 'review') return;
  if (type === 'accept') state.invitationState = 'ready';
  if (type === 'decline') { state.invitationState = 'declined'; state.page = 'chat'; state.tools = false; }
  if (type === 'other-a' || type === 'other-b') { const answer = answerFor(state.otherQuestion); if (!answer.other) answer.other = type.endsWith('a') ? 'a' : 'b'; }
  if (type.startsWith('state-')) setDemoState(type.replace('state-', ''));
  if (type === 'reset') { Object.assign(state, { page: 'chat', tools: false, gameSheet: false, eligible: true, invited: false, invitationState: 'idle', batch: 0, review: false, selectedRule: null, sessionEnd: null }); resetRound(); }
  render();
});

app.addEventListener('change', (event) => {
  if (event.target.dataset.control === 'eligible') { state.eligible = event.target.checked; if (!state.eligible) { state.page = 'chat'; state.tools = false; resetRound(); } }
  if (event.target.dataset.control === 'review') state.review = event.target.checked;
  render();
});

window.addEventListener('resize', drawConnector);
render();
