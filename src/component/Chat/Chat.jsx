import React, { useEffect, useState } from 'react'
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import Quill from 'quill';
import 'quill/dist/quill.snow.css'
import logo from "../../images/logo.png";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block','link'],
  ['image'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],
];

const ENDPOINT = "http://localhost:4000/";

const Chat = () => {
  const [quill, setQuill] = useState()
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const quillServer = new Quill("#container", { theme: "snow", modules: { toolbar: toolbarOptions } })
    // quillServer.disable();
    quillServer.setText("Write Here")
    setQuill(quillServer)
  }, []);

  const send = () => {
    const message = quill.getContents();
    // console.log(message)
    socket.emit('message', { message, id });
    // document.getElementById('chatInput').value = "";
  }

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ['websocket'] });

    socket.on('connect', () => {
      // alert('Connected');
      setid(socket.id);

    })
    socket.emit('joined', { user })

    socket.on('welcome', (data) => {
      setMessages([...messages, data]);
    })

    socket.on('userJoined', (data) => {
      setMessages([...messages, data]);
    })

    socket.on('leave', (data) => {
      setMessages([...messages, data]);
    })

    return () => {
      socket.emit('disconnectUser');
      socket.off();
    }
  }, [])

  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setMessages([...messages, data]);
      // socket.emit('getdata', { messages, id });
    })
    return () => {
      socket.off();
    }
  }, [messages])

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <img src={logo} alt="logo" className="logoImage" /><h2>Ab CHAT</h2>
          <a href="/"> <img src={closeIcon} alt="Close" /></a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => {
            console.log(item.message)
            return <Message key={i} id={i} user={item.id === id ? '' : item.user} message={item.message} classs={item.id === id ? 'right' : 'left'} />
          })}
        </ReactScrollToBottom>
        <div className="inputBox">
          <div id="container"></div>
          <button onClick={send} className="sendBtn"><img src={sendLogo} alt="Send" /></button>
        </div>
      </div>

    </div>
  )
}

export default Chat
