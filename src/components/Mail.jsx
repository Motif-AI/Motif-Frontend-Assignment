import React, { useEffect, useState, useCallback } from "react";
import { getEmail, getEmailList } from "../utils/api";
import EmailCard from "./EmailCard";
import EmailDetail from "./EmailDetail";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Mail = () => {
  // Current active tab.
  const [filterTab, setFilterTab] = useState("all");
  // List of all the emails are fetched and stored in this.
  const [emailList, setEmailList] = useState([]);
  // Email Data is fetched and stored in this.
  const [emailData, setEmailData] = useState(null);
  // used to disable forward and backward button while pagination.
  const [pageNum, setPageNum] = useState(0);
  //dynamically set number of emails per page
  const [emailsPerPage, setEmailsPerPage] = useState(5);
  // email body on delete, on tab change is closed using this.
  const [readingEmail, setReadingEmail] = useState(false);
  //stores the index of multi-selected emails
  const [bulkSelectedEmails, SetBulkSelectedEmails] = useState([]);
  //used to filter emails based on name
  const [searchEmail, setSearchEmail] = useState("");

  // number of emails currently dispalyed on page.
  const displayedEmails = [5, 10, 25, 50];
  //Bulk options values
  const bulkSelectOptions = ["Read", "Unread", "Favorite", "Delete"];
  //Nav menu options
  const navMenuOptions = ["All", "Unread", "Read", "Favorite"];

  //Changes the tab.
  const changeTab = (tab) => {
    setFilterTab(tab);
    setReadingEmail(false);
    setPageNum(0);
  };

  //display emails as per tabs
  const filterEmailsOnTab = (e, i) => {
    if (filterTab === "Read") {
      return e.read;
    } else if (filterTab === "Unread") {
      return !e.read;
    } else if (filterTab === "Favorite") {
      return e.favorite;
    }
    return true;
  };

  // forward and backward pagination
  const pageFilter = (e, i) => {
    if (i < emailsPerPage * pageNum || i >= emailsPerPage * (pageNum + 1)) {
      return false;
    }
    return true;
  };

  //  search emails based on Name
  const searchFilter = (e, i) => {
    if (e.from_name.toLowerCase().includes(searchEmail.toLowerCase())) {
      return true;
    }
    return false;
  };

  // Api call to get email data based on ID
  const getEmailData = async (id, item) => {
    let res = await getEmail(id);
    setEmailData({
      ...res,
      ...item,
    });
    setReadingEmail(true);
  };

  // Adds email to favourite froms email body
  const addToFav = useCallback((id) => {
    setEmailList((prev) => {
      return prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            favorite: !e.favorite,
          };
        }
        return e;
      });
    });
    setEmailData((p) => {
      return {
        ...p,
        favorite: !p.favorite,
      };
    });
  }, []);

  // mark emails to be read
  const markAsRead = useCallback((id) => {
    setEmailList((prev) => {
      return prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            read: true,
          };
        }
        return e;
      });
    });
    setEmailData((p) => {
      return {
        ...p,
        read: true,
      };
    });
  }, []);

  // handles all the bulk operations such as mark all read, unread and delete
  const bulkActionHandler = (action) => {
    let tempEmailList = [...emailList];

    if (action === "Delete") {
      bulkSelectedEmails.map((selected) => {
        const index = tempEmailList.map((mail) => mail.id).indexOf(selected);
        tempEmailList.splice(index, 1);
      });
      SetBulkSelectedEmails([]);
    } else {
      tempEmailList.map((e) => {
        let index = bulkSelectedEmails.indexOf(e.id);
        if (index >= 0) {
          if (action === "Read") {
            e.read = true;
          } else if (action === "Unread") {
            e.read = false;
          } else if (action === "Favorite") {
            e.favorite = true;
          }
        }
        return e;
      });
    }
    setEmailList(tempEmailList);

    setReadingEmail(false);
  };

  // deletes the email.
  const deleteEmail = () => {
    let tempEmailList = [...emailList];
    let index = tempEmailList.map((item) => item.id).indexOf(emailData.id);
    tempEmailList.splice(index, 1);

    setEmailList(tempEmailList);
    setReadingEmail(false);
  };

  // dispays emails based on filters on specific tabs.
  const Emails = emailList
    .filter(filterEmailsOnTab)
    .filter(pageFilter)
    .filter(searchFilter)
    .map((item, i) => {
      return (
        <EmailCard
          key={item.id}
          data={item}
          selectItem={(id, isSelected) => {
            SetBulkSelectedEmails((p) => {
              if (isSelected) {
                return [...p, id];
              }
              let index = p.indexOf(id);
              if (index >= 0) {
                return p.slice(0, index).concat(p.slice(index + 1));
              }
              return p;
            });
          }}
          date={getDate()}
          clickHandler={(id) => getEmailData(id, item)}
        />
      );
    });

  // Display date in email subject and body
  function getDate() {
    let date = new Date();
    const day = date.toLocaleDateString().split("/")[1];
    const mmyyyy = date.toLocaleDateString("en-US", {
      month: "numeric",
      year: "numeric",
    });
    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const dateFormat = day + "/" + mmyyyy + " " + time;
    return dateFormat;
  }

  //component to render all the bulk options
  const showBulkOptions = bulkSelectOptions.map((option, idx) => (
    <button
      className="favorite-btn"
      key={idx}
      onClick={() => {
        bulkActionHandler(option);
      }}
    >
      {option}
    </button>
  ));
  //component to render all the nav menu options
  const showNavOptions = navMenuOptions.map((option, idx) => (
    <li
      className={filterTab === option ? "active" : ""}
      key={idx}
      onClick={() => changeTab(option)}
    >
      {option}
    </li>
  ));

  // Id data is available in local storage, fetch it or fetch from the API
  useEffect(() => {
    //Check if the data is present in localStoreage
    const data = localStorage.getItem("Data");
    if (data) {
      setEmailList(JSON.parse(data));
    } else {
      //If data is not available then fetch the data from API
      getEmailList().then((res) => {
        setEmailList(
          res.map((e) => ({
            ...e,
            read: false,
            favorite: false,
          }))
        );
      });
    }
  }, []);

  // Updates the local Storage with recent values
  useEffect(() => {
    localStorage.setItem("Data", JSON.stringify(emailList));
    return () => {
      localStorage.clear();
    };
  }, [emailList]);

  return (
    <>
      <header className="filter-nav">
        <ul>
          Filter By:
          {showNavOptions}
        </ul>
        <input
          type="text"
          placeholder="Search...."
          className="search-box"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </header>

      <nav className="navigator-buttons">
        <div className="bulk-options">
          {bulkSelectedEmails.length > 0 ? showBulkOptions : ""}
        </div>

        <div className="pagination">
          <button
            className="simple-btn"
            disabled={pageNum <= 0}
            onClick={() => {
              setPageNum((p) => p - 1);
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} size="1x" />
          </button>

          <select
            value={emailsPerPage}
            onChange={(e) => {
              setEmailsPerPage(e.target.value);
            }}
          >
            {displayedEmails.map((option, index) => {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              );
            })}
          </select>

          <button
            className="simple-btn"
            disabled={
              (pageNum + 1) * emailsPerPage >=
              emailList.filter(filterEmailsOnTab).length - 1
            }
            onClick={() => {
              setPageNum((p) => p + 1);
            }}
          >
            <FontAwesomeIcon icon={faAngleRight} size="1x" />
          </button>
        </div>
      </nav>

      <div className="App">
        <div className="emails">{Emails}</div>
        {emailData !== null && readingEmail && (
          <EmailDetail
            data={emailData}
            date={getDate()}
            addToFav={addToFav}
            markAsRead={markAsRead}
            deleteEmail={deleteEmail}
          />
        )}
      </div>
    </>
  );
};

export default Mail;
