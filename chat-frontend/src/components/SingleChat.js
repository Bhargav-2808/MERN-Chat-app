import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, ChevronRightIcon, LinkIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import call from "../call.png";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { useSocket } from "../Socket";
import { useNavigate } from "react-router-dom";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
let sc, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [pic, setPic] = useState();
  const { socket} = useSocket();  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const nav =  useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Access-Control-Allow-Origin":"*"
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      sc.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // console.log(user);
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      sc.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
            "Access-Control-Allow-Origin":"*"
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        sc.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const sendMessageButton = async (event) => {
    if (newMessage) {
      sc.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
            "Access-Control-Allow-Origin":"*"
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/message",
          {
            content: newMessage ?? pic,
            chatId: selectedChat,
          },
          config
        );
        sc.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    sc = io(ENDPOINT);
    sc.emit("setup", user);
    sc.on("connected", () => setSocketConnected(true));
    sc.on("typing", () => setIsTyping(true));
    sc.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    sc.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
  
      setNewMessage(e.target.value);
    

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      sc.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        sc.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const VideoCall = () => {

    sc.emit("join-room",{emailId:user.email ,roomId:user._id})
  };

  const postDetails = (pics) => {
    console.log(pics);

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "chat-app");
    data.append("cloud_name", "dbopcj4rk");
    fetch("https://api.cloudinary.com/v1_1/dbopcj4rk/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.url.toString());
        setNewMessage(`<a href="${data.url.toString()}" target="_blank">Click to download</a>`)
        // console.log(data.url.toString());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRoomJoin = useCallback( ({roomId} ) =>{
      nav(`/call/${roomId}`)
  },[nav]);

  useEffect(()=>{
    sc.on("joined-room",handleRoomJoin);
    return () =>{
      sc.off('joined-room',handleRoomJoin);
    }
  },[sc,handleRoomJoin])

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />

              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </>
                ))}
            </div>

            {!selectedChat.isGroupChat && (
              <IconButton
                d={{ base: "flex", md: "none" }}
                style={{ marginLeft: "25rem" }}
                icon={<img src={call} height="30" width="30" />}
                onClick={VideoCall}
              />
            )}
          </Text>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              style={{ position: "fixed", bottom: "10px" }}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <div>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  style={{ width: "58%" }}
                />
                <button
                  style={{
                    border: "1px solid #E0E0E0",
                    height: "auto",
                    backgroundColor: "#38b2ac",
                    color: "white",
                    padding: "3px",
                    marginLeft: "10px",
                    width: "50px",
                  }}
                  onClick={sendMessageButton}
                >
                  <ChevronRightIcon w={8} h={8} />
                </button>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <input
                    type="file"
                    onChange={(e) => {postDetails(e.target.files[0]); sendMessageButton()}}
                  />
                  {/* <LinkIcon w={6} h={6} /> */}
                </div>
              </div>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
