import React, { useState, ChangeEvent } from "react";
import logo from "./assets/logo.png";
import { saveAs } from 'file-saver'; 
import { GenerateCard } from "./components/GenerateCard";
import { CreateAvery5371Sheet } from './components/Avery5371';

const BusinessCardGenerator: React.FC = () => {
  // State variables with appropriate types
  const [name, setName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [previewPdf, setPreviewPdf] = useState<string>("");
  const [templateType, setTemplateType] = useState<string>("template");



  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

    const handlePreview = async () => {
      const cardBytes = await GenerateCard(name, title, email, number);
    
      // Convert card bytes to Base64 string
      const base64Pdf = await toBase64(cardBytes);
    
      // Embed Base64 as data URL (including prefix)
      const previewUrl = `data:application/pdf;base64,${base64Pdf}`;
      setPreviewPdf(previewUrl); // Update preview with the generated PDF
    };
    
    const toBase64 = (pdfBytes: Uint8Array): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Reader result should give base64 without the "data:" part
          const base64Content = reader.result as string;
          const base64Only = base64Content.split(',')[1]; 
          resolve(base64Only);
        };
        reader.readAsDataURL(new Blob([pdfBytes]));
      });
    };
    
    const handleGenerateAction = async () => {
      const cardBytes = await GenerateCard(name, title, email, number);
    
      if (templateType === "template") {
        const blob = new Blob([cardBytes], { type: 'application/pdf' });
        saveAs(blob, 'BusinessCard.pdf');
      } else if (templateType === "avery5371") {
        await CreateAvery5371Sheet(cardBytes);
      }
    };


  const handleGenerate = async () => {
    const cardBytes = await GenerateCard(name, title, email, number);

      // Trigger a download using'file-saver' library
    const blob = new Blob([cardBytes], { type: 'application/pdf' });
    saveAs(blob, 'BusinessCard.pdf');  // prompt user to download file
  };

  const handleGenerateSheet = async () => {
    // Generate a card as a template
    const cardBytes = await GenerateCard(name, title, email, number);
    
    // Pass the cardBytes to CreateAvery5371Sheet
    await CreateAvery5371Sheet(cardBytes);
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
  
  {/* Preview Button */}
  <button style={styles.button} onClick={handlePreview}>
    Preview
  </button>

  {/* Dropdown and Generate Button on Same Row */}
  <div style={styles.row}>
    <div style={styles.rowItem}>
      <label htmlFor="templateType">Template Type:</label>
      <select
        id="templateType"
        value={templateType}
        onChange={(e) => setTemplateType(e.target.value)}
        style={{ width: "100%" }} // Makes the dropdown fill its container
      >
        <option value="template">Template</option>
        <option value="avery5371">Avery 5371</option>
      </select>
    </div>
    <div style={styles.rowItem}>
      <button style={styles.button} onClick={handleGenerateAction}>
        Generate
      </button>
    </div>
  </div>

</div>

{/* Preview Section Remains on Right Side */}
<div style={styles.preview}>
  {previewPdf ? (
    <iframe
      src={previewPdf}
      width="100%"
      height="500px"
      title="PDF Preview"
    />
  ) : (
    <p>No preview available. Generate a card first.</p>
  )}
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
    width: "100vw",
    height: "100vh",
    boxSizing: "border-box",
    overflowY: "auto", // Ensures the page is scrollable without jumping
  },
  header: {
    textAlign: "center",
    marginTop: "120px",
    marginBottom: "30px",
    width: "100%",
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
    width: "100%",
    maxWidth: "1200px",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxSizing: "border-box",
  },
  form: {
    flex: "1 1 45%",
    padding: "20px",
    borderRight: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxSizing: "border-box",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  preview: {
    flex: "1 1 45%",
    padding: "1px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
    height: "500px",  // Ensure consistent height
    overflowY: "auto", // Allows for scrolling within preview if necessary
    boxSizing: "border-box",
  },
  // Button styling
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  row: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    width: "100%",
    justifyContent: "space-between",
  },
  rowItem: {
    flex: "1 1 48%",
    minWidth: "140px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};


export default BusinessCardGenerator;
