import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut,
    type Auth, type User, GoogleAuthProvider } from "firebase/auth";

export class AuthService {
    private readonly auth: Auth;
    private googleProvider = new GoogleAuthProvider();

    public constructor(config: FirebaseOptions) {
        const app = initializeApp(config);
        this.auth = getAuth(app);
    }

    // Initialize auth state change listener
    public initAuthStateListener(callback: (user: any) => void) {
        onAuthStateChanged(this.auth, (user) => {
            callback(user);
        });
    }

    // Redirect to Firebase hosted auth page
    public async signIn(provider: "google"): Promise<void> {
        if (provider !== "google") {
            throw new Error(`Trying to log in with an unsupported provider: ${provider}`);
        }
        await signInWithPopup(this.auth, this.googleProvider);
    }

    // Sign out
    public async signOut(): Promise<void> {
        await signOut(this.auth);
    }

    // Check auth state
    public isAuthenticated(): boolean {
        return this.auth.currentUser !== null;
    }

    // Get current user
    public getUser(): User | null {
        return this.auth.currentUser;
    }
}