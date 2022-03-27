import React from "react";
import { dbService, storageService } from "fbase";
import { useState } from "react";

const Tweet = ({tweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    const onChange = (event) => {
        const {target:{value}} = event;
        setNewTweet(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text:newTweet
        })
        setEditing(false);
    }
    const deleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok){
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
            await storageService.refFromURL(tweetObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    return(
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input value={newTweet} placeholder="Edit your Tweet" type="text" required onChange={onChange}/>
                        <input value="Update Tweet" type="submit" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </> ):(
                <>
                    <div>
                        <h4>{tweetObj.text}</h4>
                        {tweetObj.attachmentUrl && (
                            <img src={tweetObj.attachmentUrl} width="50px" height="50px"/>
                        )}
                        {isOwner && (
                            <>
                                <button onClick={deleteClick}>Delete Tweet</button>
                                <button onClick={toggleEditing}>Edit Tweet</button>
                            </>
                        )}
                    </div> 
                </>)
            }
        </div>
        
    )
}

export default Tweet;