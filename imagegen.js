// ../../../../../packages/protocol/dist/version.js
var PROVIDER_GLOBAL = "claude";

// ../../../../../packages/protocol/dist/storage.js
var STORAGE_KEY_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
function isValidStorageKey(key) {
  return typeof key === "string" && STORAGE_KEY_RE.test(key);
}

// ../../../../../packages/protocol/dist/errors.js
var BYOPErrorCode = {
  /** User rejected the connect/consent request. (≈ 4001) */
  USER_REJECTED: 4001,
  /** Origin is not connected / has no grant for this method. (≈ 4100) */
  UNAUTHORIZED: 4100,
  /** Method exists but the origin's scope doesn't cover it (model/tool not granted). */
  SCOPE_EXCEEDED: 4110,
  /** A per-action write consent was denied by the user. */
  CONSENT_DENIED: 4120,
  /** Budget or rate limit hit (tokens/day or calls/min). */
  BUDGET_EXCEEDED: 4290,
  /** Unknown method. (≈ 4200) */
  UNSUPPORTED_METHOD: 4200,
  /** Bad params. (≈ -32602) */
  INVALID_PARAMS: -32602,
  /** The sidekick daemon is not installed / not reachable. The SDK maps this to its
   *  "install the sidekick" fallback. */
  PROVIDER_UNAVAILABLE: 4900,
  /** Backend error (model/tool failed for a non-policy reason). */
  BACKEND_ERROR: 4500
};

// ../../../../../packages/sdk/dist/connect-chip.js
function rungFromError(e) {
  if (e?.code !== BYOPErrorCode.PROVIDER_UNAVAILABLE)
    return null;
  return e?.data?.reason === "unpaired" ? { kind: "unpaired" } : { kind: "unreachable" };
}
var CHROME_STORE_URL = "https://chromewebstore.google.com/detail/injmjolmnekmahlnackakiamjepegagb";
var RELAY_DMG_URL = "https://github.com/sameeeeeeep/switchboard/releases/latest/download/Switchboard.dmg";
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
/* Setup-ladder pills (sidekick asleep / unpaired): quiet and informative, never red \u2014 nothing is
   broken. Amber only while the daemon is unreachable; the glyph stays muted until it's reachable. */
.dot { width: 7px; height: 7px; border-radius: 50%; background: #E8B84B; flex: none;
  box-shadow: 0 0 8px rgba(232,184,75,.45); }
