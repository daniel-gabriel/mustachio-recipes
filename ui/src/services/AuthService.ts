import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithRedirect, signOut,
    type Auth, type User, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";

export class AuthService {
    private readonly auth: Auth;
    private googleProvider = new GoogleAuthProvider();
    private emailProvider = new EmailAuthProvider();

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
    public async signIn(provider: "google"|"email"): Promise<void> {
        const authProvider = provider === "google" ?
            this.googleProvider : this.emailProvider;
        await signInWithRedirect(this.auth, authProvider);
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