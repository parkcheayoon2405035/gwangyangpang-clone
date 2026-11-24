/*
 * 행운팡팡 챗봇 — 자료에서 찾아 답하는 엔진 (RAG 의 '찾기' 단계)
 *
 * 흐름: 질문 → ① 언어 알아내기 → ② 행사 자료에서 관련 있는 것 찾기(BM25) → ③ 찾은 자료로 답 만들기
 *   - 자료: chatbot/kb/common.js(공통) + festivals.js(행사별) + places-*.js(장소)
 *   - 행사가 바뀌면 자료만 바뀐다. 이 파일은 그대로.
 *   - 자료에 없는 값은 지어내지 않고 "자료에 없어요 + 문의처"로 답한다.
 *   - 생성형 AI(③을 AI 가 하는 것)는 CHAT_CONFIG.aiEndpoint 에 서버 주소를 넣으면 켜진다.
 *     API 키는 웹페이지에 두면 누구나 볼 수 있으므로 반드시 서버에 둔다. 비어 있으면 아래 규칙대로 답한다.
 */
(function () {
  'use strict';

  var KB = window.CHAT_KB;
  var LANGS = ['ko', 'en', 'ja', 'zh'];
  var CONFIG = window.CHAT_CONFIG || { aiEndpoint: null };

  /* ---------------- 문구 ---------------- */
  var S = {
    unknown: {
      ko: '그 내용은 이 행사 자료에 없어요.\n{contact}',
      en: 'That information isn\'t in this event\'s materials.\n{contact}',
      ja: 'その内容はこのイベントの資料にありません。\n{contact}',
      zh: '本活动的资料中没有这项信息。\n{contact}'
    },
    fallback: {
      ko: '죄송해요, 자료에서 맞는 답을 찾지 못했어요.\n{contact}\n\n이런 걸 물어볼 수 있어요.',
      en: 'Sorry, I couldn\'t find an answer in the materials.\n{contact}\n\nYou can ask things like:',
      ja: '申し訳ありません。資料から答えが見つかりませんでした。\n{contact}\n\nこんなことが聞けます。',
      zh: '抱歉，资料中没有找到合适的答案。\n{contact}\n\n你可以这样问：'
    },
    contactPhone: {
      ko: '<b>{phone}</b>{hours}로 문의해 주세요.',
      en: 'Please call <b>{phone}</b>{hours}.',
      ja: '<b>{phone}</b>{hours}までお問い合わせください。',
      zh: '请致电<b>{phone}</b>{hours}咨询。'
    },
    contactDesk: {
      ko: '행사장 <b>안내데스크(본부석)</b>에 문의해 주세요.',
      en: 'Please ask at the event\'s <b>information desk</b>.',
      ja: '会場の<b>案内デスク（本部席）</b>にお問い合わせください。',
      zh: '请到会场的<b>咨询台（本部席）</b>咨询。'
    },
    noPlaces: {
      ko: '이 행사 자료에는 주변 {cat} 정보가 없어요.\n{contact}',
      en: 'This event\'s materials don\'t include nearby {cat}.\n{contact}',
      ja: 'このイベントの資料には周辺の{cat}情報がありません。\n{contact}',
      zh: '本活动资料中没有周边{cat}信息。\n{contact}'
    },
    listHead: {
      ko: '주변 {cat} {n}곳 중 몇 곳을 보여 드릴게요.',
      en: 'Here are a few of the {n} nearby {cat}.',
      ja: '周辺の{cat}{n}か所のうち、いくつかご紹介します。',
      zh: '为你介绍周边{n}处{cat}中的几处。'
    },
    more: { ko: '전체 목록 보기', en: 'See the full list', ja: '一覧をすべて見る', zh: '查看完整列表' },
    detail: { ko: '자세히 보기', en: 'Details', ja: '詳しく見る', zh: '查看详情' },
    label: {
      period: { ko: '기간', en: 'Dates', ja: '期間', zh: '时间' },
      phone: { ko: '전화', en: 'Phone', ja: '電話', zh: '电话' },
      address: { ko: '주소', en: 'Address', ja: '住所', zh: '地址' },
      menu: { ko: '대표 메뉴', en: 'Signature dishes', ja: '代表メニュー', zh: '招牌菜' }
    },
    src: {
      guide: { ko: '이용가이드', en: 'User Guide', ja: '利用ガイド', zh: '使用指南' },
      brochure: { ko: '마이스팡팡 안내서', en: 'MICE PangPang brochure', ja: 'マイスパンパン案内書', zh: 'MICE PangPang 宣传册' },
      site: { ko: '행사 사이트 화면', en: 'Event site', ja: 'イベントサイト', zh: '活动网站' },
      places: { ko: '행사 사이트 장소 정보', en: 'Event site places', ja: 'イベントサイトの施設情報', zh: '活动网站场所信息' }
    }
  };

  /* 장소 종류: 이름 · 목록 페이지 · 이 말이 질문에 있으면 그 종류 목록으로 답한다 */
  var CATS = {
    food: {
      name: { ko: '음식점', en: 'restaurants', ja: '飲食店', zh: '餐厅' }, page: 'food_intro.html',
      re: /맛집|음식|식당|밥집|먹을|먹거리|레스토랑|\brestaurants?\b|\bfood\b|\beat\b|\bdining\b|\blunch\b|\bdinner\b|飲食|レストラン|ごはん|ご飯|食事|グルメ|餐厅|美食|吃饭|饭店|好吃/
    },
    hotel: {
      name: { ko: '숙박', en: 'places to stay', ja: '宿泊施設', zh: '住宿' }, page: 'hotel_intro.html',
      re: /숙소|숙박|민박|펜션|호텔|잘\s?곳|캠핑|\bstay\b|\bhotels?\b|accommodation|lodging|guesthouse|\bcamping\b|宿泊|ホテル|民泊|宿|住宿|酒店|民宿|露营/
    },
    tour: {
      name: { ko: '관광지', en: 'sights', ja: '観光地', zh: '景点' }, page: 'tour_intro.html',
      re: /관광지|볼거리|가볼\s?만|명소|구경|놀\s?곳|\bsights?\b|attractions?|sightseeing|things to see|観光|名所|見どころ|景点|旅游|好玩|参观/
    },
    sp: {
      name: { ko: '특산물', en: 'local specialties', ja: '特産品', zh: '特产' }, page: 'sp_intro.html',
      re: /특산|기념품|명물|specialt|souvenirs?|local products?|特産|お土産|名物|特产|土特产|纪念品/
    },
    festival: {
      name: { ko: '축제', en: 'festivals', ja: '祭り', zh: '节庆' }, page: 'festival_intro.html',
      re: /축제\s?(목록|뭐|추천|종류|있어)|다른\s?축제|\bfestivals\b|other events|祭り(一覧|は何)|ほかの祭り|其他节|节庆有哪些|有什么节/
    }
  };

  /* ---------------- ① 언어 ---------------- */
  function detectLang(q) {
    if (/[぀-ヿ]/.test(q)) return 'ja';
    if (/[가-힣]/.test(q)) return 'ko';
    if (/[一-鿿]/.test(q)) return 'zh';
    if (/[a-z]/i.test(q)) return 'en';
    return null;
  }

  /* ---------------- 글자 쪼개기 (영어는 단어, 한·중·일은 두 글자씩) ---------------- */
  // 어떤 질문에나 들어가는 말(묻는 말·어미)은 점수에서 뺀다. 안 빼면 "주차장 어디야"가 '어디'만으로 엉뚱한 답에 걸린다
  // ('번호'도 전화번호·인증번호·로또 번호 어디에나 붙어서 뺀다 — '전화' 같은 앞 조각으로 찾는다)
  var STOP = { the: 1, a: 1, an: 1, is: 1, are: 1, do: 1, does: 1, i: 1, my: 1, me: 1, to: 1, of: 1, in: 1, at: 1, for: 1, can: 1, it: 1, this: 1, please: 1, you: 1, there: 1, any: 1, be: 1,
    how: 1, what: 1, where: 1, when: 1, which: 1, who: 1, tell: 1, about: 1, want: 1, know: 1 };
  var STOP_BI = { '어디': 1, '디야': 1, '디서': 1, '디예': 1, '디에': 1, '언제': 1, '제야': 1, '어떻': 1, '떻게': 1, '알려': 1, '려줘': 1, '려주': 1, '주세': 1, '세요': 1,
    '번호': 1, '해요': 1, '돼요': 1, '되나': 1, '나요': 1, '있어': 1, '어요': 1, '까요': 1, '예요': 1, '이에': 1, '에요': 1, '인가': 1, '가요': 1, '뭐야': 1, '뭐예': 1, '해줘': 1, '싶어': 1,
    'どこ': 1, 'です': 1, 'ます': 1, 'すか': 1, 'ください': 1, '哪里': 1, '什么': 1, '怎么': 1, '吗？': 1 };
  function stem(w) { return w.length > 4 ? w.replace(/(ies|es|s|ing|ed)$/, '') : w; }
  function norm(s) {
    return String(s).normalize('NFKC').toLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/\bwi[\s-]?fi\b/g, 'wifi')                                  // Wi-Fi, wi fi → wifi
      .replace(/\b(can'?t|cannot|won'?t|doesn'?t|isn'?t|not working)(?![a-z])/g, ' cant ');  // '안 돼요' 류를 한 낱말로
  }
  function tokenize(text) {
    var t = norm(text).replace(/<[^>]+>/g, ' ').replace(/\{[a-z]+\}/g, ' ');
    var out = [];
    (t.match(/[a-z0-9]+/g) || []).forEach(function (w) {
      if (STOP[w] === 1) return;
      if (w.length > 1 || /\d/.test(w)) out.push(stem(w));
    });
    (t.match(/[぀-ヿ㐀-鿿가-힣]+/g) || []).forEach(function (run) {
      if (run.length === 1) { out.push(run); return; }
      for (var i = 0; i < run.length - 1; i++) out.push(run.slice(i, i + 2));
    });
    return out;
  }

  /* ---------------- 값 채우기 ---------------- */
  function pick(v, lang) { return v && typeof v === 'object' ? (v[lang] != null ? v[lang] : v.ko) : v; }
  function contactOf(f, lang) {
    if (!f.phone) return pick(S.contactDesk, lang);
    var h = f.phoneHours ? ' (' + pick(f.phoneHours, lang) + ')' : '';
    return pick(S.contactPhone, lang).replace('{phone}', f.phone).replace('{hours}', h);
  }
  function fill(tpl, f, lang) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) {
      if (k === 'contact') return contactOf(f, lang);
      var v = pick(f[k], lang);
      return v == null ? '' : v;
    });
  }
  function textOnly(html) { return String(html).replace(/<[^>]+>/g, ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------------- 자료 목록 만들기 (행사 · 언어마다 한 번) ---------------- */
  var cache = {};
  // 질문 예시와 글자가 똑같은지 비교할 때 쓰는 열쇠 (띄어쓰기·문장부호 무시)
  function exactKey(s) { return norm(s).replace(/[\s?？!！.。,、~]+/g, ''); }

  function buildIndex(festId, lang) {
    var key = festId + '|' + lang;
    if (cache[key]) return cache[key];
    var f = KB.festivals[festId];
    var docs = [], exact = {};
    KB.common.forEach(function (d) {
      var qs = (d.q[lang] || d.q.ko).join(' ');
      var ans = textOnly(fill(d.a[lang] || d.a.ko, f, lang));
      var doc = { kind: 'faq', ref: d, text: qs + ' ' + qs + ' ' + qs + ' ' + ans };   // 질문 예시를 답 본문보다 무겁게
      docs.push(doc);
      (d.q[lang] || d.q.ko).forEach(function (x) { var k = exactKey(x); if (k && !exact[k]) exact[k] = doc; });
    });
    var places = (f.places && KB.places && KB.places[f.places]) || [];
    places.forEach(function (p) {
      var c = CATS[p.cat];
      var parts = [p.name, p.name, pick(c.name, lang), pick(c.name, 'ko')];
      if (p.tagline) parts.push(pick(p.tagline, lang));
      (p.desc || []).forEach(function (x) { parts.push(pick(x, lang)); });
      (p.menu || []).forEach(function (x) { parts.push(pick(x, lang), pick(x, 'ko')); });
      if (p.address) parts.push(pick(p.address, lang));
      docs.push({ kind: 'place', ref: p, text: parts.join(' ') });
    });
    // BM25 준비
    var df = {}, total = 0;
    docs.forEach(function (d) {
      d.tf = {};
      var toks = tokenize(d.text);
      d.len = toks.length; total += toks.length;
      toks.forEach(function (t) { d.tf[t] = (d.tf[t] || 0) + 1; });
      Object.keys(d.tf).forEach(function (t) { df[t] = (df[t] || 0) + 1; });
    });
    var idx = { docs: docs, exact: exact, df: df, N: docs.length, avg: total / Math.max(1, docs.length), places: places, fest: f };
    cache[key] = idx;
    return idx;
  }

  /* ---------------- ② 찾기 (BM25) ---------------- */
  function search(idx, q) {
    var all = Array.from(new Set(tokenize(q)));
    var qt = all.filter(function (t) { return !STOP_BI[t]; });
    if (!qt.length) qt = all;            // "안녕하세요"처럼 묻는 말뿐이면 그대로 쓴다
    var k1 = 1.2, b = 0.75;
    var idf = {};
    var knownIdf = 0, unknown = 0;
    qt.forEach(function (t) {
      var n = idx.df[t] || 0;
      idf[t] = Math.log(1 + (idx.N - n + 0.5) / (n + 0.5));
      if (n) knownIdf += idf[t]; else unknown++;
    });
    var ranked = idx.docs.map(function (d) {
      var s = 0, matched = 0;
      qt.forEach(function (t) {
        var tf = d.tf[t];
        if (!tf) return;
        matched += idf[t];
        s += idf[t] * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * d.len / idx.avg));
      });
      // coverage: 질문의 (자료에 있는) 낱말 중 이 자료에 들어 있는 비율. 모르는 낱말이 많으면 깎는다
      var avgIdf = knownIdf / Math.max(1, qt.length - unknown) || 1;
      var cover = matched / (knownIdf + 0.5 * unknown * avgIdf || 1);
      return { doc: d, score: s, cover: cover };
    }).filter(function (r) { return r.score > 0; });
    ranked.sort(function (a, b2) { return b2.score - a.score; });
    return ranked;
  }

  /* ---------------- ③ 답 만들기 ---------------- */
  function placeCard(p, lang) {
    var c = CATS[p.cat];
    var L = S.label, rows = [];
    if (p.period) rows.push('· ' + pick(L.period, lang) + ': ' + esc(pick(p.period, lang)));
    if (p.phone) rows.push('· ' + pick(L.phone, lang) + ': <a href="tel:' + esc(p.phone) + '">' + esc(p.phone) + '</a>');
    if (p.address) rows.push('· ' + pick(L.address, lang) + ': ' + esc(pick(p.address, lang)));
    if (p.menu) rows.push('· ' + pick(L.menu, lang) + ': ' + esc(p.menu.map(function (m) { return pick(m, lang); }).join(', ')));
    return '<b>' + esc(p.name) + '</b> <span class="tag">' + esc(pick(c.name, lang)) + '</span>' +
      (p.tagline ? '\n' + esc(pick(p.tagline, lang)) : '') +
      (rows.length ? '\n' + rows.join('\n') : '') +
      '\n<a class="go" href="' + esc(p.url) + '" target="_top">' + pick(S.detail, lang) + ' →</a>';
  }
  function placeList(cat, list, lang) {
    var c = CATS[cat];
    var head = pick(S.listHead, lang).replace('{cat}', pick(c.name, lang)).replace('{n}', list.length);
    var items = list.slice(0, 5).map(function (p) {
      return '· <a href="' + esc(p.url) + '" target="_top"><b>' + esc(p.name) + '</b></a>' +
        (p.tagline ? ' — ' + esc(pick(p.tagline, lang)) : '');
    });
    return head + '\n' + items.join('\n') + '\n<a class="go" href="' + c.page + '" target="_top">' + pick(S.more, lang) + ' →</a>';
  }

  function srcLabel(kind, src, f, lang) {
    if (kind === 'place') return pick(S.src.places, lang);
    if (src === 'festival') return pick(f.source, lang);
    return pick(S.src[src], lang) + ' + ' + pick(f.source, lang);
  }

  // 빠른 질문 중 이 행사 자료에 값이 없는 것(예: 포인트가 없는 행사의 '포인트 소멸')은 빼서 헛걸음하지 않게
  function usableChips(ids, f) {
    return (ids || []).filter(function (id) {
      var d = KB.common.filter(function (x) { return x.id === id; })[0];
      return d && !(d.needs || []).some(function (k) { return f[k] == null; });
    });
  }

  function localAnswer(q, festId, uiLang) {
    var r;
    // 가나 없이 한자만 쓴 질문(会員登録, 電話番号…)은 일본어일 수도 중국어일 수도 있다 → 화면 언어 쪽부터 둘 다 찾아 본다
    if (detectLang(q) === 'zh') {
      var order = uiLang === 'ja' ? ['ja', 'zh'] : ['zh', 'ja'];
      for (var i = 0; i < order.length; i++) {
        r = rawAnswer(q, festId, uiLang, order[i]);
        if (r.hit !== 'fallback') break;
      }
      if (r.hit === 'fallback') r = rawAnswer(q, festId, uiLang, order[0]);
    } else {
      r = rawAnswer(q, festId, uiLang);
    }
    r.chips = usableChips(r.chips, KB.festivals[festId]);
    return r;
  }

  function rawAnswer(q, festId, uiLang, forceLang) {
    var lang = forceLang || detectLang(q) || uiLang;
    var idx = buildIndex(festId, lang);
    var f = idx.fest;
    var nq = norm(q).replace(/\s+/g, '');

    // 1) 장소 이름이 질문에 그대로 있으면 그 장소
    var byName = idx.places.filter(function (p) { var n = norm(p.name).replace(/\s+/g, ''); return n.length >= 2 && nq.indexOf(n) >= 0; })
      .sort(function (a, b) { return b.name.length - a.name.length; })[0];
    // 외국어 화면에서 한글 가게 이름만 쳤다면(이름 말고 다른 한글이 없으면) 화면 언어로 답한다
    if (byName && lang === 'ko' && uiLang !== 'ko' && !/[가-힣]/.test(nq.replace(norm(byName.name).replace(/\s+/g, ''), ''))) lang = uiLang;
    if (byName) return { lang: lang, html: placeCard(byName, lang), chips: [], source: srcLabel('place', null, f, lang), hit: 'place:' + byName.id };

    // 2) "맛집", "숙소" 같은 종류를 물으면 그 종류 목록
    for (var cat in CATS) {
      if (!CATS[cat].re.test(norm(q))) continue;
      var list = idx.places.filter(function (p) { return p.cat === cat; });
      if (!list.length) {
        return { lang: lang, html: fill(pick(S.noPlaces, lang).replace('{cat}', pick(CATS[cat].name, lang)), f, lang), chips: ['contact', 'about'], source: pick(f.source, lang), hit: 'noplaces:' + cat };
      }
      return { lang: lang, html: placeList(cat, list, lang), chips: [], source: srcLabel('place', null, f, lang), hit: 'list:' + cat };
    }

    // 3) 자료 전체에서 찾기
    var ranked = search(idx, q);
    var top = ranked[0];
    // 질문 예시와 똑같이 물었으면 점수와 상관없이 그 답 (예: "where do I scan the QR", "施設")
    var ex = idx.exact[exactKey(q)];
    if (ex) top = { doc: ex, score: 99, cover: 1 };
    if (!top || top.cover < 0.3 || top.score < 1.2) {
      return { lang: lang, html: fill(pick(S.fallback, lang), f, lang), chips: ['how', 'gift', 'about', 'contact'], source: null, hit: 'fallback', ranked: ranked.slice(0, 3) };
    }
    var d = top.doc;
    if (d.kind === 'place') return { lang: lang, html: placeCard(d.ref, lang), chips: [], source: srcLabel('place', null, f, lang), hit: 'place:' + d.ref.id, ranked: ranked.slice(0, 3) };
    var doc = d.ref;
    var missing = (doc.needs || []).some(function (k) { return f[k] == null; });
    var html = missing ? fill(pick(S.unknown, lang), f, lang) : fill(doc.a[lang] || doc.a.ko, f, lang);
    // 값이 없어 모른다고 답할 때, 대신 도움이 되는 말이 있으면 덧붙임 (예: 운영 시간 → 포인트 소멸 시각)
    if (missing && doc.unknownNote && !(doc.noteNeeds || []).some(function (k) { return f[k] == null; })) {
      html += '\n\n' + fill(pick(doc.unknownNote, lang), f, lang);
    }
    return { lang: lang, html: html, chips: doc.chips || [], source: missing ? pick(f.source, lang) : srcLabel('faq', doc.src, f, lang), hit: doc.id + (missing ? ':unknown' : ''), ranked: ranked.slice(0, 3) };
  }

  /* 생성형 AI 연결 자리: 찾은 자료 상위 3개를 근거로 서버의 AI 가 답한다. 실패하면 규칙 답으로 */
  function answer(q, festId, uiLang) {
    var local = localAnswer(q, festId, uiLang);
    if (!CONFIG.aiEndpoint) return Promise.resolve(local);
    var passages = (local.ranked || []).map(function (r) { return textOnly(r.doc.text).slice(0, 800); });
    return fetch(CONFIG.aiEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q, lang: local.lang, festival: festId, passages: passages, fallback: textOnly(local.html) })
    }).then(function (r) { return r.json(); })
      .then(function (j) { return j && j.answer ? Object.assign({}, local, { html: esc(j.answer), ai: true }) : local; })
      .catch(function () { return local; });
  }

  function chipText(id, lang) {
    var d = KB.common.filter(function (x) { return x.id === id; })[0];
    return d ? (d.q[lang] || d.q.ko)[0] : id;
  }

  window.ChatRAG = { answer: answer, localAnswer: localAnswer, detectLang: detectLang, chipText: chipText, CATS: CATS, contactOf: contactOf };
})();
