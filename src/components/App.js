import React, { useEffect, useState } from "react"
import AppRouter from "components/Router";
import {authService} from "fbase";
import {getAuth, onAuthStateChanged, updateProfile} from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user){
        setIsLoggedIn(true);
        const uid = user.uid;
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: updateProfile(user, { displayName: user.displayName })
        })
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: updateProfile(user, { displayName: user.displayName })
    })
  }
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Twitter</footer>
    </>
  )
}

export default App;
