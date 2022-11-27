import React from "react";

// disply the email info in a card
const EmailCard = (props) => {
  const {
    from_email,
    id,
    from_name,
    short_description,
    subject,
    read,
    favorite,
  } = props.data;

  return (
    <div
      className={`email-card ${read ? "read" : ""}`}
      onClick={() => {
        props.clickHandler();
      }}
    >
      <div className="avatar">{from_name[0]}</div>
      <div className="card-content">
        <div>
          From:{" "}
          <b>
            {from_name} &lt;{from_email}&gt;{" "}
          </b>
        </div>
        <div>
          Subject: <b>{subject}</b>
        </div>
        <p>{short_description}</p>
        <small>
          <time dateTime={props.date}>{props.date}</time>
          {favorite && (
            <b style={{ color: "#E54065", marginLeft: "20px" }}>Favorite</b>
          )}
        </small>
        <input
          type="checkbox"
          className="multi-select"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            props.selectItem(id, e.target.checked);
          }}
        />
      </div>
    </div>
  );
};

export default EmailCard;
