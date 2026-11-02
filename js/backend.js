// Один інтерфейс для двох режимів: Firebase (справжній) і демо (localStorage).
import { firebaseConfig } from "./firebase-config.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
export const isDemo = !firebaseConfig.apiKey || new URLSearchParams(location.search).has("demo");

function bucketOf(key) { return "w" + key.slice(0, 2); }

// ---------- Firebase ----------
async function firebaseBackend() {
  const { initializeApp } = await import(FB + "firebase-app.js");
  const A = await import(FB + "firebase-auth.js");
  const F = await import(FB + "firebase-firestore.js");
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  const db = F.initializeFirestore(app, {
    localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() })
  });
  const provider = new A.GoogleAuthProvider();
  A.getRedirectResult(auth).catch(() => {});

  return {
    onUser(cb) {
      A.onAuthStateChanged(auth, u => cb(u ? { uid: u.uid, name: u.displayName || u.email, email: (u.email || "").toLowerCase() } : null));
    },
    async signIn() {
      try { await A.signInWithPopup(auth, provider); }
      catch (e) {
        if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment"].includes(e.code)) {
          await A.signInWithRedirect(auth, provider);
        } else if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") throw e;
      }
    },
    signOut() { return A.signOut(auth); },
    async isAllowed(user) {
      try { return (await F.getDoc(F.doc(db, "allowedEmails", user.email))).exists(); }
      catch { return false; }
    },
    async loadProfile(user) {
      const snap = await F.getDoc(F.doc(db, "users", user.uid));
      return snap.exists() ? snap.data() : null;
    },
    saveProfile(user, patch) { return F.setDoc(F.doc(db, "users", user.uid), patch, { merge: true }); },
    async loadProgress(user) {
      const qs = await F.getDocs(F.collection(db, "users", user.uid, "progress"));
      const all = {};
      qs.forEach(d => Object.assign(all, d.data().items || {}));
      return all;
    },
    saveProgress(user, key, state) {
      return F.setDoc(F.doc(db, "users", user.uid, "progress", bucketOf(key)), { items: { [key]: state } }, { merge: true });
    },
    async loadDay(user, date) {
      const s = await F.getDoc(F.doc(db, "users", user.uid, "days", date));
      return s.exists() ? s.data() : {};
    },
    logDay(user, date, delta) {
      const patch = {};
      for (const [k, v] of Object.entries(delta)) patch[k] = typeof v === "number" ? F.increment(v) : v;
      return F.setDoc(F.doc(db, "users", user.uid, "days", date), patch, { merge: true });
    },
    async loadRecord(user, setId) {
      const s = await F.getDoc(F.doc(db, "users", user.uid, "records", setId));
      return s.exists() ? s.data() : {};
    },
    saveRecord(user, setId, patch) {
      return F.setDoc(F.doc(db, "users", user.uid, "records", setId), patch, { merge: true });
    }
  };
}

// ---------- Demo ----------
function demoBackend() {
  const K = "cestina-demo";
  const read = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch { return {}; } };
  const write = s => { try { localStorage.setItem(K, JSON.stringify(s)); } catch {} };
  const user = { uid: "demo", name: "Демо", email: "demo@local" };
  let cb = null;
  return {
    onUser(f) { cb = f; f(read().signedIn ? user : null); },
    async signIn() { const s = read(); s.signedIn = true; write(s); cb && cb(user); },
    async signOut() { const s = read(); s.signedIn = false; write(s); cb && cb(null); },
    async isAllowed() { return true; },
    async loadProfile() { return read().profile || null; },
    async saveProfile(_, p) { const s = read(); s.profile = { ...(s.profile || {}), ...p }; write(s); },
    async loadProgress() { return read().progress || {}; },
    async saveProgress(_, key, st) { const s = read(); (s.progress ||= {})[key] = st; write(s); },
    async loadDay(_, d) { return (read().days || {})[d] || {}; },
    async logDay(_, d, delta) {
      const s = read(); const day = ((s.days ||= {})[d] ||= {});
      for (const [k, v] of Object.entries(delta)) day[k] = typeof v === "number" ? (day[k] || 0) + v : v;
      write(s);
    },
    async loadRecord(_, id) { return (read().records || {})[id] || {}; },
    async saveRecord(_, id, p) { const s = read(); (s.records ||= {})[id] = { ...((s.records || {})[id] || {}), ...p }; write(s); }
  };
}

export async function createBackend() {
  return isDemo ? demoBackend() : firebaseBackend();
}
