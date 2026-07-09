// ../../packages/protocol/dist/version.js
var PROVIDER_GLOBAL = "claude";

// ../../packages/sdk/dist/connect-chip.js
var STYLE = `
:host { all: initial; }
* { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
.chip, .btn { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; border: 0;
  font-size: 13px; font-weight: 600; line-height: 1; border-radius: 10px; }
/* The canonical connect lockup \u2014 the SAME mark + wordmark on every wrapp, so users recognize
   "Connect Switchboard" the way they knew the MetaMask button. Dark pill, lime glyph, locked in
   the shadow root so a host app can't restyle it away. */
.btn { padding: 9px 15px 9px 11px; background: #12151C; color: #E8EDF4; border: 1px solid #2C3444; }
.btn.connect:hover { background: #161B24; border-color: #3A4A18; }
.btn.get { color: #C3CAD6; border-color: #262C38; }
.btn.get:hover { color: #E8EDF4; border-color: #3A4353; }
.btn .arr { color: #6E7C90; font-weight: 500; margin-left: -2px; }
/* The Switchboard mark: lime rounded square with the top-right notch (matches the side-panel brand).
   Muted to slate when the sidekick isn't installed yet \u2014 the mark "lights up" once you can connect. */
.glyph { position: relative; width: 16px; height: 16px; border-radius: 5px; background: #C8F250;
  box-shadow: 0 0 12px rgba(200,242,80,.45); flex: none; }
.glyph::after { content: ""; position: absolute; top: 4px; right: 4px; width: 4px; height: 4px;
  border-radius: 50%; background: #0A0C10; }
.btn.get .glyph { background: #6E7C90; box-shadow: none; }
.wrap { position: relative; display: inline-block; }
.chip { background: #1A1F29; border: 1px solid #262C38; padding: 6px 10px 6px 7px; color: #E8EDF4; }
.chip:hover { border-color: #3A4353; }
.av { width: 26px; height: 26px; border-radius: 7px; background: #C8F250; color: #0A0C10; display: grid;
  place-items: center; font-weight: 700; font-size: 12px; overflow: hidden; flex: none; }
.av img { width: 100%; height: 100%; object-fit: cover; }
.who { display: flex; flex-direction: column; gap: 3px; min-width: 0; text-align: left; }
.who .hi { font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.who .proj { font-size: 10.5px; font-weight: 500; color: #99A3B7; white-space: nowrap; }
.caret { color: #6E7C90; font-size: 9px; margin-left: 2px; }
.menu { position: absolute; top: calc(100% + 6px); right: 0; z-index: 2147483000; width: 232px;
  background: #1A1F29; border: 1px solid #262C38; border-radius: 12px; padding: 7px;
  box-shadow: 0 18px 40px -20px rgba(0,0,0,.7); }
.menu .lbl { padding: 8px 10px 6px; font-size: 10px; font-weight: 600; letter-spacing: .06em;
  text-transform: uppercase; color: #6E7C90; }
.menu .proj-row { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 8px;
  background: #20262F; cursor: pointer; border: 0; width: 100%; color: #E8EDF4; font-size: 13px; font-weight: 600; }
.menu .proj-row:hover { background: #262d38; }
.menu .proj-row .go { margin-left: auto; color: #C8F250; font-size: 11px; font-weight: 600; }
.menu .sep { height: 1px; background: #262C38; margin: 6px 4px; }
.menu .item { display: block; width: 100%; text-align: left; padding: 8px 10px; border: 0; border-radius: 8px;
  background: transparent; color: #B4BECE; font-size: 13px; font-weight: 500; cursor: pointer; }
.menu .item:hover { background: #20262F; color: #E8EDF4; }
.menu .foot { padding: 8px 10px 4px; font-size: 11px; font-weight: 500; color: #6E7C90; line-height: 1.4; }
`;
function mountConnect(target, opts = {}) {
  const installUrl = opts.installUrl ?? "https://thelastprompt.ai/switchboard/";
  const host = document.createElement("div");
  host.style.display = "inline-block";
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = STYLE;
  root.append(style);
  const mount = document.createElement("div");
  root.append(mount);
  target.append(host);
  let state = { kind: "booting" };
  let menuOpen = false;
  let destroyed = false;
  let relay2 = null;
  let seq = 0;
  let wasConnected = false;
  let sessionDisconnected = false;
  const onDocClick = (e) => {
    if (menuOpen && !host.contains(e.target)) {
      menuOpen = false;
      render();
    }
  };
  document.addEventListener("click", onDocClick);
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text != null)
      n.textContent = text;
    return n;
  }
  async function refresh() {
    const my = ++seq;
    const r = await whenRelayReady(2500, { installUrl });
    if (destroyed || my !== seq)
      return;
    if (!(r instanceof Relay)) {
      state = { kind: "not-installed", installUrl };
      return render();
    }
    relay2 = r;
    subscribe(r);
    const grant = sessionDisconnected ? null : await r.permissions().catch(() => null);
    if (destroyed || my !== seq)
      return;
    if (!grant) {
      state = { kind: "disconnected", relay: r };
      emitTransition(false);
      return render();
    }
    const [user, project] = await Promise.all([r.identity(), r.context.active().catch(() => null)]);
    if (destroyed || my !== seq)
      return;
    state = { kind: "connected", relay: r, user, project };
    emitTransition(true);
    render();
  }
  function emitTransition(connected) {
    if (connected === wasConnected)
      return;
    wasConnected = connected;
    if (connected && relay2)
      opts.onConnect?.(relay2);
    else if (!connected)
      opts.onDisconnect?.();
  }
  let subscribed = false;
  function subscribe(r) {
    if (subscribed)
      return;
    subscribed = true;
    r.on("permissionsChanged", () => {
      void refresh();
    });
    r.on("disconnect", () => {
      void refresh();
    });
  }
  async function doConnect() {
    if (!relay2)
      return;
    try {
      sessionDisconnected = false;
      await relay2.connect(opts.scope);
      await refresh();
    } catch {
    }
  }
  async function doPick() {
    if (!relay2)
      return;
    menuOpen = false;
    render();
    const project = await relay2.context.pick().catch(() => null);
    opts.onProjectChange?.(project);
    await refresh();
  }
  async function doDisconnect() {
    if (!relay2)
      return;
    menuOpen = false;
    sessionDisconnected = true;
    await relay2.disconnect().catch(() => {
    });
    await refresh();
  }
  function render() {
    if (destroyed)
      return;
    mount.textContent = "";
    if (state.kind === "booting")
      return;
    if (state.kind === "not-installed") {
      const b = el("button", "btn get");
      b.append(el("span", "glyph"), el("span", void 0, "Get Switchboard"), el("span", "arr", "\u2197"));
      b.onclick = () => window.open(state.kind === "not-installed" ? state.installUrl : installUrl, "_blank", "noopener");
      mount.append(b);
      return;
    }
    if (state.kind === "disconnected") {
      const b = el("button", "btn connect");
      b.append(el("span", "glyph"), el("span", void 0, "Connect Switchboard"));
      b.onclick = doConnect;
      mount.append(b);
      return;
    }
    const { user, project } = state;
    const rawName = user?.name?.trim();
    const collides = !!rawName && !!project?.name && rawName.toLowerCase() === project.name.toLowerCase();
    const name = !rawName || collides ? "there" : rawName;
    const wrap = el("div", "wrap");
    const chip = el("button", "chip");
    const av = el("div", "av");
    if (user?.avatar) {
      const img = el("img");
      img.src = user.avatar;
      img.alt = name;
      av.append(img);
    } else
      av.textContent = name.charAt(0).toUpperCase();
    const who = el("div", "who");
    who.append(el("div", "hi", `Hi ${name}`));
    who.append(el("div", "proj", project ? project.name : "No context lent"));
    chip.append(av, who, el("span", "caret", "\u25BE"));
    chip.onclick = (e) => {
      e.stopPropagation();
      menuOpen = !menuOpen;
      render();
    };
    wrap.append(chip);
    if (menuOpen) {
      const menu = el("div", "menu");
      menu.append(el("div", "lbl", "Working on"));
      const row = el("button", "proj-row");
      row.append(el("span", void 0, project ? project.name : "Choose a context"));
      row.append(el("span", "go", project ? "Switch \u25B8" : "Choose \u25B8"));
      row.onclick = doPick;
      menu.append(row, el("div", "sep"));
      const dc = el("button", "item", "Disconnect this app");
      dc.onclick = doDisconnect;
      menu.append(dc);
      menu.append(el("div", "foot", "Connectors, budgets & activity live in the Switchboard toolbar panel."));
      wrap.append(menu);
    }
    mount.append(wrap);
  }
  render();
  void refresh();
  return {
    refresh: () => void refresh(),
    destroy: () => {
      destroyed = true;
      document.removeEventListener("click", onDocClick);
      host.remove();
    }
  };
}

