import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        try{
            let data;
            const auth = getAuth();
            if (newAccount){
                data = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                data = await signInWithEmailAndPassword(auth, email, password);
            }
            console.log(data);
        } catch(error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return(
        <>
            <form onSubmit={onSubmit} className="container">
                <input className="authInput" name="email" type="text" placeholder="Email" required value={email} onChange={onChange}/>
                <input className="authInput" name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input className="authInput authSubmit" type="submit" value={newAccount ? "Create Account" : "Log In"}/>
                {error && <span className="authError">{error}</span>}
            </form>
        <span onClick={toggleAccount} className="authSwitch">{newAccount ? "Sign In" : "Create Account"}</span>
        </>
    )
}
export default AuthForm;