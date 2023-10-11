import React, { useCallback, useEffect, useState } from "react";
import "react-notifications-component/dist/theme.css";

import {
  useGetMessageCategories,
  useIncrementUsesCategoryById,
} from "@services/MessageCategoriesService";
import Modal from "@components/modal";
import { useSocketContext } from "@context/socket";
import { addNotification } from "@utils/getNotificationValues";

export default function MessagesWindow() {
  const socketContext = useSocketContext();
  const [showModal, setShowModal] = useState(false);

  const [currentMessages, setCurrentMessages] = useState<string[]>([]);
  const [currentIdCategory, setCurrentIdCategory] = useState<string>("");
  const [messageTosend, setMessageToSend] = useState<string>("");
  const { data, loading, error } = useGetMessageCategories();

  const { refetchData: fetchUpdateUses } =
    useIncrementUsesCategoryById(currentIdCategory);

  useEffect(() => {
    if (currentIdCategory || messageTosend) {
      fetchUpdateUses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdCategory, messageTosend]);

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

  const findMessagesCategoryByCurrCat = (id: string) =>
    msgCateg.find(({ _id }) => _id === id)?.messages.map((msg) => msg[0]);

  const handleOnClickRandomMessage = (id: string) => {
    setCurrentIdCategory(id);
    const randomMessage = getRandomMessage(id);

    addNotification("Send random message", randomMessage, "success");

    setMessageToSend(randomMessage);
    sendMessage(randomMessage);
  };

  const sendMessage = useCallback(
    (message: string) => {
      const {
        emits: { messageClient },
      } = socketContext;
      messageClient(message);
    },
    [socketContext]
  );

  const handleOnCloseModal = () => {
    setShowModal(false);
    setCurrentIdCategory("");
  };

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;
  const { data: msgCateg } = data;

  return (
    <>
      <div className="prepared-messages-window">
        <div className="widget-header"> Prepared Messages </div>
        <div className="message-categories-btn-wrapper">
          {msgCateg.map((category, index) => (
            <div key={index} className="message-section-btn-wrapper">
              <div>
                <button
                  className={`${
                    category.enabled ? "primary-button" : "danger-button"
                  } common-button`}
                  onClick={() => {
                    handleOnClickRandomMessage(category._id);
                  }}
                >
                  <div>Send random</div>
                  <span className="button-category-name">{category.name}</span>
                </button>
              </div>
              <div>
                <button
                  className={`${
                    category.enabled ? "primary-button" : "danger-button"
                  } common-button`}
                  onClick={() => {
                    handleOnClickCategory(category._id);
                  }}
                >
                  <div>Show</div>
                  <span className="button-category-name">{category.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
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
          {currentMessages.map((message, index) => (
            <button
              className="primary-button common-button"
              key={index}
              onClick={() => {
                sendMessage(message);
              }}
            >
              {message}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
