const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// TEMP: put your UID here once to bootstrap admin (remove after you set your role via UI)
const BOOTSTRAP_ADMIN_UIDS = new Set(["REPLACE_WITH_YOUR_UID"]);

function assertAdmin(ctx) {
  if (!ctx.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign in required."
    );
  }
  const uid = ctx.auth.uid;
  const claims = ctx.auth.token || {};
  if (claims.role === "admin" || BOOTSTRAP_ADMIN_UIDS.has(uid)) return;
  throw new functions.https.HttpsError("permission-denied", "Admin only.");
}

exports.adminSetDisabled = functions.https.onCall(async (data, ctx) => {
  assertAdmin(ctx);
  const { uid, disabled } = data || {};
  if (!uid || typeof disabled !== "boolean") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "uid and disabled are required."
    );
  }
  await admin.auth().updateUser(uid, { disabled });
  await admin
    .firestore()
    .doc(`users/${uid}`)
    .set({ disabled }, { merge: true });
  return { ok: true };
});

exports.adminSetRole = functions.https.onCall(async (data, ctx) => {
  assertAdmin(ctx);
  const { uid, role } = data || {};
  if (!uid || !role) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "uid and role are required."
    );
  }
  await admin.auth().setCustomUserClaims(uid, { role });
  await admin.firestore().doc(`users/${uid}`).set({ role }, { merge: true });
  return { ok: true };
});

exports.adminDeleteUser = functions.https.onCall(async (data, ctx) => {
  assertAdmin(ctx);
  const { uid } = data || {};
  if (!uid)
    throw new functions.https.HttpsError(
      "invalid-argument",
      "uid is required."
    );
  await admin.auth().deleteUser(uid);
  await admin
    .firestore()
    .doc(`users/${uid}`)
    .delete()
    .catch(() => {});
  return { ok: true };
});
