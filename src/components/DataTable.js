import React from "react";
// import { useTable } from "react-table";


const DataTable = ({ columns, data, onButtonClick }) => {
    return (
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.Header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.accessor}>{row[col.accessor]}</td>
              ))}
              <td>
                <button onClick={() => onButtonClick(row)}>Action</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default DataTable;