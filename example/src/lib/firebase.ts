import firebase from 'firebase/app'
import 'firebase/auth'
import { FIREBASE_COOKIE_KEY } from 'next-fortress/build/constants'

export const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

!firebase.apps.length ? firebase.initializeApp(config) : firebase.app()

export const auth = firebase.auth()
export const Firebase = firebase

export const Login = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      return result
    })
    .catch(function (error) {
      console.log(error)
      const errorCode = error.code
      console.log(errorCode)
      const errorMessage = error.message
      console.log(errorMessage)
    })
}

export const listenAuthState = (dispatch: any) => {
  return firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      user
        .getIdToken()
        .then(
          (token) =>
            (document.cookie = `${FIREBASE_COOKIE_KEY}=${token}; path=/`)
        )
      dispatch({
        type: 'login',
        payload: {
          user
        }
      })
    } else {
      // User is signed out.
      document.cookie = `${FIREBASE_COOKIE_KEY}=; path=/; expires=${new Date(
        '1999-12-31T23:59:59Z'
      ).toUTCString()}`
      dispatch({
        type: 'logout'
      })
    }
  })
}

export const firebaseUser = () => {
  return firebase.auth().currentUser
}

export const Logout = () => {
  auth.signOut().then(() => {
    window.location.reload()
  })
}
