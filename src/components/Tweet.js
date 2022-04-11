import React from "react";
import { dbService, storageService } from "../fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="nweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input value={newTweet} placeholder="Edit your Tweet" type="text" required onChange={onChange} autoFocus className="formInput"/>
                        <input className="formBtn" value="Update Tweet" type="submit" />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
                </> ):(
                <>
                    <div>
                        <h4>{tweetObj.text}</h4>
                        {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} />}
                        {isOwner && (
                            <div className="nweet__actions">
                                <span onClick={deleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
                        )}
                    </div> 
                </>)
            }
        </div>
        
    )
}

export default Tweet;