// ../../packages/sdk/dist/index.js
var Relay = class {
  provider;
  constructor(provider) {
    this.provider = provider;
  }
  get version() {
    return this.provider.version;
  }
  capabilities() {
    return this.provider.request({ method: "claude_capabilities" });
  }
  connect(scope) {
    return this.provider.request({ method: "claude_connect", params: scope });
  }
  /** Drop this app's connection for the current page session. The grant persists (a later connect()
   *  won't reprompt) — this is "disconnect from this tab", not "revoke". Full revoke lives in the panel. */
  disconnect() {
    return this.provider.request({ method: "claude_disconnect" });
  }
  permissions() {
    return this.provider.request({ method: "claude_permissions" });
  }
  /** The paired user's public identity (name/avatar), or null if unavailable. Convenience over
   *  capabilities().user — what the connect chip greets with ("Hi Sameep"). */
  identity() {
    return this.capabilities().then((c) => c.user ?? null).catch(() => null);
  }
  /** Synthesize speech ON-DEVICE via a local model/engine (no cloud, no connector, no credits).
   *  Returns audio as a playable data: URL, or null if no local TTS is available.
   *
   *    const clip = await relay.speak("hey, it's Maya");
   *    if (clip) new Audio(clip.audio).play();
   */
  speak(text, opts) {
    return this.provider.request({ method: "claude_speak", params: { text, voice: opts?.voice } }).catch(() => null);
  }
  listTools() {
    return this.provider.request({ method: "claude_listTools" }).then((r) => r.tools);
  }
  callTool(name, args) {
    const call = { name, arguments: args };
    return this.provider.request({ method: "claude_callTool", params: call });
  }
  complete(params) {
    return this.provider.request({ method: "claude_complete", params });
  }
  /** Streamed completion as an async iterator of deltas. Ends after a `done`/`error` delta. */
  async *stream(params) {
    const { streamId } = await this.provider.request({ method: "claude_stream", params });
    const queue = [];
    let notify = null;
    let ended = false;
    const handler = (payload) => {
      const p = payload;
      if (p.streamId !== streamId)
        return;
      queue.push(p);
      if (p.type === "done" || p.type === "error")
        ended = true;
      notify?.();
    };
    this.provider.on("delta", handler);
    try {
      while (true) {
        if (queue.length === 0) {
          if (ended)
            break;
          await new Promise((r) => notify = r);
          notify = null;
          continue;
        }
        yield queue.shift();
      }
    } finally {
      this.provider.removeListener("delta", handler);
    }
  }
  on(event, handler) {
    this.provider.on(event, handler);
  }
  /**
   * Per-origin local storage — a private on-disk key/value store for this app, plus `bind` to point
   * it at a real folder the user picks. Values are opaque strings (store JSON). Isolated per origin;
   * reads are free, writes need the site not to be read-only, and `bind` prompts for the exact path.
   *
   *   await relay.storage.set("workspace", JSON.stringify(data));
   *   const raw = await relay.storage.get("workspace");
   *   await relay.storage.bind("~/Documents/Projects/brandbrain/.data"); // existing files appear as records
   */
  get storage() {
    const req = (params) => this.provider.request({ method: "claude_storage", params });
    return {
      get: (key) => req({ op: "get", key }).then((r) => r.value ?? null),
      set: (key, value) => req({ op: "set", key, value }).then(() => void 0),
      delete: (key) => req({ op: "delete", key }).then((r) => r.ok),
      list: () => req({ op: "list" }).then((r) => r.keys ?? []),
      info: () => req({ op: "info" }).then((r) => r.info),
      /** Point this app's store at a real folder (triggers a path-consent click). */
      bind: (path) => req({ op: "bind", path }).then((r) => r.info)
    };
  }
  /**
   * Shared, cross-app context — your portable brand knowledge. Publish a whole context; read the one
   * the user selected for this app; or open the picker. Selection happens in the side panel, so an
   * app only ever receives the context the user chose to lend it — never the whole library.
   *
   *   await relay.context.publish({ name: "Aamras", kind: "brand", data: brand });
   *   const active = await relay.context.active();   // the brand the user loaded for this app, or null
   */
  get context() {
    const req = (params) => this.provider.request({ method: "claude_context", params });
    return {
      publish: (context) => req({ op: "publish", context }).then((r) => r.id),
      list: () => req({ op: "list" }).then((r) => r.contexts ?? []),
      active: () => req({ op: "active" }).then((r) => r.context ?? null),
      pick: () => req({ op: "pick" }).then((r) => r.context ?? null)
    };
  }
};
var DEFAULT_INSTALL_URL = "https://thelastprompt.ai/switchboard/";
function getRelay(opts) {
  const provider = globalThis[PROVIDER_GLOBAL];
  if (provider?.isRelay)
    return new Relay(provider);
  return { installed: false, installUrl: opts?.installUrl ?? DEFAULT_INSTALL_URL };
}
function whenRelayReady(timeoutMs = 3e3, opts) {
  const now = getRelay(opts);
  if (now instanceof Relay)
    return Promise.resolve(now);
  return new Promise((resolve) => {
    const onInit = () => {
      cleanup();
      resolve(getRelay(opts));
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve({ installed: false, installUrl: opts?.installUrl ?? DEFAULT_INSTALL_URL });
    }, timeoutMs);
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener(`${PROVIDER_GLOBAL}#initialized`, onInit);
    }
    window.addEventListener(`${PROVIDER_GLOBAL}#initialized`, onInit);
  });
}

