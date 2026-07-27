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
  let state = { kind: "booting" };
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
      state = { kind: "not-installed", installUrl };
      return render();
    }
    relay2 = r;
    subscribe(r);
    const h = await r.health();
    if (destroyed || my !== seq)
      return;
    if (h && !h.reachable) {
      state = { kind: "unreachable", appMissing: h.installedHere === false };
      emitTransition(false);
      return render();
    }
    if (h && !h.paired) {
      state = { kind: "unpaired" };
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
        state = rung;
        emitTransition(false);
        return render();
      }
      state = { kind: "disconnected", relay: r };
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
    state = { kind: "connected", relay: r, user, project };
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
      if (state.kind === "disconnected") {
        const rung = rungFromError(err);
        if (rung) {
          state = rung;
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
    if (state.kind === "booting")
      return;
    if (state.kind === "not-installed") {
      const url = state.installUrl;
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
    if (state.kind === "unreachable") {
      const appMissing = state.appMissing === true;
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
    if (state.kind === "unpaired") {
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
    if (state.kind === "disconnected") {
      const b = el2("button", "btn connect");
      b.append(el2("span", "glyph"), el2("span", void 0, "Connect Switchboard"));
      b.onclick = doConnect;
      mount.append(b);
      return;
    }
    const { user, project } = state;
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

// src/kit/ui.js
var el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
var str = (s) => String(s ?? "").trim();
var STYLE_ID = "relay-kit-ui";
var ACCENT = "var(--accent, var(--lime, #C8F250))";
var ACCENT_SOFT = "var(--accent-soft, var(--lime-soft, #232B0D))";
var CSS = `
/* zero-specificity base: only applies where the shell styles nothing */
:where(.opts) { display: flex; flex-direction: column; gap: 8px; }
:where(.opt) { position: relative; border: 1px solid var(--edge, #262C38); background: var(--inset, #070809); border-radius: 14px; padding: 13px 14px; cursor: pointer; transition: border-color .15s, background .15s; }
:where(.opt:hover) { border-color: var(--edge-soft, #1C212B); }
:where(.opt.sel) { border-color: ${ACCENT}; background: color-mix(in srgb, ${ACCENT_SOFT} 55%, var(--inset, #070809)); }
:where(.opt .check) { position: absolute; right: 11px; top: 11px; width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--edge, #262C38); display: grid; place-items: center; color: transparent; font: 700 11px/1 var(--sans, sans-serif); }
:where(.opt.sel .check) { border-color: ${ACCENT}; background: ${ACCENT}; color: var(--page, #0A0C10); }
:where(.opt .rec) { display: inline-block; font: 500 9px/1 var(--mono, monospace); letter-spacing: .1em; text-transform: uppercase; border-radius: 999px; padding: 3px 7px; margin-bottom: 7px; }
:where(.opt .o-label) { font: 600 13.5px/1.3 var(--display, sans-serif); color: var(--ink, #E8EDF4); padding-right: 22px; }
:where(.opt .o-text) { font: 400 13px/1.5 var(--sans, sans-serif); color: var(--ink-sec, #B4BECE); margin-top: 5px; white-space: pre-wrap; word-break: break-word; }
:where(.opt .o-img) { width: 100%; border-radius: 8px; border: 1px solid var(--edge, #262C38); display: block; margin-top: 8px; }
:where(.steer) { margin-top: 16px; display: flex; flex-direction: column; gap: 7px; }
:where(.steer .chips) { display: flex; flex-wrap: wrap; gap: 6px; }
:where(.steer .chip) { font: 500 11px/1 var(--sans, sans-serif); border: 1px solid var(--edge, #262C38); background: var(--panel, #12151C); color: var(--ink-sec, #B4BECE); border-radius: 999px; padding: 6px 10px; cursor: pointer; }
:where(.steer .row) { display: flex; gap: 8px; align-items: center; }
:where(.steer .box) { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; border: 1px solid var(--edge, #262C38); background: var(--panel, #12151C); border-radius: 10px; padding: 8px 11px; }
:where(.steer input) { flex: 1; min-width: 0; background: none; border: 0; outline: none; color: var(--ink, #E8EDF4); font: 400 12.5px/1.4 var(--sans, sans-serif); }
:where(.steer .send) { flex: none; font: 600 12px/1 var(--sans, sans-serif); background: ${ACCENT}; color: var(--page, #0A0C10); border: 0; border-radius: 9px; padding: 9px 12px; cursor: pointer; }

/* ---- kit modifiers: normal specificity, these MUST beat the shell ---- */
/* DRAFTED \u2014 a machine suggestion. Neutral ink on a hairline, never the brand accent (rule 5). */
.opt .rec.k-draft { color: var(--ink-dim, #99A3B7); background: transparent; border: 1px dashed var(--edge, #262C38); }
.opt.k-drafted { border-style: dashed; }
.opt.k-drafted:not(.sel) { background: var(--inset, #070809); }
/* CHOSEN \u2014 a human clicked. The shell's own .opt.sel accent rules do the painting; this only adds
   the receipt line, so "who decided this" is never a guess (rule 6). */
.opt .k-by { display: block; font: 500 9px/1 var(--mono, monospace); letter-spacing: .1em; text-transform: uppercase; color: var(--ink-faint, #6E7C90); margin-top: 8px; }
.opt.sel .k-by { color: ${ACCENT}; }
/* ESCAPE HATCH \u2014 the human's own answer. Reads as an option, never as one of the generated ones. */
.opt.k-esc { border-style: dashed; cursor: pointer; }
.opt.k-esc .o-label { color: var(--ink-sec, #B4BECE); }
.opt.k-esc .k-escrow { display: flex; gap: 8px; align-items: center; margin-top: 9px; }
.opt.k-esc .k-escrow input { flex: 1; min-width: 0; background: var(--inset, #070809); border: 1px solid var(--edge, #262C38); border-radius: 9px; color: var(--ink, #E8EDF4); font: 400 12.5px/1.4 var(--sans, sans-serif); padding: 9px 11px; outline: none; }
.opt.k-esc .k-escrow input:focus { border-color: color-mix(in srgb, ${ACCENT} 55%, var(--edge, #262C38)); }
.opt.k-esc .k-escrow .send { flex: none; font: 600 12px/1 var(--sans, sans-serif); background: ${ACCENT}; color: var(--page, #0A0C10); border: 0; border-radius: 9px; padding: 9px 12px; cursor: pointer; }
.opt.k-esc .k-escrow .send:disabled { opacity: .5; cursor: default; }
.opt.k-esc .k-escrow .ghost { flex: none; font: 500 12px/1 var(--sans, sans-serif); background: none; border: 1px solid var(--edge, #262C38); color: var(--ink-dim, #99A3B7); border-radius: 9px; padding: 9px 12px; cursor: pointer; }
`;
function ensureStyle() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = CSS;
  (document.head || document.documentElement).append(s);
}
function escapeHatch(opts) {
  ensureStyle();
  const o = opts || {};
  const label = o.label || "none of these \u2014 say what you'd do instead";
  const card2 = el("div", "opt k-esc");
  card2.append(el("div", "o-label", label));
  if (o.hint) card2.append(el("div", "o-text", o.hint));
  const row = el("div", "k-escrow");
  row.hidden = true;
  const input = el("input");
  input.type = "text";
  input.placeholder = o.placeholder || "describe what you'd do instead\u2026";
  if (o.prefill) input.value = o.prefill;
  const send = el("button", "send", o.sendLabel || "use this");
  send.type = "button";
  const cancel = el("button", "ghost", "cancel");
  cancel.type = "button";
  row.append(input, send, cancel);
  card2.append(row);
  const open = () => {
    if (!row.hidden) return;
    row.hidden = false;
    input.focus();
    input.select();
  };
  const close = () => {
    row.hidden = true;
  };
  card2.onclick = (e) => {
    if (e.target.closest(".k-escrow")) return;
    open();
  };
  card2.onkeydown = (e) => {
    if (e.target === card2 && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      open();
    }
  };
  card2.tabIndex = 0;
  let busy = false;
  const submit = () => {
    const text = str(input.value);
    if (!text || busy) return;
    const option = { id: "custom", label: text, text: "", custom: true };
    const out = typeof o.onSubmit === "function" ? o.onSubmit(text, option) : null;
    if (out && typeof out.then === "function") {
      busy = true;
      const was = send.textContent;
      send.disabled = true;
      send.textContent = "\u2026";
      out.finally(() => {
        busy = false;
        send.disabled = false;
        send.textContent = was;
        close();
      });
    } else {
      close();
    }
  };
  send.onclick = submit;
  cancel.onclick = close;
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };
  card2.open = open;
  card2.close = close;
  card2.value = () => str(input.value);
  return card2;
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

// src/adpulse.js
var $ = (id) => document.getElementById(id);
var INSTALL_URL = "https://thelastprompt.ai/switchboard/";
var STORE_KEY = "adpulse-v1";
migrateLocalKey("adpulse:v1", STORE_KEY);
var relay = null;
var notInstalled = false;
var brand = null;
var rows = null;
var rawCsv = "";
var srcLabel = "";
var origSource = "";
var savedAt = 0;
var report = null;
var reportFor = null;
var doing = null;
var analysing = false;
var runSeq = 0;
var pulling = false;
var pullSeq = 0;
var autoRan = false;
var csvSig = () => rawCsv.length + ":" + rawCsv.slice(0, 80);
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
  const cur = String(grid[0][col.spend] || "").match(/\(([A-Z]{3})\)/);
  setCurrency(cur ? cur[1] : "INR");
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
  origSource = source === "restored" ? origSource || "restored" : source;
  if (source !== "restored") savedAt = Date.now();
  hasAdset = col.adset !== -1;
  $("feed-err").hidden = true;
  renderTape();
  persist();
  reflect();
  syncStale();
}
var hasAdset = true;
var currency = "INR";
var curSym = "\u20B9";
function setCurrency(code) {
  currency = code || "INR";
  if (currency === "INR") {
    curSym = "\u20B9";
    return;
  }
  try {
    const part = new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).formatToParts(0).find((p) => p.type === "currency");
    curSym = part ? part.value : currency + " ";
  } catch {
    curSym = currency + " ";
  }
}
var fmtIN = (n, d = 0) => Number(n).toLocaleString(currency === "INR" ? "en-IN" : "en-US", { maximumFractionDigits: d });
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
    statCell("total spend", curSym + fmtIN(t.spend), rows[0].range || rows.length + " campaigns", ""),
    statCell("blended roas", t.blended.toFixed(2) + "\xD7", curSym + fmtIN(t.value) + " revenue", t.blended >= 3 ? "good" : t.blended >= 1 ? "hot" : "bad"),
    statCell("purchases", fmtIN(t.purch), t.purch > 0 ? curSym + fmtIN(t.spend / t.purch) + " blended CPA" : "no conversions", ""),
    statCell("worst cpa", t.worst && t.worst.purch > 0 ? curSym + fmtIN(t.worst.spend / t.worst.purch) : "\u221E", t.worst ? trunc(t.worst.name, 30) + (t.worst.purch === 0 ? " \xB7 0 purchases" : "") : "\u2014", "bad"),
    statCell("best campaign", t.best ? t.best.roas.toFixed(1) + "\xD7" : "\u2014", t.best ? trunc(t.best.name, 30) : "\u2014", "good")
  );
  const cols = [
    { h: "Campaign", k: "name", cls: (r) => "name" },
    ...hasAdset ? [{ h: "Ad set", k: "adset" }] : [],
    { h: "Spend " + curSym.trim(), k: "spend", n: 1, f: (v) => fmtIN(v) },
    { h: "Impr", k: "impr", n: 1, f: (v) => fmtIN(v) },
    { h: "Clicks", k: "clicks", n: 1, f: (v) => fmtIN(v) },
    { h: "CTR", k: "ctr", n: 1, f: (v) => v ? v.toFixed(2) + "%" : "\u2014" },
    { h: "CPC " + curSym.trim(), k: "cpc", n: 1, f: (v) => v ? v.toFixed(2) : "\u2014" },
    { h: "Purch", k: "purch", n: 1, f: (v) => fmtIN(v) },
    { h: "Value " + curSym.trim(), k: "value", n: 1, f: (v) => fmtIN(v) },
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
  renderTapeCaption();
  $("tape").hidden = false;
}
function renderTapeCaption() {
  const cap = $("tape-cap");
  cap.textContent = "";
  if (!rows) return;
  if (srcLabel === "sample") {
    const badge = document.createElement("span");
    badge.className = "samplebadge";
    badge.textContent = "sample";
    const b = document.createElement("b");
    b.textContent = "Verra Skincare (DTC) \u2014 not your data.";
    cap.append(badge, b, relay ? ` ${rows.length} campaigns parsed in this tab. You're connected \u2014 pull your live account above to replace it.` : ` ${rows.length} campaigns parsed in this tab. Connect Switchboard to pull your live account, or paste an export.`);
  } else {
    const b = document.createElement("b");
    b.textContent = srcLabel === "restored" ? "restored from your last session" : srcLabel === "live" ? "pulled live from your Ads Manager \u2014 via your own Meta connector" : "your export";
    let tail = ` \u2014 ${rows.length} campaigns parsed in this tab, all rows shown.`;
    if (srcLabel === "restored" && savedAt) {
      const h = Math.round((Date.now() - savedAt) / 36e5);
      tail = ` \u2014 ${rows.length} campaigns parsed in this tab, all rows shown \xB7 ${h < 1 ? "under an hour" : h + "h"} old.`;
    }
    cap.append(b, tail);
  }
}
var chipGesture = false;
$("chip-dock").addEventListener("click", () => {
  chipGesture = true;
}, true);
mountConnect($("chip-dock"), {
  scope: { reason: "diagnose your Meta ads performance", models: ["sonnet"], contextKinds: ["brand"] },
  installUrl: INSTALL_URL,
  onConnect: async (r) => {
    relay = r;
    reflect();
    await loadBrand();
    proactiveKickoff(chipGesture);
  },
  onDisconnect: () => {
    relay = null;
    brand = null;
    renderBrandLine();
    rebuildBrandChips();
    reflect();
  },
  onProjectChange: () => loadBrand()
  // chip-menu "Switch ▸" (or panel switch) re-reads the lent brand
});
(async () => {
  const r = await whenRelayReady(2e3, { installUrl: INSTALL_URL });
  if (r && "connect" in r) {
    const grant = await r.permissions().catch(() => null);
    if (grant) {
      relay = r;
      await loadBrand();
      proactiveKickoff(false);
    }
  } else if (r && r.installed === false) {
    notInstalled = true;
  }
  reflect();
})();
async function grantCoversCachedPrefix() {
  if (!relay) return false;
  let cached = null;
  try {
    cached = localStorage.getItem(PREFIX_KEY);
  } catch {
  }
  if (!cached) return false;
  const grant = await relay.permissions().catch(() => null);
  return !!grant?.tools?.some((t) => t.name === cached + "*" || String(t.name || "").startsWith(cached));
}
async function proactiveKickoff(viaFreshConnect) {
  if (autoRan || !relay || analysing || pulling) return;
  autoRan = true;
  const real = rows && rows.length && srcLabel !== "sample";
  if (real) {
    if (origSource === "live" && savedAt && Date.now() - savedAt > 24 * 36e5 && await grantCoversCachedPrefix()) {
      void pullLive();
      return;
    }
    const fresh = report && reportFor && reportFor.csvSig === csvSig() && reportFor.brand === (brand?.name ?? null);
    if (!fresh) void analyse();
    return;
  }
  const mayPull = viaFreshConnect || await grantCoversCachedPrefix();
  if (mayPull && await pullLive({ auto: true })) return;
  if (!rows || !rows.length) {
    $("csv-in").value = SAMPLE;
    ingest(SAMPLE, "sample");
  }
  if (rows && rows.length && !analysing && !pulling) await analyse();
}
function normalizeBrand(ctx) {
  const d = ctx && ctx.data || {};
  const arr = (v) => Array.isArray(v) ? v.filter(Boolean).map(String) : [];
  let palette = arr(d.palette).filter((c) => !/^\[object/i.test(c));
  if (!palette.length && Array.isArray(d.paletteRich))
    palette = d.paletteRich.map((s) => s && s.hex).filter(Boolean).map(String);
  return {
    name: ctx.name || d.name || "Brand",
    voice: String(d.voice || d.vibe || d.positioning || "").trim(),
    positioning: String(d.positioning || "").trim(),
    audience: String(d.audience || "").trim(),
    palette,
    products: arr(d.products).length ? arr(d.products) : arr(d.range)
  };
}
async function loadBrand() {
  if (!relay) return;
  try {
    let ctx = await relay.context.active();
    if (!ctx && typeof relay.context.list === "function" && typeof relay.context.use === "function") {
      const metas = await relay.context.list().catch(() => []);
      const bm = metas.find((m) => (m.kind || "").toLowerCase() === "brand");
      if (bm) ctx = await relay.context.use(bm.id).catch(() => null);
    }
    brand = ctx ? normalizeBrand(ctx) : null;
  } catch {
    brand = null;
  }
  renderBrandLine();
  rebuildBrandChips();
  reflect();
  if (report) renderReport();
}
function renderBrandLine() {
  const line = $("brand-line");
  const sw = $("brand-swatches");
  sw.textContent = "";
  if (!relay) {
    line.hidden = true;
    return;
  }
  line.hidden = false;
  const name = $("brand-name");
  if (brand) {
    $("brand-kicker").textContent = "diagnosing for";
    name.textContent = brand.name;
    name.classList.remove("dim");
    for (const c of brand.palette.slice(0, 4)) {
      const s = document.createElement("span");
      s.className = "sw";
      s.style.background = c;
      sw.append(s);
    }
    $("brand-switch").textContent = "switch";
  } else {
    $("brand-kicker").textContent = "brand context";
    name.textContent = "none lent \u2014 verdicts stay generic";
    name.classList.add("dim");
    $("brand-switch").textContent = "load a brand";
  }
}
$("brand-switch").addEventListener("click", async () => {
  if (!relay) return;
  const b = $("brand-switch");
  const prev = b.textContent;
  b.disabled = true;
  b.textContent = "choose in Switchboard\u2026";
  try {
    const ctx = await relay.context.pick();
    if (ctx) {
      brand = normalizeBrand(ctx);
      renderBrandLine();
      rebuildBrandChips();
      reflect();
      if (report) renderReport();
    } else b.textContent = prev;
  } catch {
    b.textContent = prev;
  } finally {
    b.disabled = false;
    if (brand) b.textContent = "switch";
  }
});
function syncChips() {
  const v = $("focus-in").value;
  document.querySelectorAll(".steer-chip").forEach((c) => c.classList.toggle("on", c.dataset.focus === v));
}
$("chips").addEventListener("click", (e) => {
  const chip = e.target.closest(".steer-chip");
  if (!chip) return;
  $("focus-in").value = chip.dataset.focus;
  syncChips();
  persist();
});
$("focus-in").addEventListener("input", () => {
  syncChips();
  persist();
});
function rebuildBrandChips() {
  document.querySelectorAll(".steer-chip.bchip").forEach((c) => c.remove());
  if (brand) {
    const sug = [];
    if (brand.audience) sug.push(`Is spend actually reaching ${brand.audience}?`);
    if (brand.positioning) sug.push(`Which campaigns drift off ${brand.name}'s positioning?`);
    else sug.push(`What should ${brand.name} scale tomorrow?`);
    for (const s of sug.slice(0, 2)) {
      const b = document.createElement("button");
      b.className = "steer-chip bchip";
      b.dataset.focus = s;
      b.textContent = trunc(s, 58);
      $("chips").append(b);
    }
  }
  syncChips();
}
function reflect() {
  const haveData = !!rows && rows.length > 0;
  $("analyse").disabled = !relay || !haveData || analysing || pulling;
  $("rerun").disabled = !relay || !haveData || analysing || pulling;
  $("stale-rerun").disabled = !relay || !haveData || analysing || pulling;
  $("pull-live").disabled = !relay || pulling || analysing;
  $("load-sample").hidden = !!relay;
  $("pull-sub").textContent = relay ? "reads your last 30 days through your own Meta connector \u2014 nothing leaves this tab" : "connect Switchboard (top right) to pull your live account \u2014 everything below works without it";
  $("pull-live").title = relay ? "reads your Ads Manager through your own Meta connector \u2014 nothing touches our servers (we have none)" : "connect Switchboard (top right) first";
  const hint = $("conn-hint");
  hint.textContent = "";
  if (relay) {
    const brandBit = brand ? ` Verdicts are judged against ${brand.name}'s positioning.` : "";
    const tail = !haveData ? " Pull live or paste an export first." : srcLabel === "sample" ? " The demo month is diagnosed below \u2014 pull your account to judge your own numbers." : "";
    hint.append("connected \u2014 the diagnosis runs on ", strong("your"), " Claude." + brandBit + tail);
  } else if (notInstalled) {
    const a = document.createElement("a");
    a.href = INSTALL_URL;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.textContent = "get Switchboard \u2192";
    hint.append("everything above works without AI. To run the diagnosis on your own Claude, ", a);
  } else {
    hint.append("the sample is loaded and explorable \u2014 ", strong("connect Switchboard"), " (top right) to pull your live account and run the diagnosis.");
  }
  if (rows) renderTapeCaption();
  syncDemo();
}
function strong(t) {
  const b = document.createElement("b");
  b.textContent = t;
  return b;
}
function ingest(text, source) {
  try {
    if (!text.trim()) {
      rows = null;
      rawCsv = "";
      srcLabel = "";
      origSource = "";
      $("tape").hidden = true;
      $("feed-err").hidden = true;
      persist();
      reflect();
      syncStale();
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
    $("paste-alt").open = true;
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
var PREFIX_KEY = "adpulse-meta-prefix";
migrateLocalKey("adpulse:meta-prefix", PREFIX_KEY);
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
async function pullLive({ auto = false } = {}) {
  if (!relay || pulling || analysing) return false;
  const myRun = ++pullSeq;
  $("feed-err").hidden = true;
  let sawOkTool = false, sawDenied = false;
  try {
    const prefix = await discoverPrefix(myRun);
    if (myRun !== pullSeq || !prefix) return false;
    setPull(true, "asking your consent to read the ads connector\u2026");
    await relay.connect({
      reason: "pull your Meta ads performance (read-only) to diagnose it",
      tools: [prefix + "*"],
      models: ["sonnet"]
    });
    if (myRun !== pullSeq) return false;
    setPull(true, "opening your ad account\u2026");
    let text = "";
    for await (const d of relay.stream({ prompt: PULL_PROMPT, agentic: true })) {
      if (myRun !== pullSeq) return false;
      if (d.type === "tool_proposed") setPull(true, "calling " + d.call.name.split("__").pop() + "\u2026");
      else if (d.type === "tool_result") {
        if (d.result.ok) sawOkTool = true;
        else {
          sawDenied = true;
          setPull(true, "\u26D4 " + (d.result.error?.message || "denied") + " \u2014 continuing\u2026");
        }
      } else if (d.type === "text") text += d.text;
      else if (d.type === "error") throw new Error(d.error?.message || "stream error");
    }
    if (myRun !== pullSeq) return false;
    const csv = extractCsv(text);
    if (!csv) throw new Error("your Claude answered but not with a parseable CSV \u2014 pull again, it usually lands on the second pass.");
    $("csv-in").value = csv;
    ingest(csv, "live");
    if (!rows || !rows.length) throw new Error("the pulled CSV had no campaign rows in it.");
    $("tape").scrollIntoView({ behavior: "smooth", block: "start" });
    if (!analysing) void analyse();
    return true;
  } catch (err) {
    if (myRun !== pullSeq) return false;
    const msg = String(err?.message || err);
    if (sawDenied && !sawOkTool || /unknown tool|no such tool|not allowed|not found/i.test(msg)) {
      try {
        localStorage.removeItem(PREFIX_KEY);
      } catch {
      }
    }
    const fe = $("feed-err");
    fe.hidden = false;
    fe.classList.toggle("soft", auto);
    fe.textContent = auto ? "\xB7 couldn't reach a live account (" + msg.slice(0, 160) + ") \u2014 diagnosing the demo month below instead. \u26A1 Pull from Ads Manager retries any time." : "\u26A0 live pull failed: " + msg.slice(0, 240);
    return false;
  } finally {
    if (myRun === pullSeq) setPull(false);
  }
}
$("pull-live").addEventListener("click", () => void pullLive());
$("pull-cancel").addEventListener("click", () => {
  pullSeq++;
  setPull(false);
});
function buildPrompt() {
  const focus = $("focus-in").value.trim() || "Full account post-mortem: wins, leaks, and what to do next.";
  const t = totals();
  let csv = rawCsv.trim();
  if (csv.length > 28e3) csv = csv.slice(0, 28e3) + "\n[...truncated]";
  const brandBlock = brand ? [
    "BRAND CONTEXT (the user lent this brand via Switchboard \u2014 judge the numbers against it):",
    `Brand: ${brand.name}.`,
    brand.positioning ? `Positioning: ${brand.positioning}.` : "",
    brand.audience ? `Audience: ${brand.audience}.` : "",
    brand.voice ? `Voice: ${brand.voice}.` : "",
    brand.products.length ? `Products: ${brand.products.join(", ")}.` : "",
    "Use it: judge CPA/CAC against the price point the positioning implies when one is stated; flag campaigns whose naming or targeting reads off-audience; wins, leaks and per-campaign verdicts should call out brand fit, not just ROAS."
  ].filter(Boolean).join(" ") : "";
  return [
    `You are AdPulse, a blunt, numbers-first Meta Ads performance analyst. A founder exported the data below from Meta Ads Manager. Currency is ${currency} (per the spend header); treat the export window as roughly one month.`,
    `Pre-computed aggregates (trust these): total spend ${curSym}${fmtIN(t.spend)}; blended ROAS ${t.blended.toFixed(2)}; total purchases ${fmtIN(t.purch)}; total purchase value ${curSym}${fmtIN(t.value)}; ${rows.length} campaigns.`,
    brandBlock,
    "CSV EXPORT:\n" + csv,
    "ANALYSIS FOCUS (weigh the whole diagnosis toward this): " + focus,
    `Respond with ONLY one JSON object \u2014 no prose, no markdown fences \u2014 in exactly this shape:
{"score": <integer 0-100, overall account health: 0 = burning cash, 100 = dialed in>, "headline": "<one blunt verdict sentence, max 120 chars>", "wins": [{"title": "...", "detail": "..."}], "leaks": [{"title": "...", "detail": "...", "monthlyBurn": <estimated ${currency} wasted per month, plain number>}], "actions": [{"title": "...", "impact": "high"|"medium", "effort": "low"|"medium"|"high", "detail": "..."}], "campaigns": [{"name": "<campaign name copied EXACTLY from the data>", "verdict": "scale"|"keep"|"fix"|"kill", "note": "<max 90 chars>"}]}`,
    "Rules: 2-4 wins, 2-4 leaks, 4-6 actions ordered most-urgent first, and one campaigns entry per campaign in the data. Cite real numbers from the data (ROAS, CPA, frequency, spend) in every detail. Each detail under 220 chars. Specific beats generic; a founder acts on this tomorrow morning."
  ].filter(Boolean).join("\n\n");
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
    const tail = brand ? [...STATUS_TAIL, `judging brand fit for ${brand.name}\u2026`] : STATUS_TAIL;
    let i = 0;
    liveTimer = setInterval(() => {
      $("live-line").textContent = tail[i % tail.length];
      i++;
    }, 2400);
  } else {
    clearInterval(liveTimer);
  }
  reflect();
}
async function analyse() {
  if (!relay || !rows || analysing) return;
  const myRun = ++runSeq;
  setLive(true);
  $("errbox").hidden = true;
  $("livebox").scrollIntoView({ behavior: "smooth", block: "nearest" });
  let text = "";
  try {
    for await (const d of relay.stream({ prompt: buildPrompt() })) {
      if (myRun !== runSeq) return;
      if (d.type === "text") {
        text += d.text;
        $("live-meta").textContent = (text.length / 1024).toFixed(1) + " kb";
      } else if (d.type === "error") {
        throw new Error(d.error?.message || "stream error");
      }
    }
    if (myRun !== runSeq) return;
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
    doing = null;
    reportFor = { csvSig: csvSig(), brand: brand?.name ?? null, source: srcLabel };
    persist();
    renderReport();
    $("report").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    if (myRun !== runSeq) return;
    showError(err);
  } finally {
    if (myRun === runSeq) setLive(false);
  }
}
$("analyse").addEventListener("click", analyse);
$("rerun").addEventListener("click", analyse);
$("retry").addEventListener("click", analyse);
$("stale-rerun").addEventListener("click", analyse);
$("cancel").addEventListener("click", () => {
  runSeq++;
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
  let detail = String(err?.message || err).slice(0, 240);
  if (!relay) detail += " \u2014 reconnect Switchboard (top right) to retry.";
  msg.append(b, detail);
  $("retry").hidden = !relay || !rows;
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
  const el2 = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el2.setAttribute(k, v);
  if (text != null) el2.textContent = text;
  return el2;
}
function renderDial(score) {
  const s = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const color = s >= 70 ? "var(--ok)" : s >= 40 ? "var(--warn)" : "var(--danger)";
  const ARC = "M 24 106 A 76 76 0 0 1 176 106";
  const svg = svgEl("svg", { viewBox: "0 0 200 122", width: "206", height: "126", role: "img", "aria-label": `account health ${s} of 100` });
  svg.append(
    svgEl("path", { d: ARC, fill: "none", style: "stroke:var(--edge)", "stroke-width": "10", "stroke-linecap": "round" }),
    svgEl("path", { d: ARC, fill: "none", style: "stroke:" + color, "stroke-width": "10", "stroke-linecap": "round", pathLength: "100", "stroke-dasharray": s + " 100" }),
    svgEl("text", { class: "big", x: "100", y: "95", "text-anchor": "middle" }, String(s)),
    svgEl("text", { class: "sub", x: "100", y: "115", "text-anchor": "middle" }, "/ 100 ACCOUNT HEALTH")
  );
  const dial = $("dial");
  dial.textContent = "";
  dial.append(svg);
}
function burnLine(b) {
  if (typeof b === "number" && isFinite(b) && b > 0) return "\u25BC " + curSym + fmtIN(b) + " / mo burn";
  const s = String(b ?? "").trim();
  return s && s !== "undefined" && s !== "null" ? "\u25BC " + s.slice(0, 60) : null;
}
function card(kind, title, detail, burn) {
  const el2 = document.createElement("div");
  el2.className = "card " + kind;
  const t = document.createElement("div");
  t.className = "t";
  t.textContent = title;
  const d = document.createElement("div");
  d.className = "d";
  d.textContent = detail;
  el2.append(t, d);
  if (burn) {
    const bl = document.createElement("div");
    bl.className = "burn";
    bl.textContent = burn;
    el2.append(bl);
  }
  return el2;
}
function noneCard(text) {
  const el2 = document.createElement("div");
  el2.className = "none";
  el2.textContent = text;
  return el2;
}
function tagEl(cls, text) {
  const t = document.createElement("span");
  t.className = "tag " + cls;
  t.textContent = text;
  return t;
}
function reportIsStale() {
  return !!report && (!reportFor || reportFor.csvSig !== csvSig() || reportFor.brand !== (brand?.name ?? null));
}
function syncDemo() {
  const note = $("demo-note");
  if (!note) return;
  const onDemo = !!report && (reportFor ? reportFor.source === "sample" : srcLabel === "sample");
  note.hidden = !onDemo || $("report").hidden;
  $("demo-pull").disabled = !relay || pulling || analysing;
}
$("demo-pull").addEventListener("click", () => void pullLive());
$("demo-paste").addEventListener("click", () => {
  $("paste-alt").open = true;
  $("csv-in").focus();
  $("paste-alt").scrollIntoView({ behavior: "smooth", block: "center" });
});
function syncStale() {
  const note = $("stale-note");
  if (!report || $("report").hidden) {
    note.hidden = true;
    return;
  }
  const stale = reportIsStale();
  note.hidden = !stale;
  if (!stale) return;
  $("stale-why").textContent = !reportFor || reportFor.csvSig !== csvSig() ? "the numbers changed since this diagnosis" : `this verdict was generated for ${reportFor.brand ?? "no brand"} \u2014 you're now on ${brand?.name ?? "no brand"}`;
}
function renderReport() {
  if (!report) return;
  renderDial(report.score);
  $("headline").textContent = report.headline;
  const judgedFor = reportFor ? reportFor.brand : brand?.name ?? null;
  $("verdict-sig").textContent = judgedFor ? `account health \xB7 verdict for ${judgedFor}` : "account health \xB7 verdict";
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
      const mine = doing != null && doing === a.title;
      const drafted = !mine && i === 0;
      const row = document.createElement("div");
      row.className = "action" + (mine ? " mine" : "") + (drafted ? " drafted" : "");
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("aria-pressed", mine ? "true" : "false");
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
      if (drafted) body.append(tagEl("draft", "recommended first"));
      if (mine) body.append(tagEl("star", "\u2605 your call \u2014 doing this first"));
      const d = document.createElement("div");
      d.className = "d";
      d.textContent = a.detail;
      body.append(d);
      const claim = () => {
        doing = mine ? null : a.title;
        persist();
        renderReport();
      };
      row.addEventListener("click", claim);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          claim();
        }
      });
      row.append(idx, body);
      acts.append(row);
    });
    acts.append(escapeHatch({
      label: "none of these \u2014 say what you'd do instead",
      hint: "your words become the analysis focus and the diagnosis re-runs against them",
      placeholder: "e.g. consolidate the prospecting campaigns into one and re-test the hook\u2026",
      sendLabel: "re-run on this",
      onSubmit: (text) => {
        $("focus-in").value = text;
        syncChips();
        doing = null;
        persist();
        return analyse();
      }
    }));
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
  syncStale();
  syncDemo();
}
function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      csv: rawCsv.length <= 2e5 ? rawCsv : "",
      source: srcLabel,
      origSource,
      // where the data ORIGINALLY came from, across restore cycles
      focus: $("focus-in").value,
      report,
      reportFor,
      // provenance so a restored report can be checked against restored data
      doing,
      // the move the founder claimed — a human decision, so it survives
      at: savedAt || Date.now()
      // when the DATA was ingested — not when the focus last changed
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
  reportFor = saved?.reportFor && typeof saved.reportFor === "object" ? saved.reportFor : null;
  doing = typeof saved?.doing === "string" ? saved.doing : null;
  origSource = typeof saved?.origSource === "string" ? saved.origSource : "";
  savedAt = Number(saved?.at) || 0;
  $("focus-in").value = saved?.focus || "Find wasted spend";
  syncChips();
  if (saved?.csv) {
    $("csv-in").value = saved.csv;
    ingest(saved.csv, saved.source === "sample" ? "sample" : "restored");
    if (saved.source !== "sample" && saved.source !== "live") $("paste-alt").open = true;
  } else {
    $("csv-in").value = SAMPLE;
    ingest(SAMPLE, "sample");
  }
  if (report) renderReport();
  reflect();
})();
//# sourceMappingURL=adpulse.js.map