.menu .body { padding: 8px 10px 2px; font-size: 12px; font-weight: 500; color: #B4BECE; line-height: 1.45; }
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
  let state2 = { kind: "booting" };
  let menuOpen = false;
  let destroyed = false;
  let relay2 = null;
  let seq = 0;
  let wasConnected = false;
  let lastProjectKey;
  let sessionDisconnected = false;
  const onDocClick = (e) => {
    if (menuOpen && !host.contains(e.target)) {
      menuOpen = false;
      render();
    }
  };
  document.addEventListener("click", onDocClick);
  const initEvent = `${PROVIDER_GLOBAL}#initialized`;
  let lateWatching = false;
  const onLateInit = () => {
    lateWatching = false;
    window.removeEventListener(initEvent, onLateInit);
    if (!destroyed)
      void refresh();
  };
  function watchForLateProvider() {
    if (lateWatching || destroyed)
      return;
    lateWatching = true;
    window.addEventListener(initEvent, onLateInit);
  }
  function el2(tag, cls, text) {
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
      watchForLateProvider();
      state2 = { kind: "not-installed", installUrl };
      return render();
    }
    relay2 = r;
    subscribe(r);
    const h = await r.health();
    if (destroyed || my !== seq)
      return;
    if (h && !h.reachable) {
      state2 = { kind: "unreachable", appMissing: h.installedHere === false };
      emitTransition(false);
      return render();
    }
    if (h && !h.paired) {
      state2 = { kind: "unpaired" };
      emitTransition(false);
      return render();
    }
    let permErr = null;
    const grant = sessionDisconnected ? null : await r.permissions().catch((e) => {
      permErr = e;
      return null;
    });
    if (destroyed || my !== seq)
      return;
    if (!grant) {
      const rung = !h ? rungFromError(permErr) : null;
      if (rung) {
        state2 = rung;
        emitTransition(false);
        return render();
      }
      state2 = { kind: "disconnected", relay: r };
      emitTransition(false);
      return render();
    }
    const wantsContext = opts.context !== "none";
    const [user, project] = await Promise.all([
      r.identity(),
      wantsContext ? r.context.active().catch(() => null) : Promise.resolve(null)
    ]);
    if (destroyed || my !== seq)
      return;
    const wasAlreadyConnected = wasConnected;
    state2 = { kind: "connected", relay: r, user, project };
    emitTransition(true);
    const projKey = project ? project.id ?? project.name : null;
    if (wasAlreadyConnected && lastProjectKey !== void 0 && projKey !== lastProjectKey)
      opts.onProjectChange?.(project);
    lastProjectKey = projKey;
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
    r.on("health", () => {
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
    } catch (e) {
      const err = e;
      if (err?.code !== BYOPErrorCode.PROVIDER_UNAVAILABLE)
        return;
      await refresh();
      if (state2.kind === "disconnected") {
        const rung = rungFromError(err);
        if (rung) {
          state2 = rung;
          emitTransition(false);
          render();
        }
      }
    }
  }
  async function doPick() {
    if (!relay2)
      return;
    menuOpen = false;
    render();
    await relay2.context.pick().catch(() => null);
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
    if (state2.kind === "booting")
      return;
    if (state2.kind === "not-installed") {
      const url = state2.installUrl;
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn get");
      b.append(el2("span", "glyph"), el2("span", void 0, "Get Switchboard"), el2("span", "arr", "\u2197"));
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        menu.append(el2("div", "body", "Two parts: the Chrome extension, then Switchboard for Mac."));
        const store = el2("button", "item", "1 \xB7 Add to Chrome \u2197");
        store.onclick = () => {
          menuOpen = false;
          render();
          window.open(CHROME_STORE_URL, "_blank", "noopener");
        };
        const guide = el2("button", "item", "2 \xB7 Get Switchboard for Mac \u2197");
        guide.onclick = () => {
          menuOpen = false;
          render();
          window.open(url, "_blank", "noopener");
        };
        menu.append(store, guide);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "unreachable") {
      const appMissing = state2.appMissing === true;
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn get");
      b.append(el2("span", "glyph"), el2("span", void 0, appMissing ? "Get Switchboard for Mac" : "Your sidekick is asleep"), el2("span", appMissing ? "arr" : "dot", appMissing ? "\u2197" : void 0), ...appMissing ? [] : [el2("span", "caret", "\u25BE")]);
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        if (appMissing) {
          menu.append(el2("div", "body", "Extension \u2713 \u2014 now the other half: Switchboard, the Mac app that holds your Claude."));
          const dl = el2("button", "item", "Download Switchboard.dmg \u2197");
          dl.onclick = () => {
            menuOpen = false;
            render();
            window.open(RELAY_DMG_URL, "_blank", "noopener");
          };
          menu.append(dl, el2("div", "sep"));
        } else {
          menu.append(el2("div", "body", "Open the Switchboard menubar app to wake it."));
          const retry = el2("button", "item", "Retry");
          retry.onclick = () => {
            menuOpen = false;
            render();
            void refresh();
          };
          menu.append(retry, el2("div", "sep"));
        }
        const setup = el2("button", "item", "New here? Full setup \u2197");
        setup.onclick = () => {
          menuOpen = false;
          render();
          window.open(installUrl, "_blank", "noopener");
        };
        menu.append(setup);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "unpaired") {
      const wrap2 = el2("div", "wrap");
      const b = el2("button", "btn connect");
      b.append(el2("span", "glyph"), el2("span", void 0, "Almost there \u2014 pair in the side panel"), el2("span", "caret", "\u25BE"));
      b.onclick = (e) => {
        e.stopPropagation();
        menuOpen = !menuOpen;
        render();
      };
      wrap2.append(b);
      if (menuOpen) {
        const menu = el2("div", "menu");
        menu.append(el2("div", "body", "Click the Switchboard icon in your Chrome toolbar and paste your pairing token."));
        const retry = el2("button", "item", "Retry");
        retry.onclick = () => {
          menuOpen = false;
          render();
          void refresh();
        };
        menu.append(retry);
        wrap2.append(menu);
      }
      mount.append(wrap2);
      return;
    }
    if (state2.kind === "disconnected") {
      const b = el2("button", "btn connect");
      b.append(el2("span", "glyph"), el2("span", void 0, "Connect Switchboard"));
      b.onclick = doConnect;
      mount.append(b);
      return;
    }
    const { user, project } = state2;
    const rawName = user?.name?.trim();
    const collides = !!rawName && !!project?.name && rawName.toLowerCase() === project.name.toLowerCase();
    const name = !rawName || collides ? "there" : rawName;
    const wrap = el2("div", "wrap");
    const chip = el2("button", "chip");
    const av = el2("div", "av");
    if (user?.avatar) {
      const img = el2("img");
      img.src = user.avatar;
      img.alt = name;
      av.append(img);
    } else
      av.textContent = name.charAt(0).toUpperCase();
    const wantsContext = opts.context !== "none";
    const who = el2("div", "who");
    who.append(el2("div", "hi", `Hi ${name}`));
    who.append(el2("div", "proj", wantsContext ? project ? project.name : "No context lent" : "Connected"));
    chip.append(av, who, el2("span", "caret", "\u25BE"));
    chip.onclick = (e) => {
      e.stopPropagation();
      menuOpen = !menuOpen;
      render();
    };
    wrap.append(chip);
    if (menuOpen) {
      const menu = el2("div", "menu");
      if (wantsContext) {
        menu.append(el2("div", "lbl", "Working on"));
        const row = el2("button", "proj-row");
        row.append(el2("span", void 0, project ? project.name : "Choose a context"));
        row.append(el2("span", "go", project ? "Switch \u25B8" : "Choose \u25B8"));
        row.onclick = doPick;
        menu.append(row, el2("div", "sep"));
      }
      const dc = el2("button", "item", "Disconnect this app");
      dc.onclick = doDisconnect;
      menu.append(dc);
      menu.append(el2("div", "foot", "Connectors, budgets & activity live in the Switchboard toolbar panel."));
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
      window.removeEventListener(initEvent, onLateInit);
      host.remove();
    }
  };
}

