import React from "react";
import { FaUser, FaBullhorn } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Sidebar.css"

const Sidebar = () => {
    return (
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/prospects">
              <FaUser /> Prospects
            </Link>
          </li>
          <li>
            <Link to="/campaigns">
              <FaBullhorn /> Campaigns
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  
  export default Sidebar;
