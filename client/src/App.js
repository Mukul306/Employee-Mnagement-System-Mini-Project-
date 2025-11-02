import './App.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function App() {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [position, setPosition] = useState("");
  const [ctc, setCtc] = useState("");

  // For tracking update mode
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Employee data + notifications
  const [employeeList, setEmployeeList] = useState([]);
  const [notification, setNotification] = useState({ message: "", isVisible: false });

  // ✅ Fetch all employees
  const getEmployees = () => {
    Axios.get("http://localhost:3001/employees")
      .then((res) => setEmployeeList(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // ✅ Add new employee
  const addEmployee = () => {
    if (!name || !email || !position || !age || !ctc) {
      alert("Please fill all fields before adding!");
      return;
    }

    Axios.post("http://localhost:3001/create", { name, email, age, position, ctc })
      .then(() => {
        setNotification({ message: "✅ Employee Added Successfully!", isVisible: true });
        clearForm();
        getEmployees();
      })
      .catch((err) => console.error(err));
  };

  // ✅ Prepare form for editing
  const editEmployee = (employee) => {
    setIsEditing(true);
    setEditId(employee._id);
    setName(employee.name);
    setEmail(employee.email);
    setAge(employee.age);
    setPosition(employee.position);
    setCtc(employee.ctc);
  };

  // ✅ Update employee (all fields)
  const updateEmployee = () => {
    if (!editId) return;
    Axios.put("http://localhost:3001/update", {
      id: editId,
      name,
      email,
      age,
      position,
      ctc,
    })
      .then(() => {
        setNotification({ message: "🟡 Employee Updated Successfully!", isVisible: true });
        clearForm();
        setIsEditing(false);
        setEditId(null);
        getEmployees();
      })
      .catch((err) => console.error(err));
  };

  // ✅ Delete employee
  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      Axios.delete(`http://localhost:3001/delete/${id}`)
        .then(() => {
          setNotification({ message: "🗑️ Employee Deleted Successfully!", isVisible: true });
          getEmployees();
        })
        .catch((err) => console.error(err));
    }
  };

  // ✅ Auto-hide notifications
  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        setNotification({ message: "", isVisible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ✅ Clear form
  const clearForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setPosition("");
    setCtc("");
  };

  return (
    <div className="App">
      <h1>👩‍💼 Employee Management System</h1>

      <div className="info-section">
        <div className={`notification ${notification.isVisible ? "show" : ""}`}>
          {notification.message}
        </div>

        <div className="form-container">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Age</label>
          <input
            type="number"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <label>Position</label>
          <input
            type="text"
            placeholder="Enter position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <label>CTC</label>
          <input
            type="number"
            placeholder="Enter CTC"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
          />

          {isEditing ? (
            <>
              <button className="btn update" onClick={updateEmployee}>
                💾 Update Employee
              </button>
              <button
                className="btn cancel"
                onClick={() => {
                  clearForm();
                  setIsEditing(false);
                }}
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <button className="btn add" onClick={addEmployee}>
              ➕ Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="employee-list">
        {employeeList.map((val, key) => (
          <div className="employee-card" key={key}>
            <h3>{val.name}</h3>
            <p><strong>Email:</strong> {val.email}</p>
            <p><strong>Age:</strong> {val.age}</p>
            <p><strong>Position:</strong> {val.position}</p>
            <p><strong>CTC:</strong> ₹{val.ctc}</p>

            <div className="actions">
              <button className="btn edit" onClick={() => editEmployee(val)}>✏️ Edit</button>
              <button className="btn delete" onClick={() => deleteEmployee(val._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