// ../../../../../packages/sdk/dist/index.js
var warnedStorageKeys = /* @__PURE__ */ new Set();
function warnBadStorageKey(key) {
  if (isValidStorageKey(key) || warnedStorageKeys.has(key))
    return;
  warnedStorageKeys.add(key);
  const suggestion = String(key).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^[^A-Za-z0-9]+/, "") || "key";
  console.warn(`[relay.storage] invalid key ${JSON.stringify(key)} \u2014 this write/read WILL be rejected by the daemon and silently do nothing.
  Keys map 1:1 to files (<key>.json) in this origin's folder, so they must match ${STORAGE_KEY_RE}.
  ":" is not allowed (illegal on NTFS; "a:b" is Alternate Data Stream syntax on Windows). Try ${JSON.stringify(suggestion)}.`);
}
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
  /** The setup-ladder snapshot (reachable/paired/connected), answered by the EXTENSION from its
   *  own state — never the daemon — so it resolves fast (<1s) in every degraded state, including
   *  the ones where every other method would hang. Resolves null when the extension is too old to
   *  know `claude_health` (or its worker is unreachable): callers MUST treat null as "unknown"
   *  and fall back to probing permissions() exactly as before — that skew guard is load-bearing
   *  while store users run an older extension against newer app bundles. */
  health() {
    const answer = this.provider.request({ method: "claude_health" }).catch(() => null);
    const timer = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
    return Promise.race([answer, timer]);
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
    const k = (key) => {
      warnBadStorageKey(key);
      return key;
    };
    return {
      get: (key) => req({ op: "get", key: k(key) }).then((r) => r.value ?? null),
      set: (key, value) => req({ op: "set", key: k(key), value }).then(() => void 0),
      delete: (key) => req({ op: "delete", key: k(key) }).then((r) => r.ok),
      list: () => req({ op: "list" }).then((r) => r.keys ?? []),
      info: () => req({ op: "info" }).then((r) => r.info),
      /** Point this app's store at a real folder (triggers a path-consent click). */
      bind: (path) => req({ op: "bind", path }).then((r) => r.info),
      /** Open a NATIVE folder chooser on the daemon's machine (macOS today). The user picking a
       *  folder in an OS dialog that names this origin IS the path consent, so a successful pick
       *  comes back already bound. Resolves undefined on cancel or when no native picker exists —
       *  keep a typed-path `bind` as the fallback UI. */
      pick: (reason) => req({ op: "pick", reason }).then((r) => r.info).catch(() => void 0)
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
      pick: () => req({ op: "pick" }).then((r) => r.context ?? null),
      /** Read ONE context listed via `list()` in full, and make it this app's selection. Needs the
       *  kind granted at connect (ScopeRequest.contextKinds) — powers in-app brand dropdowns. */
      use: (id) => req({ op: "use", id }).then((r) => r.context ?? null)
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

// src/kit/storekey.js
function migrateLocalKey(oldKey, newKey) {
  if (oldKey === newKey) return;
  try {
    if (localStorage.getItem(newKey) !== null) {
      localStorage.removeItem(oldKey);
      return;
    }
    const old = localStorage.getItem(oldKey);
    if (old === null) return;
    localStorage.setItem(newKey, old);
    localStorage.removeItem(oldKey);
  } catch {
  }
}

// src/imagegen.js
var $ = (id) => document.getElementById(id);
var INSTALL_URL = "https://thelastprompt.ai/switchboard/";
var STORE_KEY = "prism-workspace";
migrateLocalKey("prism:workspace", STORE_KEY);
var CONNECTOR = "mcp__claude_ai_Higgsfield__*";
var GEN = "generate_image";
var URL_RE = /(https?:\/\/[^\s"')]+\.(?:png|jpe?g|webp))|"(?:rawUrl|url|minUrl)"\s*:\s*"([^"]+)"/i;
var ASPECTS = ["1:1", "16:9", "9:16"];
var MAX_SHOTS = 24;
var MAX_CONCEPTS = 18;
var DEFAULT_STYLES = ["editorial minimal", "vibrant maximal", "matte product studio", "lifestyle candid", "bold graphic", "soft pastel"];
var STARTERS = [
  { label: "product hero", prompt: "A single hero product on a sculpted stone pedestal, soft directional window light, shallow depth of field, muted earthy backdrop, premium studio photography" },
  { label: "lifestyle candid", prompt: "Candid smartphone-style photo of someone using a beautifully designed product at a sunlit kitchen table, morning light, authentic and unstaged" },
  { label: "editorial flat-lay", prompt: "Overhead editorial flat-lay of a product with its raw ingredients arranged on textured linen, natural daylight, magazine styling" },
  { label: "bold graphic", prompt: "A product floating against a bold single-color backdrop with a hard geometric shadow, high-contrast studio strobe, art-directed minimalism" },
  { label: "moody macro", prompt: "Extreme macro shot of a product's surface texture, dramatic low-key lighting, glistening detail, cinematic mood" }
];
var relay = null;
var notInstalled = false;
var booted = false;
var brand = null;
var brandId = null;
var brandOptions = [];
var drafting = false;
var autoDraftKey = null;
var lastDraftOpts = null;
var referenceDataUrl = null;
var state = {
  brandName: null,
  // which brand the concepts were drafted for
  product: "",
  style: "",
  aspect: "1:1",
  extra: "",
  // the one free-text knob
  concepts: [],
  // [{title, product, style, imagePrompt, aspect, recommended}]
  shots: [],
  // [{url, prompt, aspect, ts}] — newest first
  savedAt: 0
};
var el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
var str = (v, fb) => typeof v === "string" && v.trim() ? v.trim() : fb;
var resultText = (d) => (d.result?.content ?? []).map((c) => c.text ?? "").join("");
var extractUrl = (t) => {
  const m = (t || "").match(URL_RE);
  return m ? m[1] || m[2] || m[0] : null;
};
function save() {
  state.savedAt = Date.now();
  const payload = JSON.stringify(state);
  try {
    localStorage.setItem(STORE_KEY, payload);
  } catch {
  }
  if (relay && relay.storage && typeof relay.storage.set === "function") {
    try {
      void relay.storage.set(STORE_KEY, payload).catch(() => {
      });
    } catch {
    }
  }
}
function coerceState() {
  if (typeof state.brandName !== "string") state.brandName = null;
  if (typeof state.product !== "string") state.product = "";
  if (typeof state.style !== "string") state.style = "";
  if (!ASPECTS.includes(state.aspect)) state.aspect = "1:1";
  if (typeof state.extra !== "string") state.extra = "";
  if (typeof state.savedAt !== "number") state.savedAt = 0;
  state.concepts = (Array.isArray(state.concepts) ? state.concepts : []).map(coerceConcept).filter(Boolean).slice(0, MAX_CONCEPTS);
  state.shots = (Array.isArray(state.shots) ? state.shots : []).filter((s) => s && typeof s === "object" && typeof s.url === "string" && s.url).map((s) => ({ url: s.url, prompt: str(s.prompt, ""), aspect: ASPECTS.includes(s.aspect) ? s.aspect : "1:1", ts: typeof s.ts === "number" ? s.ts : 0 })).slice(0, MAX_SHOTS);
  if (state.concepts.length && !state.concepts.some((c) => c.recommended)) state.concepts[0].recommended = true;
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && typeof s === "object") Object.assign(state, s);
  } catch {
  }
  coerceState();
}
load();
async function syncFromRelayStorage() {
  if (!relay || !relay.storage || typeof relay.storage.get !== "function") return;
  let raw = null, parsed = null;
  try {
    raw = await relay.storage.get(STORE_KEY);
    parsed = JSON.parse(raw);
  } catch {
    return;
  }
  if (!parsed || typeof parsed !== "object") return;
  if ((parsed.savedAt || 0) <= (state.savedAt || 0)) return;
  Object.assign(state, parsed);
  coerceState();
  try {
    localStorage.setItem(STORE_KEY, raw);
  } catch {
  }
  $("prompt").value = state.extra;
  $("aspect").value = state.aspect;
  renderGrid();
  renderConcepts();
}
function normalizeBrand(ctx) {
  const d = ctx && ctx.data || {};
  const arr = (v) => Array.isArray(v) ? v.filter(Boolean).map(String) : [];
  const products = arr(d.products).length ? arr(d.products) : arr(d.range);
  const styles = arr(d.styles).length ? arr(d.styles) : DEFAULT_STYLES;
  return {
    name: str(ctx && ctx.name, str(d.name, "Brand")),
    voice: String(d.voice || d.vibe || d.positioning || "").trim(),
    palette: arr(d.palette).slice(0, 6),
    products,
    styles
  };
}
async function loadBrandCtx() {
  brand = null;
  brandId = null;
  brandOptions = [];
  if (!relay || !relay.context || typeof relay.context.active !== "function") return;
  try {
    const ctx = await relay.context.active();
    if (ctx) {
      brand = normalizeBrand(ctx);
      brandId = ctx.id || null;
    }
  } catch {
  }
  try {
    const metas = await relay.context.list();
    brandOptions = (metas || []).filter((m) => (m.kind || "").toLowerCase() === "brand").map((m) => ({ id: m.id, name: m.name }));
  } catch {
  }
  if (!brand && brandOptions.length && typeof relay.context.use === "function") {
    try {
      const ctx = await relay.context.use(brandOptions[0].id);
      if (ctx) {
        brand = normalizeBrand(ctx);
        brandId = ctx.id || brandOptions[0].id;
      }
    } catch {
    }
  }
}
async function boot(r) {
  if (booted) return;
  booted = true;
  relay = r;
  notInstalled = false;
  await syncFromRelayStorage();
  renderGrid();
  renderConcepts();
  await loadBrandCtx();
  applyBrandUI();
  reflect();
  maybeAutoDraft();
}
mountConnect($("chip-dock"), {
  scope: {
    reason: "Prism \u2014 draft shot concepts from your brand and render them with your Higgsfield",
    tools: [CONNECTOR],
    contextKinds: ["brand"]
  },
  context: "single",
  installUrl: INSTALL_URL,
  onConnect: (r) => {
    void boot(r);
  },
  onDisconnect: () => {
    relay = null;
    booted = false;
    brand = null;
    brandId = null;
    brandOptions = [];
    autoDraftKey = null;
    applyBrandUI();
    reflect();
    flashHint("disconnected \u2014 reconnect with the chip to keep rendering");
  },
  // The chip's own "Switch" menu runs context.pick() itself — reflect the new brand in-page,
  // clear concepts that belong to the old one, and re-fire the proactive batch (adforge idiom).
  onProjectChange: async (project) => {
    if (!relay) return;
    const prev = brand ? brand.name : null;
    if (project) {
      brand = normalizeBrand(project);
      brandId = project.id || null;
    } else await loadBrandCtx();
    applyBrandUI();
    if ((brand ? brand.name : null) !== prev) {
      autoDraftKey = null;
      clearConcepts();
    }
    reflect();
    maybeAutoDraft();
  }
});
(async () => {
  const r = await whenRelayReady(2e3, { installUrl: INSTALL_URL });
  if (r && "connect" in r) {
    const grant = await r.permissions().catch(() => null);
    if (grant) {
      await boot(r);
      return;
    }
  } else {
    notInstalled = true;
  }
  reflect();
})();
function renderBrandSel() {
  const sel = $("brandSel");
  const has = brandOptions.length > 0 || !!brand;
  $("brandSelField").hidden = !has;
  sel.textContent = "";
  sel.append(new Option("no brand \u2014 freeform", ""));
  for (const b of brandOptions) sel.append(new Option(b.name, b.id));
  if (brandId && ![...sel.options].some((o) => o.value === brandId)) sel.append(new Option(brand.name, brandId));
  sel.value = brandId || "";
}
function applyBrandUI() {
  $("brandbar").hidden = !relay;
  renderBrandSel();
  const chip = $("bchip");
  if (brand) {
    chip.hidden = false;
    chip.textContent = "";
    chip.append(el("span", "dot"), el("span", null, brand.name));
    for (const c of brand.palette.slice(0, 4)) {
      const sw = el("span", "sw");
      sw.style.background = c;
      sw.title = c;
      chip.append(sw);
    }
    $("brandFields").hidden = false;
    fillSelect($("product"), brand.products, brand.products.length ? null : "\u2014 brand has no products \u2014");
    fillSelect($("style"), brand.styles);
    setSelVal($("product"), state.product);
    setSelVal($("style"), state.style);
    $("prompt").placeholder = "Add art direction (optional) \u2014 e.g. on a marble surface, morning light";
    $("note").textContent = `On-brand for ${brand.name} \u2014 concepts draft themselves; every render is a per-action consent on your Higgsfield.`;
  } else {
    chip.hidden = true;
    $("brandFields").hidden = true;
    $("prompt").placeholder = "Describe the image \u2014 subject, setting, lighting\u2026";
    if (relay) $("note").textContent = "Freeform mode \u2014 describe a shot (or hit a starter below), then Generate. Lend Prism a brand to unlock auto-drafted concepts.";
  }
  renderStarters();
  $("loadBrand").hidden = !(relay && !brandOptions.length);
}
function fillSelect(sel, items, emptyLabel) {
  sel.textContent = "";
  if (!items.length && emptyLabel) {
    sel.append(new Option(emptyLabel, ""));
    sel.disabled = true;
    return;
  }
  sel.disabled = false;
  for (const it of items) sel.append(new Option(it, it));
}
function setSelVal(sel, v) {
  if (!v) return;
  for (const o of sel.options) if (o.value.toLowerCase() === String(v).toLowerCase()) {
    sel.value = o.value;
    return;
  }
}
function showBrandErr(msg) {
  const e = $("branderr");
  e.hidden = false;
  e.textContent = msg;
  clearTimeout(showBrandErr.t);
  showBrandErr.t = setTimeout(() => {
    e.hidden = true;
  }, 6e3);
}
$("brandSel").addEventListener("change", async () => {
  if (!relay) return;
  const sel = $("brandSel");
  const prevId = brandId || "";
  const want = sel.value;
  if (want === prevId) return;
  if (!want) {
    brand = null;
    brandId = null;
    autoDraftKey = null;
    clearConcepts();
    applyBrandUI();
    reflect();
    maybeAutoDraft();
    return;
  }
  sel.disabled = true;
  try {
    const ctx = await relay.context.use(want);
    if (!ctx) throw new Error("that context came back empty");
    brand = normalizeBrand(ctx);
    brandId = ctx.id || want;
    autoDraftKey = null;
    clearConcepts();
    applyBrandUI();
    reflect();
    maybeAutoDraft();
  } catch (err) {
    sel.value = prevId;
    showBrandErr("Couldn't load that brand: " + (err?.message || err));
  } finally {
    sel.disabled = false;
  }
});
$("loadBrand").addEventListener("click", async () => {
  if (!relay) return;
  const b = $("loadBrand");
  const was = b.textContent;
  b.textContent = "choosing in Switchboard\u2026";
  b.disabled = true;
  try {
    const ctx = await relay.context.pick();
    if (ctx) {
      const prev = brand ? brand.name : null;
      brand = normalizeBrand(ctx);
      brandId = ctx.id || null;
      if (brand.name !== prev) {
        autoDraftKey = null;
        clearConcepts();
      }
      applyBrandUI();
      maybeAutoDraft();
    }
  } catch (err) {
    showBrandErr("Brand pick failed: " + (err?.message || err));
  } finally {
    b.textContent = was;
    b.disabled = false;
    reflect();
  }
});
function coerceConcept(c) {
  if (!c || typeof c !== "object") return null;
  const title = str(c.title, "");
  const imagePrompt = str(c.imagePrompt, "");
  if (!title || !imagePrompt) return null;
  return {
    title,
    product: str(c.product, ""),
    style: str(c.style, ""),
    imagePrompt,
    aspect: ASPECTS.includes(c.aspect) ? c.aspect : "1:1",
    recommended: !!c.recommended
  };
}
function buildConceptPrompt(b, priorTitles) {
  return [
    "You are Prism, a senior art director drafting photography and render concepts for a brand's image library.",
    "Work ONLY from this brand context \u2014 do NOT call any tools:",
    `Brand: ${b.name}`,
    b.voice ? `Voice / vibe: ${b.voice}` : "",
    b.palette.length ? `Palette \u2014 fold these into the art direction: ${b.palette.join(", ")}` : "",
    b.products.length ? `Products: ${b.products.join("; ")}` : "",
    b.styles.length ? `House design styles: ${b.styles.join("; ")}` : "",
    "Respond with ONLY a JSON object \u2014 no prose before or after, no markdown fences \u2014 in exactly this shape:",
    `{"concepts":[exactly 6 items, each {"title":string (2-4 word shot name),"product":string (the product featured, from the brand's range, or "" for a brand-wide shot),"style":string (the design style used, ideally one of the house styles),"imagePrompt":string (a vivid, complete text-to-image prompt: subject, setting, lighting, camera, mood \u2014 no text, no logos, no watermarks in the image),"aspect":"1:1"|"16:9"|"9:16","recommended":boolean}]}`,
    'Exactly ONE concept must have "recommended": true \u2014 the shot you would render first.',
    priorTitles && priorTitles.length ? `These shot titles already exist \u2014 produce six NEW concepts with different titles and directions: ${priorTitles.join(", ")}.` : ""
  ].filter(Boolean).join("\n");
}
function parseConcepts(raw) {
  try {
    const cleaned = String(raw).replace(/```(?:json)?/gi, "");
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const data = JSON.parse(m[0]);
    const list = (Array.isArray(data.concepts) ? data.concepts : []).map(coerceConcept).filter(Boolean).slice(0, 6);
    if (list.length < 3) return null;
    const recAt = list.findIndex((c) => c.recommended);
    list.forEach((c, i) => {
      c.recommended = i === (recAt === -1 ? 0 : recAt);
    });
    return list;
  } catch {
    return null;
  }
}
function clearConcepts() {
  state.concepts = [];
  state.brandName = brand ? brand.name : null;
  save();
  renderConcepts();
}
function showDraftErr(msg) {
  $("drafterr").hidden = false;
  $("drafterr-msg").textContent = msg;
}
function hideDraftErr() {
  $("drafterr").hidden = true;
}
$("draft-retry").addEventListener("click", () => {
  hideDraftErr();
  void draftConcepts(lastDraftOpts || {});
});
async function draftConcepts(opts = {}) {
  if (!relay || drafting || !brand) return;
  const forName = brand.name;
  lastDraftOpts = opts;
  drafting = true;
  hideDraftErr();
  $("concepts-sec").hidden = false;
  $("draftline").hidden = false;
  $("draft-msg").textContent = "drafting shot concepts on your Claude\u2026 0.0 kb";
  reflect();
  let acc = "";
  try {
    const prior = opts.more ? state.concepts.map((c) => c.title) : null;
    for await (const d of relay.stream({ prompt: buildConceptPrompt(brand, prior), agentic: true })) {
      if (d.type === "text") {
        acc += d.text;
        $("draft-msg").textContent = "drafting shot concepts on your Claude\u2026 " + (acc.length / 1024).toFixed(1) + " kb";
      } else if (d.type === "error") {
        throw new Error(d.error?.message || "stream error");
      }
    }
    const list = parseConcepts(acc);
    if (!list) throw new Error("Your Claude returned malformed concepts \u2014 Retry usually lands clean on the second pass.");
    if (!brand || brand.name !== forName) return;
    if (opts.more && state.concepts.length) {
      for (const c of list) c.recommended = false;
      state.concepts = state.concepts.concat(list);
      if (state.concepts.length > MAX_CONCEPTS) state.concepts = state.concepts.slice(state.concepts.length - MAX_CONCEPTS);
      if (!state.concepts.some((c) => c.recommended)) state.concepts[0].recommended = true;
    } else {
      state.concepts = list;
    }
    state.brandName = brand.name;
    save();
    renderConcepts();
    prefillFromRecommended(!opts.more);
  } catch (err) {
    showDraftErr(String(err?.message || err));
  } finally {
    drafting = false;
    $("draftline").hidden = true;
    reflect();
    if (brand && brand.name !== forName) maybeAutoDraft();
  }
}
$("more").addEventListener("click", () => {
  void draftConcepts({ more: true });
});
function maybeAutoDraft() {
  if (!relay || drafting) return;
  if (!brand) {
    renderStarters();
    if (!state.extra.trim() && !$("prompt").value.trim()) {
      $("prompt").value = STARTERS[0].prompt;
      state.extra = STARTERS[0].prompt;
      save();
    }
    return;
  }
  if (autoDraftKey === brand.name) return;
  autoDraftKey = brand.name;
  if (state.brandName === brand.name && state.concepts.length) {
    renderConcepts();
    prefillFromRecommended(false);
    return;
  }
  if (state.concepts.length) clearConcepts();
  void draftConcepts({});
}
function conceptRenderPrompt(c) {
  const bits = [c.imagePrompt];
  if (brand) {
    if (brand.palette.length) bits.push(`Brand palette: ${brand.palette.join(", ")}`);
    if (brand.voice) bits.push(`Brand mood: ${brand.voice}`);
  }
  bits.push("No text, no lettering, no logos, no watermarks");
  return bits.join(". ");
}
function markChosenCard(card) {
  const mount = $("concepts");
  mount.querySelectorAll(".concept.chosen").forEach((n) => {
    n.classList.remove("chosen");
    n.querySelector(".cby")?.remove();
  });
  if (!card) return;
  card.classList.add("chosen");
  card.append(el("div", "cby", "chosen by you"));
}
function renderConcepts() {
  const mount = $("concepts");
  mount.textContent = "";
  state.concepts.forEach((c) => {
    const card = el("div", "concept" + (c.recommended ? " rec" : ""));
    const top = el("div", "ctop");
    if (c.recommended) top.append(el("span", "recflag", "\u2605 RECOMMENDED"));
    if (c.style) top.append(el("span", "cchip", c.style));
    top.append(el("span", "cchip dim", c.aspect));
    const prev = el("div", "cprev", c.imagePrompt);
    prev.title = c.imagePrompt;
    const foot = el("div", "cfoot");
    const btn = el("button", "rbtn", "Render image");
    btn.type = "button";
    btn.addEventListener("click", () => {
      markChosenCard(card);
      void renderShot(conceptRenderPrompt(c), c.aspect, null, btn);
    });
    const use = el("button", "cuse", "edit in studio");
    use.type = "button";
    use.addEventListener("click", () => {
      markChosenCard(card);
      $("prompt").value = c.imagePrompt;
      state.extra = c.imagePrompt;
      $("aspect").value = c.aspect;
      state.aspect = c.aspect;
      save();
      $("studio-sec").scrollIntoView({ behavior: "smooth", block: "center" });
      $("prompt").focus();
    });
    foot.append(btn, use);
    card.append(top, el("div", "ctitle", c.title), prev, foot);
    mount.append(card);
  });
  if (state.concepts.length) mount.append(ownShotCard());
  $("concepts-sec").hidden = !(state.concepts.length || drafting || relay && brand);
  reflect();
}
function ownShotCard() {
  const card = el("div", "escape");
  card.append(el("div", "et", "None of these"));
  card.append(el("div", "eh", "Describe the shot you'd take instead \u2014 it goes straight into the studio prompt below and renders on the same path."));
  const row = el("div", "erow");
  const input = el("input");
  input.type = "text";
  input.placeholder = "e.g. the pack half-open on a wet slate counter, hard side light\u2026";
  const go = el("button", "rbtn", "Use mine");
  go.type = "button";
  const submit = () => {
    const v = input.value.trim();
    if (!v) {
      input.focus();
      return;
    }
    markChosenCard(null);
    $("prompt").value = v;
    state.extra = v;
    save();
    input.value = "";
    $("studio-sec").scrollIntoView({ behavior: "smooth", block: "center" });
    $("prompt").focus();
  };
  go.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  });
  row.append(input, go);
  card.append(row);
  return card;
}
function prefillFromRecommended(fresh) {
  const rec = state.concepts.find((c) => c.recommended);
  if (!rec) return;
  if (!state.product) setSelVal($("product"), rec.product);
  if (!state.style) setSelVal($("style"), rec.style);
  if (fresh) {
    $("aspect").value = rec.aspect;
    state.aspect = rec.aspect;
    save();
  }
  $("prompt").placeholder = "e.g. " + rec.imagePrompt.slice(0, 110) + (rec.imagePrompt.length > 110 ? "\u2026" : "");
}
function renderStarters() {
  const mount = $("starters");
  mount.textContent = "";
  for (const s of STARTERS) {
    const b = el("button", "starter", s.label);
    b.type = "button";
    b.addEventListener("click", () => {
      $("prompt").value = s.prompt;
      state.extra = s.prompt;
      save();
      $("prompt").focus();
    });
    mount.append(b);
  }
  mount.hidden = !!brand;
}
$("prompt").addEventListener("input", () => {
  state.extra = $("prompt").value;
  save();
});
$("aspect").addEventListener("change", () => {
  state.aspect = $("aspect").value;
  save();
});
$("product").addEventListener("change", () => {
  state.product = $("product").value;
  save();
});
$("style").addEventListener("change", () => {
  state.style = $("style").value;
  save();
});
function buildPrompt() {
  const extra = $("prompt").value.trim();
  if (!brand) return extra;
  const product = $("product").value.trim();
  const style = $("style").value.trim();
  return [
    product ? `${product} for ${brand.name}` : `${brand.name} brand image`,
    style ? `${style} style` : "",
    brand.voice ? `brand voice: ${brand.voice}` : "",
    brand.palette.length ? `brand palette: ${brand.palette.join(", ")}` : "",
    extra,
    "no text, no logos, no watermarks"
  ].filter(Boolean).join(". ");
}
$("go").addEventListener("click", () => {
  const p = buildPrompt();
  if (!p) {
    $("prompt").focus();
    flashHint("describe the image first \u2014 one line is enough");
    return;
  }
  void renderShot(p, $("aspect").value, referenceDataUrl, $("go"));
});
function renderRef() {
  const ref = $("ref");
  const input = $("refInput");
  ref.textContent = "";
  ref.append(input);
  const b = el("button", "refbtn", referenceDataUrl ? "swap reference" : "\uFF0B reference image");
  b.type = "button";
  b.addEventListener("click", () => input.click());
  ref.append(b);
  if (referenceDataUrl) {
    const thumb = el("span", "refthumb");
    const img = el("img");
    img.src = referenceDataUrl;
    img.alt = "reference";
    const x = el("button", "x", "\xD7");
    x.type = "button";
    x.title = "Remove reference";
    x.addEventListener("click", () => {
      referenceDataUrl = null;
      renderRef();
    });
    thumb.append(img, x);
    ref.append(thumb);
  }
}
$("refInput").addEventListener("change", () => {
  const file = $("refInput").files?.[0];
  $("refInput").value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    referenceDataUrl = String(reader.result);
    renderRef();
  };
  reader.onerror = () => flashHint("couldn't read that file \u2014 try another image");
  reader.readAsDataURL(file);
});
renderRef();
async function downscale(dataUrl, max = 1024) {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("The reference image couldn't be decoded \u2014 try a different file."));
    i.src = dataUrl;
  });
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d").drawImage(img, 0, 0, w, h);
  return c.toDataURL("image/png");
}
function showGrid() {
  $("grid-sec").hidden = $("grid").children.length === 0;
}
function renderGrid() {
  const g = $("grid");
  g.textContent = "";
  for (const s of state.shots) g.append(shotCard(s));
  showGrid();
}
function dropShot(s) {
  state.shots = state.shots.filter((o) => !(o.ts === s.ts && o.url === s.url));
  save();
}
function shotCard(s) {
  const card = el("div", "shot");
  const x = el("button", "x", "\xD7");
  x.type = "button";
  x.title = "Remove from workspace";
  x.addEventListener("click", () => {
    dropShot(s);
    card.remove();
    showGrid();
  });
  const img = el("img");
  img.src = s.url;
  img.alt = s.prompt;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    dropShot(s);
    failCard(card, "The image link expired.", () => {
      card.remove();
      showGrid();
      void renderShot(s.prompt, s.aspect, null, null);
    });
  });
  const cap = el("div", "cap", (s.prompt || "untitled shot").slice(0, 90) + ((s.prompt || "").length > 90 ? "\u2026" : "") + " \xB7 " + s.aspect);
  cap.title = s.prompt;
  card.append(x, img, cap);
  return card;
}
function status(card, text) {
  const c = card.querySelector(".cap");
  if (c) c.textContent = text;
  else card.append(el("div", "cap", text));
}
function failCard(card, msg, retryFn) {
  card.className = "shot err";
  card.textContent = "";
  const x = el("button", "x", "\xD7");
  x.type = "button";
  x.title = "Dismiss";
  x.addEventListener("click", () => {
    card.remove();
    showGrid();
  });
  const body = el("div", "errbody");
  body.append(el("div", "emsg", msg));
  if (retryFn) {
    const r = el("button", "mini", "Retry");
    r.type = "button";
    r.addEventListener("click", retryFn);
    body.append(r);
  }
  card.append(x, body);
}
async function renderShot(promptText, aspect, ref, btn) {
  if (!relay) {
    flashHint("connect Switchboard (top right) to render");
    return;
  }
  const p = String(promptText || "").trim();
  if (!p) {
    $("prompt").focus();
    flashHint("describe the image first \u2014 one line is enough");
    return;
  }
  const a = ASPECTS.includes(aspect) ? aspect : "1:1";
  const card = el("div", "shot load");
  card.append(el("div", "scan"), el("div", "cap", ref ? "preparing reference\u2026" : "queued\u2026"));
  $("grid").prepend(card);
  showGrid();
  let was = null;
  if (btn) {
    was = btn.textContent;
    btn.dataset.busy = "1";
    btn.disabled = true;
    btn.textContent = "Rendering\u2026";
  }
  let settled = false;
  const retry = () => {
    card.remove();
    showGrid();
    void renderShot(p, a, ref, btn && btn.isConnected ? btn : null);
  };
  try {
    let attachments;
    let instruction;
    if (ref) {
      const small = await downscale(ref);
      attachments = [{ handle: "ref", filename: "ref.png", contentType: "image/png", dataUrl: small }];
      instruction = `Generate an image of: "${p}", aspect_ratio "${a}", guided by a reference image.
The reference is attached as relay handle "ref". To use it, do EXACTLY:
1) Call Higgsfield media_upload({ filename: "ref.png", content_type: "image/png" }) to get a presigned upload URL.
2) Call relay put_blob({ handle: "ref", url: <that upload URL> }) to upload the bytes (do NOT use bash/curl).
3) Call Higgsfield media_confirm as instructed by the upload result to get a media_id.
4) Call Higgsfield ${GEN} with the prompt and that media_id as a reference in medias.
5) Poll job status until done, then reply with ONLY the final image URL on its own line.`;
    } else {
      instruction = `Use the Higgsfield ${GEN} tool to generate an image of: "${p}", aspect_ratio "${a}". Wait for it to finish (poll the job status if needed), then reply with ONLY the final image URL on its own line.`;
    }
    status(card, "generating\u2026");
    let url = null, acc = "";
    for await (const d of relay.stream({ prompt: instruction, agentic: true, attachments })) {
      if (d.type === "tool_proposed") {
        const n = d.call.name;
        if (n.endsWith("media_upload") || n.endsWith("put_blob") || n.endsWith("media_confirm")) status(card, "uploading reference\u2026");
        else if (n.endsWith(GEN)) status(card, "generating (approve if asked)\u2026");
        else if (/status|display|wait/.test(n)) status(card, "rendering\u2026");
      } else if (d.type === "tool_result") {
        if (d.result?.ok) {
          const u = extractUrl(resultText(d));
          if (u) url = u;
        } else status(card, "blocked: " + (d.result?.error?.message || d.call.name));
      } else if (d.type === "text") {
        acc += d.text;
      } else if (d.type === "error") {
        throw new Error(d.error?.message || "The stream was blocked.");
      }
    }
    url = url || extractUrl(acc);
    if (!url) throw new Error("No image came back \u2014 Retry usually lands on the second pass.");
    const entry = { url, prompt: p, aspect: a, ts: Date.now() };
    state.shots.unshift(entry);
    if (state.shots.length > MAX_SHOTS) state.shots.length = MAX_SHOTS;
    save();
    card.replaceWith(shotCard(entry));
    settled = true;
  } catch (err) {
    failCard(card, String(err?.message || err), retry);
    settled = true;
  } finally {
    if (btn) {
      delete btn.dataset.busy;
      btn.textContent = was;
      btn.disabled = false;
    }
    if (!settled) failCard(card, "The render stopped unexpectedly.", retry);
    reflect();
  }
}
function reflect() {
  const on = !!relay;
  const go = $("go");
  if (!go.dataset.busy) {
    go.disabled = !on;
    go.textContent = "Generate";
  }
  $("more").disabled = !on || drafting || !brand;
  document.querySelectorAll(".rbtn").forEach((b) => {
    if (!b.dataset.busy) b.disabled = !on;
  });
  if (!on) {
    $("note").textContent = notInstalled ? "Switchboard isn't installed \u2014 get it via the chip (top right); the studio wakes up the moment you connect." : "Connect Switchboard (top right) \u2014 Prism restores your grid and drafts shot concepts from your brand with zero clicks.";
  }
}
var hintTimer = null;
function flashHint(msg) {
  const h = $("hintline");
  h.textContent = msg;
  h.hidden = false;
  h.classList.remove("on");
  void h.offsetWidth;
  h.classList.add("on");
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    h.hidden = true;
  }, 4e3);
}
$("prompt").value = state.extra;
$("aspect").value = state.aspect;
renderGrid();
renderConcepts();
renderStarters();
reflect();
//# sourceMappingURL=imagegen.js.map