// src/adpulse.js
var $ = (id) => document.getElementById(id);
var INSTALL_URL = "https://thelastprompt.ai/switchboard/";
var STORE_KEY = "adpulse:v1";
var relay = null;
var notInstalled = false;
var rows = null;
var rawCsv = "";
var srcLabel = "";
var report = null;
var analysing = false;
var cancelled = false;
var pulling = false;
var pullSeq = 0;
var SAMPLE = [
  "Campaign name,Ad set,Amount spent (INR),Impressions,Clicks,CTR,CPC,Purchases,Purchase value,ROAS,Frequency,Date range",
  "Retargeting | Cart + Checkout Abandoners 14d,Warm \u2014 ATC no purchase,84500,412800,9630,2.33%,8.77,396,714900,8.46,3.8,1 Jun 2026 - 30 Jun 2026",
  '"Prospecting | Vitamin C Serum, UGC Hook v3",Broad F 24-40 \u2014 metros,142300,1852000,24870,1.34%,5.72,349,627400,4.41,1.9,1 Jun 2026 - 30 Jun 2026',
  "Retargeting | Past Purchasers 60d \u2014 Restock,Warm \u2014 bought once 60d,36200,158400,4210,2.66%,8.60,147,220800,6.10,4.9,1 Jun 2026 - 30 Jun 2026",
  "Prospecting | Founder Story Video,Broad All \u2014 21-45,98400,1421000,8810,0.62%,11.17,61,110200,1.12,6.4,1 Jun 2026 - 30 Jun 2026",
  "Prospecting | Niacinamide 10% Launch,Interest \u2014 skincare + beauty,76400,689000,5380,0.78%,14.20,23,41300,0.54,2.2,1 Jun 2026 - 30 Jun 2026",
  "Advantage+ | Catalog \u2014 All Products,Advantage+ audience,64200,587300,6890,1.17%,9.32,38,45600,0.71,2.0,1 Jun 2026 - 30 Jun 2026",
  "Prospecting | Influencer Whitelisting \u2014 Rhea,LAL 3% engagers,58900,512400,3140,0.61%,18.76,12,22400,0.38,1.7,1 Jun 2026 - 30 Jun 2026",
  "Retargeting | IG Engagers 30d,Warm \u2014 profile + reel engagers,22800,121700,2980,2.45%,7.65,76,118600,5.20,3.1,1 Jun 2026 - 30 Jun 2026",
  "Prospecting | SPF 50 Gel \u2014 Static Set,Broad F 20-38,47600,502100,6120,1.22%,7.78,74,109700,2.30,1.6,1 Jun 2026 - 30 Jun 2026",
  "Prospecting | Night Repair Carousel,Interest \u2014 night routine,51200,498000,7020,1.41%,7.29,96,148400,2.90,1.8,1 Jun 2026 - 30 Jun 2026",
  "Advantage+ | Bestsellers Bundle,Advantage+ audience,69800,634500,8460,1.33%,8.25,152,237600,3.40,2.1,1 Jun 2026 - 30 Jun 2026",
  "Brand | LAL 1% Purchasers \u2014 Serum Trio,LAL 1% purchasers 180d,44700,391200,4030,1.03%,11.09,47,80700,1.81,2.4,1 Jun 2026 - 30 Jun 2026"
].join("\n");
function parseCsv(text) {
  const out = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) out.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) out.push(row);
  return out;
}
var num = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
var findCol = (headers, re) => headers.findIndex((h) => re.test(h));
function loadData(text, source) {
  const grid = parseCsv(text);
  if (grid.length < 2) throw new Error("that doesn't look like a CSV \u2014 need a header row plus at least one campaign row.");
  const H = grid[0].map((h) => h.trim().toLowerCase());
  const col = {
    name: findCol(H, /campaign/),
    adset: findCol(H, /ad\s?set/),
    spend: findCol(H, /spen[dt]/),
    impr: findCol(H, /impr/),
    clicks: findCol(H, /click/),
    ctr: findCol(H, /\bctr\b|click-?through/),
    cpc: findCol(H, /\bcpc\b|cost per (link )?click/),
    purch: H.findIndex((h) => /purchase|result|conversion/.test(h) && !/value|cost|roas/.test(h)),
    value: findCol(H, /(purchase|conversion).*value|value.*(purchase|conversion)/),
    roas: findCol(H, /roas|return on ad/),
    freq: findCol(H, /freq/),
    range: findCol(H, /date|range|report/)
  };
  if (col.name === -1 || col.spend === -1)
    throw new Error("couldn't find \u201CCampaign name\u201D + \u201CAmount spent\u201D columns \u2014 is this a Meta Ads Manager export?");
  const pick = (r, i) => i === -1 ? "" : (r[i] ?? "").trim();
  const parsed = grid.slice(1).map((r) => {
    const spend = num(pick(r, col.spend));
    const value = num(pick(r, col.value));
    const roasCol = num(pick(r, col.roas));
    return {
      name: pick(r, col.name) || "(unnamed)",
      adset: pick(r, col.adset),
      spend,
      impr: num(pick(r, col.impr)),
      clicks: num(pick(r, col.clicks)),
      ctr: num(pick(r, col.ctr)),
      cpc: num(pick(r, col.cpc)),
      purch: num(pick(r, col.purch)),
      value,
      roas: spend > 0 && value > 0 ? value / spend : roasCol,
      freq: num(pick(r, col.freq)),
      range: pick(r, col.range)
    };
  }).filter((r) => r.name !== "(unnamed)" || r.spend > 0);
  if (!parsed.length) throw new Error("parsed the header but found no campaign rows underneath it.");
  rows = parsed;
  rawCsv = text;
  srcLabel = source;
  hasAdset = col.adset !== -1;
  $("feed-err").hidden = true;
  renderTape();
  persist();
  reflect();
}
var hasAdset = true;
var fmtIN = (n, d = 0) => Number(n).toLocaleString("en-IN", { maximumFractionDigits: d });
var trunc = (s, n) => s.length > n ? s.slice(0, n - 1) + "\u2026" : s;
function totals() {
  const spend = rows.reduce((a, r) => a + r.spend, 0);
  const value = rows.reduce((a, r) => a + r.value, 0);
  const purch = rows.reduce((a, r) => a + r.purch, 0);
  const spent = rows.filter((r) => r.spend > 0);
  let worst = null;
  for (const r of spent) {
    const cpa = r.purch > 0 ? r.spend / r.purch : Infinity;
    if (!worst || cpa > (worst.purch > 0 ? worst.spend / worst.purch : Infinity)) worst = r;
  }
  let best = null;
  for (const r of spent) if (!best || r.roas > best.roas) best = r;
  return { spend, value, purch, blended: spend > 0 ? value / spend : 0, worst, best };
}
function statCell(label, value, sub, cls) {
  const cell = document.createElement("div");
  cell.className = "stat";
  const l = document.createElement("div");
  l.className = "l";
  l.textContent = label;
  const v = document.createElement("div");
  v.className = "v" + (cls ? " " + cls : "");
  v.textContent = value;
  const s = document.createElement("div");
  s.className = "s";
  s.textContent = sub;
  cell.append(l, v, s);
  return cell;
}
function renderTape() {
  const t = totals();
  const stats = $("stats");
  stats.textContent = "";
  stats.append(
    statCell("total spend", "\u20B9" + fmtIN(t.spend), rows[0].range || rows.length + " campaigns", ""),
    statCell("blended roas", t.blended.toFixed(2) + "\xD7", "\u20B9" + fmtIN(t.value) + " revenue", t.blended >= 3 ? "good" : t.blended >= 1 ? "hot" : "bad"),
    statCell("purchases", fmtIN(t.purch), t.purch > 0 ? "\u20B9" + fmtIN(t.spend / t.purch) + " blended CPA" : "no conversions", ""),
    statCell("worst cpa", t.worst && t.worst.purch > 0 ? "\u20B9" + fmtIN(t.worst.spend / t.worst.purch) : "\u221E", t.worst ? trunc(t.worst.name, 30) + (t.worst.purch === 0 ? " \xB7 0 purchases" : "") : "\u2014", "bad"),
    statCell("best campaign", t.best ? t.best.roas.toFixed(1) + "\xD7" : "\u2014", t.best ? trunc(t.best.name, 30) : "\u2014", "good")
  );
  const cols = [
    { h: "Campaign", k: "name", cls: (r) => "name" },
    ...hasAdset ? [{ h: "Ad set", k: "adset" }] : [],
    { h: "Spend \u20B9", k: "spend", n: 1, f: (v) => fmtIN(v) },
    { h: "Impr", k: "impr", n: 1, f: (v) => fmtIN(v) },
    { h: "Clicks", k: "clicks", n: 1, f: (v) => fmtIN(v) },
    { h: "CTR", k: "ctr", n: 1, f: (v) => v ? v.toFixed(2) + "%" : "\u2014" },
    { h: "CPC \u20B9", k: "cpc", n: 1, f: (v) => v ? v.toFixed(2) : "\u2014" },
    { h: "Purch", k: "purch", n: 1, f: (v) => fmtIN(v) },
    { h: "Value \u20B9", k: "value", n: 1, f: (v) => fmtIN(v) },
    { h: "ROAS", k: "roas", n: 1, f: (v) => v.toFixed(2) + "\xD7", cls: (r) => r.roas >= 3 ? "up" : r.roas < 1 ? "down" : "" },
    { h: "Freq", k: "freq", n: 1, f: (v) => v ? v.toFixed(1) : "\u2014", cls: (r) => r.freq >= 5 ? "warm" : "" }
  ];
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  cols.forEach((c) => {
    const th = document.createElement("th");
    if (c.n) th.className = "n";
    th.textContent = c.h;
    hr.append(th);
  });
  thead.append(hr);
  const tbody = document.createElement("tbody");
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    cols.forEach((c) => {
      const td = document.createElement("td");
      const extra = c.cls ? c.cls(r) : "";
      td.className = [c.n ? "n" : "", extra].filter(Boolean).join(" ");
      td.textContent = c.f ? c.f(r[c.k]) : String(r[c.k] || "\u2014");
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(thead, tbody);
  const box = $("previewbox");
  box.textContent = "";
  box.append(table);
  $("tape-cap").textContent = "";
  const capB = document.createElement("b");
  capB.textContent = srcLabel === "sample" ? "sample account \xB7 Verra Skincare (DTC)" : srcLabel === "restored" ? "restored from your last session" : srcLabel === "live" ? "pulled live from your Ads Manager \u2014 via your own Meta connector" : "your export";
  $("tape-cap").append(capB, ` \u2014 ${rows.length} campaigns parsed in this tab, all rows shown. ` + (srcLabel === "sample" ? "Paste your own export above to replace it." : ""));
  $("tape").hidden = false;
}
mountConnect($("chip-dock"), {
  scope: { reason: "diagnose your Meta ads performance", models: ["sonnet"] },
  installUrl: INSTALL_URL,
  onConnect: (r) => {
    relay = r;
    reflect();
  },
  onDisconnect: () => {
    relay = null;
    reflect();
  }
});
(async () => {
  const r = await whenRelayReady(2e3, { installUrl: INSTALL_URL });
  if (r && "connect" in r) {
    const grant = await r.permissions().catch(() => null);
    if (grant) relay = r;
  } else if (r && r.installed === false) {
    notInstalled = true;
  }
  reflect();
})();
function reflect() {
  const haveData = !!rows && rows.length > 0;
  $("analyse").disabled = !relay || !haveData || analysing || pulling;
  $("rerun").disabled = !relay || !haveData || analysing || pulling;
  $("pull-live").disabled = !relay || pulling || analysing;
  $("pull-live").title = relay ? "reads your Ads Manager through your own Meta connector \u2014 nothing touches our servers (we have none)" : "connect Switchboard (top right) first";
  const hint = $("conn-hint");
  hint.textContent = "";
  if (relay) {
    hint.append("connected \u2014 the diagnosis runs on ", strong("your"), " Claude. " + (haveData ? "" : "Load the sample, paste an export, or pull live."));
  } else if (notInstalled) {
    const a = document.createElement("a");
    a.href = INSTALL_URL;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = "get Switchboard \u2192";
    hint.append("everything above works without AI. To run the diagnosis on your own Claude, ", a);
  } else {
    hint.append("form's live, sample's loaded \u2014 ", strong("connect Switchboard"), " (top right) to run the diagnosis.");
  }
}
function strong(t) {
  const b = document.createElement("b");
  b.textContent = t;
  return b;
}
document.querySelectorAll(".steer-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    $("focus-in").value = chip.dataset.focus;
    document.querySelectorAll(".steer-chip").forEach((c) => c.classList.toggle("on", c === chip));
    persist();
  });
});
$("focus-in").addEventListener("input", () => {
  document.querySelectorAll(".steer-chip").forEach((c) => c.classList.toggle("on", c.dataset.focus === $("focus-in").value));
  persist();
});
function ingest(text, source) {
  try {
    if (!text.trim()) {
      rows = null;
      $("tape").hidden = true;
      $("feed-err").hidden = true;
      reflect();
      return;
    }
    loadData(text, source);
  } catch (err) {
    rows = null;
    $("tape").hidden = true;
    const fe = $("feed-err");
    fe.hidden = false;
    fe.textContent = "\u26A0 " + String(err?.message || err);
    reflect();
  }
}
var typeTimer = null;
$("csv-in").addEventListener("input", () => {
  clearTimeout(typeTimer);
  typeTimer = setTimeout(() => ingest($("csv-in").value, "pasted"), 350);
});
$("load-sample").addEventListener("click", () => {
  $("csv-in").value = SAMPLE;
  ingest(SAMPLE, "sample");
});
$("browse").addEventListener("click", () => $("file-in").click());
$("file-in").addEventListener("change", () => {
  const f = $("file-in").files[0];
  if (f) readFile(f);
  $("file-in").value = "";
});
function readFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    $("csv-in").value = String(reader.result);
    ingest(String(reader.result), "file");
  };
  reader.onerror = () => {
    const fe = $("feed-err");
    fe.hidden = false;
    fe.textContent = "\u26A0 couldn't read that file \u2014 try pasting the CSV instead.";
  };
  reader.readAsText(file);
}
var feed = $("feed-panel");
["dragenter", "dragover"].forEach((ev) => feed.addEventListener(ev, (e) => {
  e.preventDefault();
  feed.classList.add("drag");
}));
["dragleave", "drop"].forEach((ev) => feed.addEventListener(ev, (e) => {
  e.preventDefault();
  feed.classList.remove("drag");
}));
feed.addEventListener("drop", (e) => {
  const f = e.dataTransfer?.files?.[0];
  if (f) readFile(f);
});
var PREFIX_KEY = "adpulse:meta-prefix";
var PULL_PROMPT = [
  "You are connected to the user's own Meta ads tools (MCP tool names containing things like ads_get_ad_accounts, ads_insights_*). Pull their live campaign performance:",
  "1) Find their ad accounts. If there are several, pick the one with recent spend.",
  "2) Pull CAMPAIGN-level performance for the LAST 30 DAYS: spend, impressions, clicks, CTR, CPC, purchases (or the account's primary conversion), purchase/conversion value, ROAS (compute value/spend if not returned), frequency. Prefer get/insights tools; call as few tools as possible.",
  "3) Then reply with ONLY a CSV \u2014 no prose, no markdown fences. Header row EXACTLY:",
  "Campaign name,Ad set,Amount spent (XXX),Impressions,Clicks,CTR,CPC,Purchases,Purchase value,ROAS,Frequency,Date range",
  "\u2026where XXX is the account's real currency code (INR, USD, \u2026). One row per campaign that spent money in the window (skip drafts/never-delivered). Ad set may be blank at campaign level. Date range is the real window like 9 Jun 2026 - 8 Jul 2026, same value every row. Quote any field containing a comma.",
  "If a tool call is denied or the account is empty, reply with one line starting with PULL-FAILED: and the reason."
].join("\n");
function setPull(on, line) {
  pulling = on;
  $("pull-status").hidden = !on;
  if (line != null) $("pull-line").textContent = line;
  reflect();
}
async function discoverPrefix(myRun) {
  let cached = null;
  try {
    cached = localStorage.getItem(PREFIX_KEY);
  } catch {
  }
  if (cached) return cached;
  setPull(true, "asking your Claude which connector holds your ads tools\u2026");
  let text = "";
  for await (const d of relay.stream({
    prompt: "Look at the tool names available to you. Find the MCP connector whose tools read Meta/Facebook ads data (tool names like ads_get_ad_accounts, ads_insights_performance_trend, ads_library_search). Reply with ONLY that connector's common tool-name prefix, up to and including the trailing double underscore \u2014 e.g. mcp__claude_ai_Meta_Ads__ \u2014 on a single line, no prose. If you have no such tools, reply exactly NONE.",
    agentic: true
  })) {
    if (myRun !== pullSeq) return null;
    if (d.type === "text") text += d.text;
    else if (d.type === "error") throw new Error(d.error?.message || "stream error");
  }
  const m = text.match(/mcp__[A-Za-z0-9_]+__(?!_)/);
  if (!m) throw new Error("no Meta ads connector found on your Claude \u2014 add one on claude.ai (Settings \u2192 Connectors), or paste a CSV export instead.");
  try {
    localStorage.setItem(PREFIX_KEY, m[0]);
  } catch {
  }
  return m[0];
}
function extractCsv(text) {
  const t = text.replace(/```[a-z]*\n?/gi, "");
  const failed = t.match(/^PULL-FAILED:\s*(.+)$/mi);
  if (failed) throw new Error(failed[1].slice(0, 200));
  const start = t.search(/^\s*"?Campaign name"?\s*,/mi);
  if (start === -1) return null;
  const csv = t.slice(start).trim();
  return csv.split("\n").length >= 2 ? csv : null;
}
async function pullLive() {
  if (!relay || pulling || analysing) return;
  const myRun = ++pullSeq;
  $("feed-err").hidden = true;
  try {
    const prefix = await discoverPrefix(myRun);
    if (myRun !== pullSeq || !prefix) return;
    setPull(true, "asking your consent to read the ads connector\u2026");
    await relay.connect({
      reason: "pull your Meta ads performance (read-only) to diagnose it",
      tools: [prefix + "*"],
      models: ["sonnet"]
    });
    if (myRun !== pullSeq) return;
    setPull(true, "opening your ad account\u2026");
    let text = "";
    for await (const d of relay.stream({ prompt: PULL_PROMPT, agentic: true })) {
      if (myRun !== pullSeq) return;
      if (d.type === "tool_proposed") setPull(true, "calling " + d.call.name.split("__").pop() + "\u2026");
      else if (d.type === "tool_result" && !d.result.ok) setPull(true, "\u26D4 " + (d.result.error?.message || "denied") + " \u2014 continuing\u2026");
      else if (d.type === "text") text += d.text;
      else if (d.type === "error") throw new Error(d.error?.message || "stream error");
    }
    if (myRun !== pullSeq) return;
    const csv = extractCsv(text);
    if (!csv) throw new Error("your Claude answered but not with a parseable CSV \u2014 pull again, it usually lands on the second pass.");
    $("csv-in").value = csv;
    ingest(csv, "live");
    $("tape").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    if (myRun !== pullSeq) return;
    try {
      localStorage.removeItem(PREFIX_KEY);
    } catch {
    }
    const fe = $("feed-err");
    fe.hidden = false;
    fe.textContent = "\u26A0 live pull failed: " + String(err?.message || err).slice(0, 240);
  } finally {
    if (myRun === pullSeq) setPull(false);
  }
}
$("pull-live").addEventListener("click", pullLive);
$("pull-cancel").addEventListener("click", () => {
  pullSeq++;
  setPull(false);
});
function buildPrompt() {
  const focus = $("focus-in").value.trim() || "Full account post-mortem: wins, leaks, and what to do next.";
  const t = totals();
  let csv = rawCsv.trim();
  if (csv.length > 28e3) csv = csv.slice(0, 28e3) + "\n[...truncated]";
  return [
    "You are AdPulse, a blunt, numbers-first Meta Ads performance analyst. A founder exported the data below from Meta Ads Manager. Currency is INR (\u20B9) unless the headers clearly say otherwise; treat the export window as roughly one month.",
    `Pre-computed aggregates (trust these): total spend \u20B9${fmtIN(t.spend)}; blended ROAS ${t.blended.toFixed(2)}; total purchases ${fmtIN(t.purch)}; total purchase value \u20B9${fmtIN(t.value)}; ${rows.length} campaigns.`,
    "CSV EXPORT:\n" + csv,
    "ANALYSIS FOCUS (weigh the whole diagnosis toward this): " + focus,
    'Respond with ONLY one JSON object \u2014 no prose, no markdown fences \u2014 in exactly this shape:\n{"score": <integer 0-100, overall account health: 0 = burning cash, 100 = dialed in>, "headline": "<one blunt verdict sentence, max 120 chars>", "wins": [{"title": "...", "detail": "..."}], "leaks": [{"title": "...", "detail": "...", "monthlyBurn": <estimated INR wasted per month, plain number>}], "actions": [{"title": "...", "impact": "high"|"medium", "effort": "low"|"medium"|"high", "detail": "..."}], "campaigns": [{"name": "<campaign name copied EXACTLY from the data>", "verdict": "scale"|"keep"|"fix"|"kill", "note": "<max 90 chars>"}]}',
    "Rules: 2-4 wins, 2-4 leaks, 4-6 actions ordered most-urgent first, and one campaigns entry per campaign in the data. Cite real numbers from the data (ROAS, CPA, frequency, spend) in every detail. Each detail under 220 chars. Specific beats generic; a founder acts on this tomorrow morning."
  ].join("\n\n");
}
var STATUS_TAIL = [
  "checking spend concentration\u2026",
  "hunting wasted spend\u2026",
  "measuring creative fatigue\u2026",
  "weighing retargeting vs prospecting\u2026",
  "scoring account health\u2026",
  "ranking tomorrow's moves\u2026"
];
var liveTimer = null;
function setLive(on) {
  analysing = on;
  $("livebox").hidden = !on;
  if (on) {
    $("live-line").textContent = `reading ${rows.length} campaigns\u2026`;
    $("live-meta").textContent = "0.0 kb";
    let i = 0;
    liveTimer = setInterval(() => {
      $("live-line").textContent = STATUS_TAIL[i % STATUS_TAIL.length];
      i++;
    }, 2400);
  } else {
    clearInterval(liveTimer);
  }
  reflect();
}
async function analyse() {
  if (!relay || !rows || analysing) return;
  cancelled = false;
  setLive(true);
  $("errbox").hidden = true;
  $("livebox").scrollIntoView({ behavior: "smooth", block: "nearest" });
  let text = "";
  try {
    for await (const d of relay.stream({ prompt: buildPrompt() })) {
      if (cancelled) break;
      if (d.type === "text") {
        text += d.text;
        $("live-meta").textContent = (text.length / 1024).toFixed(1) + " kb";
      } else if (d.type === "error") {
        throw new Error(d.error?.message || "stream error");
      }
    }
    if (cancelled) return;
    const m = text.match(/\{[\s\S]*\}/);
    let data = null;
    if (m) {
      try {
        data = JSON.parse(m[0]);
      } catch {
      }
    }
    if (!data) throw new Error("the model didn't return clean JSON \u2014 hit \u21BB RETRY, it usually lands on the second pass.");
    report = normalize(data);
    persist();
    renderReport();
    $("report").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    showError(err);
  } finally {
    setLive(false);
  }
}
$("analyse").addEventListener("click", analyse);
$("rerun").addEventListener("click", analyse);
$("retry").addEventListener("click", analyse);
$("cancel").addEventListener("click", () => {
  cancelled = true;
  setLive(false);
});
$("focus-in").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !$("analyse").disabled) analyse();
});
function showError(err) {
  const box = $("errbox");
  box.hidden = false;
  const msg = $("err-msg");
  msg.textContent = "";
  const b = document.createElement("b");
  b.textContent = "Diagnosis failed. ";
  msg.append(b, String(err?.message || err).slice(0, 240));
}
function normalize(d) {
  const clampArr = (a) => Array.isArray(a) ? a : [];
  const VERDICTS = ["scale", "keep", "fix", "kill"];
  const IMPACTS = ["high", "medium"];
  const EFFORTS = ["low", "medium", "high"];
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(d.score) || 0))),
    headline: String(d.headline || "Diagnosis complete \u2014 see the readout below.").slice(0, 200),
    wins: clampArr(d.wins).slice(0, 6).map((w) => ({ title: String(w?.title || "Win"), detail: String(w?.detail || "") })),
    leaks: clampArr(d.leaks).slice(0, 6).map((l) => ({ title: String(l?.title || "Leak"), detail: String(l?.detail || ""), monthlyBurn: l?.monthlyBurn })),
    actions: clampArr(d.actions).slice(0, 8).map((a) => ({
      title: String(a?.title || "Action"),
      impact: IMPACTS.includes(String(a?.impact).toLowerCase()) ? String(a.impact).toLowerCase() : "medium",
      effort: EFFORTS.includes(String(a?.effort).toLowerCase()) ? String(a.effort).toLowerCase() : "medium",
      detail: String(a?.detail || "")
    })),
    campaigns: clampArr(d.campaigns).slice(0, 60).map((c) => ({
      name: String(c?.name || "?"),
      verdict: VERDICTS.includes(String(c?.verdict).toLowerCase()) ? String(c.verdict).toLowerCase() : "keep",
      note: String(c?.note || "")
    }))
  };
}
var SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs, text) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (text != null) el.textContent = text;
  return el;
}
function renderDial(score) {
  const s = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const color = s >= 70 ? "var(--green)" : s >= 40 ? "var(--amber)" : "var(--red)";
  const ARC = "M 24 106 A 76 76 0 0 1 176 106";
  const svg = svgEl("svg", { viewBox: "0 0 200 122", width: "206", height: "126", role: "img", "aria-label": `account health ${s} of 100` });
  svg.append(
    svgEl("path", { d: ARC, fill: "none", style: "stroke:var(--hair-2)", "stroke-width": "10", "stroke-linecap": "round" }),
    svgEl("path", { class: "arc-val", d: ARC, fill: "none", style: "stroke:" + color, "stroke-width": "10", "stroke-linecap": "round", pathLength: "100", "stroke-dasharray": s + " 100" }),
    svgEl("text", { class: "big", x: "100", y: "95", "text-anchor": "middle" }, String(s)),
    svgEl("text", { class: "sub", x: "100", y: "115", "text-anchor": "middle" }, "/ 100 ACCOUNT HEALTH")
  );
  const dial = $("dial");
  dial.textContent = "";
  dial.append(svg);
}
function burnLine(b) {
  if (typeof b === "number" && isFinite(b) && b > 0) return "\u25BC \u20B9" + fmtIN(b) + " / mo burn";
  const s = String(b ?? "").trim();
  return s && s !== "undefined" && s !== "null" ? "\u25BC " + s.slice(0, 60) : null;
}
function card(kind, title, detail, burn) {
  const el = document.createElement("div");
  el.className = "card " + kind;
  const t = document.createElement("div");
  t.className = "t";
  t.textContent = title;
  const d = document.createElement("div");
  d.className = "d";
  d.textContent = detail;
  el.append(t, d);
  if (burn) {
    const bl = document.createElement("div");
    bl.className = "burn";
    bl.textContent = burn;
    el.append(bl);
  }
  return el;
}
function noneCard(text) {
  const el = document.createElement("div");
  el.className = "none";
  el.textContent = text;
  return el;
}
function tagEl(cls, text) {
  const t = document.createElement("span");
  t.className = "tag " + cls;
  t.textContent = text;
  return t;
}
function renderReport() {
  if (!report) return;
  renderDial(report.score);
  $("headline").textContent = report.headline;
  const wins = $("wins");
  wins.textContent = "";
  if (report.wins.length) report.wins.forEach((w) => wins.append(card("win", w.title, w.detail)));
  else wins.append(noneCard("no clear wins found \u2014 that is itself the finding"));
  const leaks = $("leaks");
  leaks.textContent = "";
  if (report.leaks.length) report.leaks.forEach((l) => leaks.append(card("leak", l.title, l.detail, burnLine(l.monthlyBurn))));
  else leaks.append(noneCard("no material leaks detected"));
  const acts = $("actions");
  acts.textContent = "";
  if (report.actions.length) {
    report.actions.forEach((a, i) => {
      const row = document.createElement("div");
      row.className = "action";
      const idx = document.createElement("div");
      idx.className = "idx";
      idx.textContent = String(i + 1).padStart(2, "0");
      const body = document.createElement("div");
      body.className = "body";
      const t = document.createElement("span");
      t.className = "t";
      t.textContent = a.title;
      body.append(
        t,
        tagEl(a.impact === "high" ? "hi" : "med", "impact " + a.impact),
        tagEl(a.effort === "low" ? "lo" : a.effort === "high" ? "hard" : "dim", "effort " + a.effort)
      );
      const d = document.createElement("div");
      d.className = "d";
      d.textContent = a.detail;
      body.append(d);
      row.append(idx, body);
      acts.append(row);
    });
  } else acts.append(noneCard("no actions returned \u2014 re-run the diagnosis"));
  const vbox = $("verdicts");
  vbox.textContent = "";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  ["Campaign", "Verdict", "Why"].forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    hr.append(th);
  });
  thead.append(hr);
  const tbody = document.createElement("tbody");
  report.campaigns.forEach((c) => {
    const tr = document.createElement("tr");
    const n = document.createElement("td");
    n.className = "name";
    n.textContent = c.name;
    const v = document.createElement("td");
    const vt = document.createElement("span");
    vt.className = "vtag " + c.verdict;
    vt.textContent = c.verdict;
    v.append(vt);
    const note = document.createElement("td");
    note.textContent = c.note;
    note.style.whiteSpace = "normal";
    tr.append(n, v, note);
    tbody.append(tr);
  });
  table.append(thead, tbody);
  vbox.append(table);
  $("report").hidden = false;
  reflect();
}
function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      csv: rawCsv.length <= 2e5 ? rawCsv : "",
      source: srcLabel,
      focus: $("focus-in").value,
      report,
      at: Date.now()
    }));
  } catch {
  }
}
(function boot() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORE_KEY));
  } catch {
  }
  if (saved?.report) report = saved.report ? normalize(saved.report) : null;
  $("focus-in").value = saved?.focus || "Find wasted spend";
  document.querySelectorAll(".steer-chip").forEach((c) => c.classList.toggle("on", c.dataset.focus === $("focus-in").value));
  if (saved?.csv) {
    $("csv-in").value = saved.csv;
    ingest(saved.csv, saved.source === "sample" ? "sample" : "restored");
  } else {
    $("csv-in").value = SAMPLE;
    ingest(SAMPLE, "sample");
  }
  if (report) renderReport();
  reflect();
})();
//# sourceMappingURL=adpulse.js.map
