import React, { useEffect } from "react";
import { useState } from "react";
import { dbService, storageService } from "fbase";
import Tweet from "components/Tweet";
import {v4 as uuidv4} from "uuid";

const Home = ({userObj}) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState(""); //image file
    /*const getTweets = async () => {
        const dbTweets = await dbService.collection("tweets").get();
        dbTweets.forEach((document) => {
            const tweetObject = {
                ...document.data(),
                id:document.id
            }
            setTweets((prev) => [tweetObject, ...prev])
        })
    }*/
    useEffect(() => {
        dbService.collection("tweets").onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map((doc) => ({
                id:doc.id,
                ...doc.data()
            }));
            setTweets(tweetArray);
        })
    }, []);

    const onChange = (event) => {
        const {target:{value}} = event;
        setTweet(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = ""
        if (attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text:tweet,
            createAt:Date.now(),
            creatorId:userObj.uid,
            attachmentUrl
        }
        await dbService.collection("tweets").add(tweetObj)
        setTweet("");
        setAttachment("");
    }
    const onFileChange = (event) => {
        const {target:{files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget:{result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => setAttachment(null);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    value={tweet} 
                    required 
                    maxLength={120} 
                    onChange={onChange} 
                    placeholder="What's on your mind?"/>
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="SUBMIT"/>
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
                    ))
                }
            </div>
        </div>
    )
}
export default Home;