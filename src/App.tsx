import React, { useState, ChangeEvent } from "react";
import logo from "./assets/logo.png";

const BusinessCardGenerator: React.FC = () => {
  // State variables with appropriate types
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleGenerate = () => {
    // Future logic to generate a business card goes here
    console.log({ name, title, email, number });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img
          src={logo} // Replace with the actual logo path
          alt="King County 4x4 Search and Rescue"
          style={styles.logo}
        />
        <h1 style={styles.title}>King County 4x4 Search and Rescue</h1>
        <p style={styles.subtitle}>Business Card Generator</p>
      </div>

      <div style={styles.content}>
        <div style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleInputChange(setName)}
              placeholder="Enter your name"
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleInputChange(setTitle)}
              placeholder="Enter your title"
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="Enter your email"
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="number">Number:</label>
            <input
              id="number"
              type="tel"
              value={number}
              onChange={handleInputChange(setNumber)}
              placeholder="Enter your number"
            />
          </div>
          <button style={styles.button} onClick={handleGenerate}>
            Generate
          </button>
        </div>

        <div style={styles.preview}>
          {/* Preview layout will be here */}
        </div>
      </div>
    </div>
  );
};

// Define styles with a strict typing for CSS properties
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    width: "100vw", // Ensure the container spans the full viewport width
    height: "100vh", // Optional, if you want to take up the entire screen height
    boxSizing: "border-box", // Prevent padding/margin overflow
    overflow: "hidden", // Fix any unexpected content overflow
  },
  header: {
    textAlign: "center",
    marginTop: "-250px",
    marginBottom: "30px",
    width: "100%", // Ensure the header spans full width
  },
  logo: {
    width: "200px",
    height: "auto",
    marginBottom: "-40px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "32px",
  },
  subtitle: {
    fontSize: "24px",
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%", // Ensure it uses the full width of the container
    maxWidth: "1200px", // Optional: Cap width for aesthetic reasons
    justifyContent: "space-between", // Distribute child elements
    alignItems: "flex-start", // Align items at the top
    boxSizing: "border-box", // Prevent extra padding shrinkage
  },
  
  form: {
    flex: "1 1 45%", // Ensure it takes up 45% of the container but can shrink/grow
    padding: "20px",
    borderRight: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxSizing: "border-box", // Include padding in width calculation
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  preview: {
    flex: "1 1 45%", // Ensure it takes up 45% of the container but can shrink/grow
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
    boxSizing: "border-box", // Include padding in width calculation
  },
};


export default BusinessCardGenerator;
