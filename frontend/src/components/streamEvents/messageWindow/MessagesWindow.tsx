import "./style.css";
import React, { useContext, useEffect, useState } from "react";
import "react-notifications-component/dist/theme.css";
import { iNotification } from "react-notifications-component";
import { Store } from "react-notifications-component";

import {
  getMessageCategories,
  incrementUsesCategoryById,
} from "@services/MessageCategoriesService";
import Modal from "@components/modal";
import { SocketContext } from "@context/SocketContext";

export default function MessagesWindow() {
  const socket = useContext(SocketContext);
  const [showModal, setShowModal] = useState(false);

  const [currentMessages, setCurrentMessages] = useState<string[]>([]);
  const [currentIdCategory, setCurrentIdCategory] = useState<string>("");
  const [messageTosend, setMessageToSend] = useState<string>("");
  const { data, loading, error } = getMessageCategories();

  const { refetchData: fetchUpdateUses } =
    incrementUsesCategoryById(currentIdCategory);

  useEffect(() => {
    if (currentIdCategory || messageTosend) {
      fetchUpdateUses();
    }
  }, [currentIdCategory, messageTosend]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;
  const { data: msgCateg } = data;

  const getRandomMessage = (id: string) => {
    const documents = findMessagesCategoryByCurrCat(id);
    if (!documents) return "";

    const randomMessage =
      documents[Math.floor(Math.random() * documents.length)];

    return randomMessage;
  };

  const handleOnClickCategory = (id: string) => {
    setCurrentIdCategory(id);
    setCurrentMessages(findMessagesCategoryByCurrCat(id) || []);
    setShowModal(true);
  };

  const findMessagesCategoryByCurrCat = (id: string) => {
    return msgCateg.find(({ _id }) => _id === id)?.messages;
  };

  const handleOnClickRandomMessage = (id: string) => {
    setCurrentIdCategory(id);
    const randomMessage = getRandomMessage(id);

    Store.addNotification({
      ...getNotification("Send random message", randomMessage),
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
    setMessageToSend(randomMessage);
    sendMessage(randomMessage);
  };

  const getNotification = (title: string, message: string): iNotification => {
    return {
      title: `${title}`,
      message: `${message}`,
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
      animationOut: ["animate__animated animate__fadeOut"], // `animate.css v4` classes
    };
  };

  const sendMessage = (message: string) => {
    socket?.emit("messageClient", message);
  };

  const handleOnCloseModal = () => {
    setShowModal(false);
    setCurrentIdCategory("");
  };

  return (
    <>
      <div className="prepared-messages-window">
        <div className="widget-header"> Prepared Messages </div>
        {msgCateg.map((category, index) => {
          return (
            <div key={index} className="message-categories-btn-wrapper">
              <div>
                <button
                  onClick={() => {
                    handleOnClickRandomMessage(category._id);
                  }}
                >
                  <div>Send random</div>
                  <span className="button-category-name">
                    {category.category}
                  </span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    handleOnClickCategory(category._id);
                  }}
                >
                  <div>Show</div>
                  <span className="button-category-name">
                    {category.category}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        title="Send a message"
        onClose={() => {
          setShowModal(false);
        }}
        onSubmit={() => {
          handleOnCloseModal();
        }}
        show={showModal}
      >
        <div className="modal-prepared-messages">
          {currentMessages.map((message, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  sendMessage(message);
                }}
              >
                {message}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
