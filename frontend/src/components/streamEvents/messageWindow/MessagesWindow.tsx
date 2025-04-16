import { useState } from "react";
import {
  useGetMessageCategories,
  useIncrementUsesCategoryById,
} from "@services";
import Modal from "@components/modal";
import { addNotification } from "@utils";

import { useSocketContext } from "@socket";
import { Error, Loading } from "@components/axiosHelper";

export default function MessagesWindow() {
  const socket = useSocketContext();
  const [showModal, setShowModal] = useState(false);

  const [currentMessages, setCurrentMessages] = useState<string[]>([]);
  const { data, isLoading, error } = useGetMessageCategories();

  const incrementUsesCategoryByIdMutation = useIncrementUsesCategoryById();

  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;
  const { data: msgCateg } = data;

  const getRandomMessage = (id: string) => {
    const documents = findMessagesCategoryByCurrCat(id);
    if (!documents) return "";

    const randomMessage =
      documents[Math.floor(Math.random() * documents.length)];

    return randomMessage;
  };

  const handleOnClickCategory = (id: string) => {
    incrementUsesCategoryByIdMutation.mutate(id);

    setCurrentMessages(findMessagesCategoryByCurrCat(id) || []);
    setShowModal(true);
  };

  const findMessagesCategoryByCurrCat = (id: string) => {
    return msgCateg
      .find(({ _id }) => _id === id)
      ?.messages.map((msg) => msg[0]);
  };

  const handleOnClickRandomMessage = (id: string) => {
    const randomMessage = getRandomMessage(id);

    addNotification("Send random message", randomMessage, "success");

    sendMessage(randomMessage);
  };

  const sendMessage = (message: string) => {
    socket.emits.messageClient(message);
  };

  const handleOnCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="prepared-messages-window">
        <div className="widget-header"> Prepared Messages </div>
        <div className="message-categories-btn-wrapper">
          {msgCateg.map((category, index) => {
            return (
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
                    <span className="button-category-name">
                      {category.name}
                    </span>
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
                    <span className="button-category-name">
                      {category.name}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
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
          {currentMessages.map((message, index) => {
            return (
              <button
                className="primary-button common-button"
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
