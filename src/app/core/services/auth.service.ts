import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData, getDoc } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';

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

  // Observable que espelha o estado nativo do Firebase Authentication
  public get user$(): Observable<User | null> {
    return user(this.auth);
  }

  // Observable que busca os dados customizados (como o 'role') no Firestore
  public get userProfile$(): Observable<UserProfile | null> {
    return this.user$.pipe(
      switchMap((firebaseUser) => {
        if (!firebaseUser) return of(null);
        const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
        return docData(userRef) as Observable<UserProfile>;
      })
    );
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    const firebaseUser = credential.user;

    // Checar se o documento do usuário já existe no banco
    const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
    const userSnap = await getDoc(userRef);

    // Se for um novo usuário, criamos o perfil dele com a role 'user' (perfil comum)
    if (!userSnap.exists()) {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'user'
      };
      await setDoc(userRef, newProfile);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
