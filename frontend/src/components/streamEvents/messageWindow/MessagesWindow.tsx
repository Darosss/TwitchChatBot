import "./style.css";
import React, { useContext, useState } from "react";

import { getMessageCategories } from "@services/MessageCategoriesService";
import Modal from "@components/modal";
import { SocketContext } from "@context/SocketContext";

export default function MessagesWindow() {
  const socket = useContext(SocketContext);
  const [showModal, setShowModal] = useState(false);

  const [currentMessages, setCurrentMessages] = useState<string[]>([]);
  const { data, loading, error } = getMessageCategories();

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
    setCurrentMessages(findMessagesCategoryByCurrCat(id) || []);
    setShowModal(true);
  };

  const findMessagesCategoryByCurrCat = (id: string) => {
    return msgCateg.find(({ _id }) => _id === id)?.messages;
  };

  const handleOnClickRandomMessage = (id: string) => {
    const randomMessage = getRandomMessage(id);
    sendMessage(randomMessage);
  };
  const sendMessage = (message: string) => {
    socket?.emit("messageClient", message);
  };

  return (
    <>
      <div className="prepared-messages-window">
        <div className="widget-header"> Prepared Messages </div>
        {msgCateg.map((category, index) => {
          return (
            <div key={index}>
              <button
                onClick={() => {
                  handleOnClickRandomMessage(category._id);
                }}
                className="message-category"
              >
                Random {category.category}
              </button>
              <button
                onClick={() => {
                  handleOnClickCategory(category._id);
                }}
                className="message-category"
              >
                {category.category}
              </button>
            </div>
          );
        })}

        {/* <button className="message-category">test321 </button>
      <button className="message-category">test321 </button>
      <button className="message-category">test321 </button> */}
      </div>
      <Modal
        title="Send a message"
        onClose={() => {
          setShowModal(false);
        }}
        onSubmit={() => {
          // onSubmitEditModal();
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
