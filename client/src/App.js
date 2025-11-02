import './App.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function App() {
  // React state (for form fields)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(0);
  const [position, setPosition] = useState("");
  const [ctc, setCtc] = useState(0);
  const [newCtc, setNewCtc] = useState(0);
  
  // React state for employee list
  const [employeeList, setEmployeeList] = useState([]);
  const [notification, setNotification] = useState({ message: "", isVisible: false });

  // Add employee
  const addEmployee = () => {
    Axios.post('http://localhost:3001/create', { 
      name, email, age, position, ctc 
    })
      .then(() => {
        setEmployeeList([...employeeList, { name, email, age, position, ctc }]);
        setNotification({ message: "✅ Employee Added Successfully!", isVisible: true });
      })
      .catch((err) => console.error(err));
  };

  // Get employees
  const getEmployees = () => {
    Axios.get('http://localhost:3001/employees')
      .then((response) => setEmployeeList(response.data))
      .catch((err) => console.error(err));
  };

  // Update CTC
  const updateCtc = (id) => {
    Axios.put('http://localhost:3001/update', { ctc: newCtc, id })
      .then(() => {
        setEmployeeList(employeeList.map((val) => {
          return val.id === id
            ? { ...val, ctc: newCtc }
            : val;
        }));
      })
      .catch((err) => console.error(err));
  };

  // Delete employee
  const deleteEmployee = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        setEmployeeList(employeeList.filter((val) => val.id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Auto-hide notification
  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        setNotification({ message: "", isVisible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="App">
      <h1>👩‍💼 Employee Management System</h1>

      <div className="info-section">
        <div className={`notification ${notification.isVisible ? 'show' : ''}`}>
          {notification.message}
        </div>

        <div className="form-container">
          <label>Name</label>
          <input type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)} />

          <label>Email</label>
          <input type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />

          <label>Age</label>
          <input type="number" placeholder="Enter age" onChange={(e) => setAge(e.target.value)} />

          <label>Position</label>
          <input type="text" placeholder="Enter position" onChange={(e) => setPosition(e.target.value)} />

          <label>CTC</label>
          <input type="number" placeholder="Enter CTC" onChange={(e) => setCtc(e.target.value)} />

          <button className="btn add" onClick={addEmployee}>Add Employee</button>
        </div>
      </div>

      <div className="emplBtn">
        <button className="btn show" onClick={getEmployees}>Show All Employees</button>
      </div>

      <div className="employee-list">
        {employeeList.map((val, key) => (
          <div className="employee-card" key={key}>
            <h3>{val.name}</h3>
            <p><strong>Email:</strong> {val.email}</p>
            <p><strong>Age:</strong> {val.age}</p>
            <p><strong>Position:</strong> {val.position}</p>
            <p><strong>CTC:</strong> {val.ctc}</p>

            <div className="actions">
              <input
                type="number"
                placeholder="Update CTC..."
                onChange={(e) => setNewCtc(e.target.value)}
              />
              <button className="btn update" onClick={() => updateCtc(val.id)}>Update</button>
              <button className="btn delete" onClick={() => deleteEmployee(val.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
