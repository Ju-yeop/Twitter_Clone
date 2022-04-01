/* eslint-disable import/no-anonymous-default-export */
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { updateProfile } from "firebase/auth";

export default ({refreshUser, userObj}) => {
    let tweets = {}
    const [profileName, setprofileName] = useState(userObj.displayName);
    const onChange = (event) => {
        const {target:{value}} = event;
        setprofileName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== profileName){
            await updateProfile(authService.currentUser, {
                displayName: profileName
            })
            refreshUser();
        }
    }
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
        refreshUser();
    };
    const getMyTweets = async() => {
        tweets = await dbService.collection("tweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createAt")
        .get()
        tweets.docs.map((each) => console.log(each.data()))
    }
    useEffect(() => {
        getMyTweets();
    }, []);

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input className="formInput" autoFocus type="text" value={profileName} placeholder="Profile Name" required onChange={onChange}/>
                <input
                type="submit"
                value="Update Profile"
                className="formBtn"
                style={{
                    marginTop: 10,
                }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
        </div>
    );
};