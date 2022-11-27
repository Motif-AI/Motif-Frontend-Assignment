import React, { useEffect } from "react";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";

// contains the email body
const EmailDetail = (props) => {
  const { subject, body, id, from_name, favorite } = props.data;

  useEffect(() => {
    return () => {
      props.markAsRead(id);
    };
  }, [id, props.markAsRead]);

  return (
    <div className="email-body">
      <div className="avatar">{from_name[0]}</div>
      <div>
        <div className="email-body-topbar">
          <h2>{subject}</h2>
          <div className="group-button">
            <button
              className="favorite-btn"
              // style={{ transform: "translate(0px, -4px)" }}
              onClick={() => props.addToFav(id)}
            >
              {favorite ? "Remove from favorite" : "Mark as favorite"}
            </button>
            <button
              className="favorite-btn"
              onClick={() => {
                props.deleteEmail();
              }}
            >
              Delete
            </button>

            {/* <FontAwesomeIcon
              icon={faTrash}
              onClick={() => {
                props.deleteEmail();
              }}
            /> */}
          </div>
        </div>
        <time dateTime={props.date.replaceAll("/", "-")}>{props.date}</time>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
};

export default EmailDetail;
