import React from 'react'
import Quill from 'quill';
import 'quill/dist/quill.snow.css'
import "./Message.css";


const Message = ({ user,id, message, classs }) => {

    React.useEffect(() => {
        const quillServer = new Quill(`.Box${id}`)
        quillServer.disable();
        quillServer.setContents(message)
    }, [message,id]);



    if (user) {
        // console.log(message)
        return (
            <div id="message" className={`Box${id} messageBox ${classs}`}  >
            </div>
        )
    }
    else {


        return (
            <div id="message" className={`Box${id} messageBox ${classs}`}>
            </div>
        )
    }
}

export default Message
