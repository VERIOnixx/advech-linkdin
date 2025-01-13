// pages/ProspectsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";

const ProspectsPage = () => {
  const [data, setData] = useState([]);

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Status", accessor: "status" },
  ];

  // Fetch data from an API
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const formattedData = response.data.map((user) => ({
          name: user.name,
          email: user.email,
          status: "Active",
        }));
        setData(formattedData);
      })
      .catch((error) => console.error(error));
  }, []);

  // Action button logic
  const handleActionClick = (row) => {
    alert(`Action clicked for ${row.name}`);
  };

  return (
    <div className="page">
      <h2>Prospects</h2>
      <DataTable columns={columns} data={data} onButtonClick={handleActionClick} />
    </div>
  );
};

export default ProspectsPage;
