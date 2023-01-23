import React from "react";
import "./style.css";

import PreviousPage from "../PreviousPage";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { userId } = useParams();

  return (
    <>
      <PreviousPage />
      <button className="user-messages-btn">
        <a href={`../messages/${userId}`}>User messages </a>
      </button>

      <table border={1} className="profile-details">
        <tbody>
          <tr>
            <td> Username:</td> <td> rrr </td>
          </tr>
          <tr>
            <td> Categories:</td> <td> rrr </td>
          </tr>
          <tr>
            <td> Times seen:</td> <td> rrr </td>
          </tr>
          <tr>
            <td> Most used word:</td> <td> rrr </td>
          </tr>
          <tr>
            <td> Zjeb?:</td> <td> rrr </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
