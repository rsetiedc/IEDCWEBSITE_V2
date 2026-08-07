// Temporary mobile-verification script — drives headless Chrome via CDP.
// Not part of the app; delete after running.
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;
const BASE = "http://localhost:4173/IEDCWEBSITE_V2";

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--user-data-dir=/tmp/iedc-chrome-profile",
    "about:blank",
  ],
  { stdio: "ignore" }
);

let targets;
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch(`http://localhost:${PORT}/json/list`);
    targets = await res.json();
    if (targets?.length) break;
  } catch {}
  await sleep(300);
}
// Prefer a real page target (not the browser/service-worker targets)
const pageTarget = targets?.find((t) => t.type === "page");
if (!pageTarget) {
  console.error("no page target; targets:", targets?.map((t) => t.type));
  chrome.kill();
  process.exit(1);
}

const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let id = 0;
const pending = new Map();
let consoleErrors = [];

ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  } else if (msg.method === "Runtime.exceptionThrown") {
    consoleErrors.push("EXCEPTION: " + (msg.params.exceptionDetails?.text ?? ""));
  } else if (msg.method === "Log.entryAdded") {
    const e = msg.params.entry;
    if (e.level === "error") consoleErrors.push("LOG: " + e.text);
  }
};

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

async function evaluate(expression) {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.exceptionDetails) return "EVAL-ERR: " + JSON.stringify(r.exceptionDetails).slice(0, 200);
  return r.result?.value;
}

// ---- mobile emulation (touch, so (hover: none) media queries apply) ----
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 3,
  mobile: true,
});
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

async function goto(path) {
  consoleErrors = [];
  await send("Page.navigate", { url: BASE + path });
  for (let i = 0; i < 40; i++) {
    await sleep(300);
    const ready = await evaluate(
      `(() => { const r = document.querySelector('#root'); return !!r && r.children.length > 0; })()`
    );
    if (ready) break;
  }
  await sleep(1500);
}

async function checkPage(path) {
  await goto(path);
  const info = await evaluate(`(() => {
    const de = document.documentElement;
    const nav = document.querySelector('.navbar');
    const foot = document.querySelector('.footer');
    return JSON.stringify({
      innerWidth: window.innerWidth,
      docOverflow: de.scrollWidth - window.innerWidth,
      bodyOverflow: document.body.scrollWidth - window.innerWidth,
      navPaddingTop: nav ? getComputedStyle(nav).paddingTop : null,
      navIsFixed: nav ? getComputedStyle(nav).position : null,
      footerPaddingBottom: foot ? getComputedStyle(foot).paddingBottom : null,
    });
  })()`);
  console.log(`\n== ${path} ==`);
  console.log("  ", info);
  console.log("  consoleErrors:", consoleErrors.length ? consoleErrors.slice(0, 5) : "none");
}

for (const p of ["/", "/about", "/events", "/team", "/gallery", "/reports", "/contact"]) {
  await checkPage(p);
}

// ---- Team card tap-to-flip ----
await goto("/team");
const before = await evaluate(
  `getComputedStyle(document.querySelector('.team-card-inner')).transform`
);
await evaluate(`document.querySelector('.team-card').click()`);
await sleep(700);
const after = await evaluate(`(() => {
  const card = document.querySelector('.team-card');
  return JSON.stringify({
    cls: card.className,
    transform: getComputedStyle(card.querySelector('.team-card-inner')).transform,
  });
})()`);
await evaluate(`document.querySelector('.team-card').click()`);
await sleep(700);
const after2 = await evaluate(
  `(() => { const card = document.querySelector('.team-card'); return JSON.stringify({ cls: card.className, transform: getComputedStyle(card.querySelector('.team-card-inner')).transform }); })()`
);
console.log("\n== TEAM TAP-TO-FLIP ==");
console.log("  before 1st tap:", before);
console.log("  after  1st tap:", after);
console.log("  after  2nd tap:", after2);

// ---- Hamburger menu open/close ----
await goto("/");
const menuBefore = await evaluate(`document.querySelector('.nav-links').className`);
await evaluate(`document.querySelector('.menu-btn').click()`);
await sleep(600);
const menuOpen = await evaluate(`document.querySelector('.nav-links').className`);
const bodyOverflowOpen = await evaluate(`document.body.style.overflow`);
await evaluate(`document.querySelector('.menu-btn').click()`);
await sleep(600);
const menuClosed = await evaluate(`document.querySelector('.nav-links').className`);
const bodyOverflowClosed = await evaluate(`document.body.style.overflow`);
console.log("\n== MOBILE MENU ==");
console.log("  before:     ", menuBefore);
console.log("  opened:     ", menuOpen, "| body overflow:", bodyOverflowOpen);
console.log("  closed:     ", menuClosed, "| body overflow:", bodyOverflowClosed);

chrome.kill();
process.exit(0);
