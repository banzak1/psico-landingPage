import { Injectable, inject, NgZone } from '@angular/core';
import {
  Auth,
  signOut,
  GoogleAuthProvider,
  user,
  User,
} from '@angular/fire/auth';
import {
  signInWithPopup
} from 'firebase/auth';
import { Firestore, doc, setDoc, docData, getDoc } from '@angular/fire/firestore';
import { Observable, of, switchMap, map, shareReplay, filter, first } from 'rxjs';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private ngZone: NgZone = inject(NgZone);

  private _user$: Observable<User | null> | null = null;
  private profileSyncStarted = false;
  public get user$(): Observable<User | null> {
    if (!this._user$) {
      this._user$ = user(this.auth).pipe(shareReplay(1));
    }
    this.startProfileSync();
    return this._user$;
  }

  private _userProfile$: Observable<UserProfile | null | undefined> | null = null;
  public get userProfile$(): Observable<UserProfile | null | undefined> {
    if (!this._userProfile$) {
      this._userProfile$ = this.user$.pipe(
        switchMap((firebaseUser) => {
          if (firebaseUser === null) return of(null);
          const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
          return (docData(userRef) as Observable<UserProfile>);
        }),
        shareReplay(1)
      );
    }
    return this._userProfile$;
  }

  private _isLoggedIn$: Observable<boolean> | null = null;
  public get isLoggedIn$(): Observable<boolean> {
    if (!this._isLoggedIn$) {
      this._isLoggedIn$ = this.user$.pipe(
        map((u) => !!u),
        shareReplay(1)
      );
    }
    return this._isLoggedIn$;
  }

  loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    // runOutsideAngular previne que zone.js interfira no message listener do popup
    return this.ngZone.runOutsideAngular(() =>
      signInWithPopup(this.auth, provider)
    ).then(result => {
      console.log('[AUTH] Login concluído:', result.user.email);
      return this.ensureProfile(result.user);
    }).catch((error: unknown) => {
      throw error;
    });
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  /**
   * Reactively ensures already-authenticated users have a Firestore profile.
   * Triggered lazily on first user$ access, avoiding the APP_INITIALIZER deadlock with AngularFire.
   * Uses a flag to prevent duplicate subscriptions across multiple user$ accesses.
   */
  private startProfileSync(): void {
    if (this.profileSyncStarted) return;
    this.profileSyncStarted = true;

    this._user$!.pipe(
      filter((u): u is User => u !== null),
      first()
    ).subscribe({
      next: (authUser) => this.ensureProfile(authUser),
      error: () => {}
    });
  }

  private async ensureProfile(firebaseUser: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'user'
      };
      await setDoc(userRef, newProfile);
      console.log('[AUTH] Perfil criado no Firestore para:', firebaseUser.email);
    }
  }
}
