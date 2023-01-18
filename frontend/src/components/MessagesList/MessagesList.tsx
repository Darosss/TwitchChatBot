import "./style.css";
import React from "react";
import { IMessage, IUser } from "@backend/models/types";
import useFetch from "../../hooks/useFetch.hook";

interface IMessagesList {
  messages: IMessage[];
  totalPages: number;
  currentPage: number;
}

export default function MessagesList() {
  const { data, error } = useFetch<IMessagesList>(
    `${process.env.REACT_APP_BACKEND_URL}/messages`
  );

  if (error) return <p>There is an error.</p>;
  if (!data) return <p>Loading...</p>;

  console.log(data);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Username</th>
            <th colSpan={4}>Message</th>
          </tr>
        </thead>

        <tbody>
          {data.messages.map((message) => {
            return (
              <tr key={message._id}>
                <td>{message.date.toLocaleString()}</td>
                <td>{(message.owner as unknown as IUser).username}</td>
                <td colSpan={4}>{message.message}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
