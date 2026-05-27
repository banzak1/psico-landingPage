import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import {
  getRedirectResult as firebaseGetRedirectResult
} from 'firebase/auth';
import { Firestore, doc, setDoc, docData, getDoc } from '@angular/fire/firestore';
import { Observable, of, switchMap, map, catchError } from 'rxjs';

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

  /**
   * Observable que busca os dados customizados (como o 'role') no Firestore.
   * Emite:
   *  - undefined: Firebase ainda carregando estado da sessão
   *  - null: sessão resolvida, usuário definitivamente deslogado
   *  - UserProfile: usuário logado com perfil encontrado
   */
  public get userProfile$(): Observable<UserProfile | null | undefined> {
    return this.user$.pipe(
      switchMap((firebaseUser) => {
        if (firebaseUser === null) return of(null);
        const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
        return (docData(userRef) as Observable<UserProfile>).pipe(
          catchError((error) => {
            console.error('Erro ao buscar perfil do usuário no Firestore:', error);
            return of(null);
          })
        );
      })
    );
  }

  // Observable simples para saber se o usuário está autenticado (independe do Firestore)
  public get isLoggedIn$(): Observable<boolean> {
    return this.user$.pipe(map((u) => !!u));
  }

  /**
   * Redireciona a página inteira para o Google para autenticação.
   * Ao voltar, processRedirectResult() captura o resultado.
   */
  async loginWithGoogle(): Promise<void> {
    try {
      const { getAuth, signInWithRedirect, GoogleAuthProvider } = await import('firebase/auth');
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('[AUTH] Erro em loginWithGoogle:', error);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  /**
   * Processa o resultado do redirect OAuth ao retornar do Google.
   * Chamado via APP_INITIALIZER para garantir que roda no bootstrap.
   * Cria o perfil do usuário no Firestore se for o primeiro login.
   */
  async processRedirectResult(): Promise<void> {
    try {
      const result = await firebaseGetRedirectResult(this.auth);
      if (result) {
        const firebaseUser = result.user;
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
        }
      }
    } catch (error) {
      console.error('Erro ao processar resultado do redirect:', error);
    }
  }
}
