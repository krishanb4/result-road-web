import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
admin.initializeApp();

function assertAdmin(ctx: any) {
    if (!ctx.auth) throw new HttpsError("unauthenticated", "Sign in required.");
    const claims = ctx.auth.token as any;
    if (claims.role !== "admin") throw new HttpsError("permission-denied", "Admin only.");
}

/** Enable/disable user login */
export const adminSetDisabled = onCall(async (req) => {
    assertAdmin(req);
    const { uid, disabled } = req.data || {};
    if (!uid || typeof disabled !== "boolean") {
        throw new HttpsError("invalid-argument", "uid and disabled are required.");
    }
    await admin.auth().updateUser(uid, { disabled });
    // reflect in Firestore (optional)
    await admin.firestore().doc(`users/${uid}`).set({ disabled }, { merge: true });
    return { ok: true };
});

/** Set role custom-claim + Firestore role */
export const adminSetRole = onCall(async (req) => {
    assertAdmin(req);
    const { uid, role } = req.data || {};
    if (!uid || !role) throw new HttpsError("invalid-argument", "uid and role are required.");
    await admin.auth().setCustomUserClaims(uid, { role });
    await admin.firestore().doc(`users/${uid}`).set({ role }, { merge: true });
    return { ok: true };
});

/** Delete user from Auth (+ optional cleanup) */
export const adminDeleteUser = onCall(async (req) => {
    assertAdmin(req);
    const { uid } = req.data || {};
    if (!uid) throw new HttpsError("invalid-argument", "uid is required.");
    await admin.auth().deleteUser(uid);
    // Optional: cleanup Firestore
    await admin.firestore().doc(`users/${uid}`).delete().catch(() => { });
    // TODO: also clean up assignments/progress if you want
    return { ok: true };
});
