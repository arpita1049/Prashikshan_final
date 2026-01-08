# FULL STEP-BY-STEP GUIDE: Firebase Firestore Integration

This guide will walk you through setting up a real database for your Prashikshan app so you can save Resume Analyses and User Data forever.

---

## STEP 1: Set up Firebase Console

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Open your project: **"prashikshan-..."**.
3.  In the left sidebar, click **Build** -> **Firestore Database**.
4.  Click **Create Database**.
5.  **Location:** Choose the one closest to you (e.g., `asia-south1` for Mumbai).
6.  **Rules:** Start in **Test Mode** (allows anyone to read/write for 30 days).
    - _We will secure this later._
7.  Click **Create**.

---

## STEP 2: Verify Your API Keys

Ensure your code can talk to Firebase.

1.  Open your project in VS Code.
2.  Open `.env.local`.
3.  Make sure you have these lines (get values from Project Settings > General > Your Apps > SDK Setup > Config):
    ```env
    FIREBASE_API_KEY=AIzaSy...
    FIREBASE_AUTH_DOMAIN=prashikshan-....firebaseapp.com
    FIREBASE_PROJECT_ID=prashikshan-...
    FIREBASE_STORAGE_BUCKET=prashikshan-....appspot.com
    FIREBASE_MESSAGING_SENDER_ID=...
    FIREBASE_APP_ID=...
    ```

---

## STEP 3: Enable Google Auth (Optional but Recommended)

1.  In Firebase Console, go to **Build** -> **Authentication**.
2.  Click **Get Started**.
3.  Click **Sign-in method** tab.
4.  Add **Email/Password** and **Google**.
5.  Enable them and click **Save**.

---

## STEP 4: Update the Code (Resume History Feature)

We will add a "Save" feature to the Resume Builder.

### A. Update `services/firebase.ts`

Add this function inside `firebaseService`:

```typescript
// Add imports at the top
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

// Inside firebaseService object:
async saveResumeAnalysis(userId: string, content: string, analysis: any) {
  if (hasApiKey && realDb) {
    try {
      const docRef = await addDoc(collection(realDb, 'users', userId, 'resumes'), {
        content,
        analysis,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      console.error("Error saving resume:", e);
      throw e;
    }
  } else {
    // Mock save logic for demo
    console.log("Mock saved resume for", userId);
    return "mock-id";
  }
},

async getResumeHistory(userId: string) {
  if (hasApiKey && realDb) {
    const q = query(
      collection(realDb, 'users', userId, 'resumes'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  return [];
}
```

### B. Update `pages/ResumeBuilder.tsx`

1.  Open `pages/ResumeBuilder.tsx`.
2.  Import `firebaseService`.
3.  Update `handleAnalyze` to save the result automatically or via a button.

```typescript
// Inside handleAnalyze, after getting result:
if (result) {
  setAnalysis(result);

  // SAVE TO FIREBASE
  const user = firebaseService.getCurrentUser();
  if (user) {
    await firebaseService.saveResumeAnalysis(user.uid, resumeText, result);
    addToast("Analysis saved to history!", "success");
  }
}
```

---

## STEP 5: Verify on Dashboard

1.  Run your app: `npm run dev`.
2.  Login.
3.  Go to **Resume Builder**.
4.  Analyze a resume.
5.  Go to **Firebase Console** -> **Firestore Database**.
6.  You should see a `users` collection -> `(your-user-id)` -> `resumes` -> `(new-document)`.

---

## Troubleshooting

- **Error: "Missing or insufficient permissions"**: Check Firestore Rules tab. Ensure it says `allow read, write: if true;` (for Test Mode) or `if request.auth != null;`.
- **Data not showing**: Refresh the Firebase Console page.
