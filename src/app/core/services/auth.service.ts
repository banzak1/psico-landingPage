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
import { Observable, of, switchMap, map, firstValueFrom, first, shareReplay } from 'rxjs';

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

  private userObservable$: Observable<User | null> | null = null;

  public get user$(): Observable<User | null> {
    if (!this.userObservable$) {
      this.userObservable$ = user(this.auth).pipe(shareReplay(1));
    }
    return this.userObservable$;
  }

  public get userProfile$(): Observable<UserProfile | null | undefined> {
    return this.user$.pipe(
      switchMap((firebaseUser) => {
        if (firebaseUser === null) return of(null);
        const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
        return (docData(userRef) as Observable<UserProfile>);
      })
    );
  }

  public get isLoggedIn$(): Observable<boolean> {
    return this.user$.pipe(map((u) => !!u));
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
      console.error('[AUTH] Erro em loginWithGoogle:', error);
      throw error;
    });
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  /**
   * Garante que utilizadores já autenticados tenham perfil no Firestore.
   * Chamado via APP_INITIALIZER durante o bootstrap.
   */
  async processRedirectResult(): Promise<void> {
    try {
      const authUser = await firstValueFrom(this.user$.pipe(first()));
      if (!authUser) return;
      await this.ensureProfile(authUser);
    } catch (error) {
      console.error('[AUTH] Erro no processRedirectResult:', error);
    }
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
