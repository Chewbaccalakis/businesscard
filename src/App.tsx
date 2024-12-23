import React, { useState, ChangeEvent } from "react";
import logo from "./assets/logo.png";
import { saveAs } from 'file-saver';
import { GenerateCard } from "./components/GenerateCard";
import { CreateAvery5371Sheet } from './components/Avery5371';
import { AddBackside } from './components/AddBackside';
import { GenericFront } from './components/GenericFront';

const BusinessCardGenerator: React.FC = () => {
  // State variables with appropriate types
  const [name, setName] = useState<string>("");
  const [Line1, setLine1] = useState<string>("");
  const [Line2, setLine2] = useState<string>("");
  const [Line3, setLine3] = useState<string>("");
  const [Line4, setLine4] = useState<string>("");
  const [Line5, setLine5] = useState<string>("");
  const [Line6, setLine6] = useState<string>("");
  const [previewPdf, setPreviewPdf] = useState<string>("");
  const [templateType, setTemplateType] = useState<string>("null");
  const [cardType, setCardType] = useState<string>("custom");
  const [backside, setBackSide] = useState<string>("none")


  const CardTypeConfig = async (
    cardType: string,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setLine1: React.Dispatch<React.SetStateAction<string>>,
    setLine2: React.Dispatch<React.SetStateAction<string>>,
    setLine3: React.Dispatch<React.SetStateAction<string>>,
    setLine4: React.Dispatch<React.SetStateAction<string>>,
    setLine5: React.Dispatch<React.SetStateAction<string>>,
    setLine6: React.Dispatch<React.SetStateAction<string>>) => {
    if (cardType === "generic") {

      const data = await GenericFront();  // Get data from the external function

      // Directly set the state with returned values
      setName(data.Name);
      setLine1(data.Line1);
      setLine2(data.Line2);
      setLine3(data.Line3);
      setLine4(data.Line4);
      setLine5(data.Line5);
      setLine6(data.Line6);

    } else if (cardType === "custom") {

      setName("");
      setLine1("");
      setLine2("");
      setLine3("");
      setLine4("");
      setLine5("");
      setLine6("");
    }
  };

  const nonebuttonstyle = backside === "none"
    ? { backgroundColor: "orange", ...styles.backbutton }
    : { backgroundColor: "gray", ...styles.backbutton };

  const essentialsButtonStyle = backside === "essentials"
    ? { backgroundColor: "orange", ...styles.backbutton }
    : { backgroundColor: "gray", ...styles.backbutton };

  const QRCodeButtonStyle = backside === "qrcode"
    ? { backgroundColor: "orange", ...styles.backbutton }
    : { backgroundColor: "gray", ...styles.backbutton };

  const genericcardstyle = cardType === "generic"
    ? { backgroundColor: "orange", ...styles.backbutton }
    : { backgroundColor: "gray", ...styles.backbutton };

  const customcardStyle = cardType === "custom"
    ? { backgroundColor: "orange", ...styles.backbutton }
    : { backgroundColor: "gray", ...styles.backbutton };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
      };

  const generateCardBytes = async (
    name: string,
    cardType: string,
    Line1: string,
    Line2: string,
    Line3: string,
    Line4: string,
    Line5: string,
    Line6: string,
    backside: any
  ): Promise<Uint8Array> => {
    // Generate the frontside PDF
    const frontside = await GenerateCard(name, cardType, Line1, Line2, Line3, Line4, Line5, Line6);

    // Add backside if required
    let cardBytes: Uint8Array = frontside;
    if (backside !== "none") {
      console.log("Adding backside");
      // Combine frontside and backside (this might involve appending pages or merging PDFs)
      cardBytes = await AddBackside(frontside, backside);  // Assuming AddBackside adds the backside correctly
    }
    return cardBytes;
  };


  const handlePreview = async () => {
    const cardBytes = await generateCardBytes(name, cardType, Line1, Line2, Line3, Line4, Line5, Line6, backside);

    // Convert the PDF to base64
    const base64Pdf = await toBase64(cardBytes);

    // Set the base64-encoded PDF URL for preview
    const previewUrl = `data:application/pdf;base64,${base64Pdf}`;
    setPreviewPdf(previewUrl);
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
    if (templateType === "null") {
      alert("Please select a template type.");
      return; // Exit the function to prevent further code from running
    }

    const cardBytes = await generateCardBytes(name, cardType, Line1, Line2, Line3, Line4, Line5, Line6, backside);

    // Handle the template type
    if (templateType === "template") {
      const blob = new Blob([cardBytes], { type: "application/pdf" });
      saveAs(blob, "BusinessCard.pdf");
    } else if (templateType === "avery5371") {
      await CreateAvery5371Sheet(cardBytes);
    }
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
          <div style={styles.row}>
            <div style={styles.rowItem}>
              <button style={genericcardstyle} onClick={async () => {
                setCardType("generic");
                await CardTypeConfig("generic", setName, setLine1, setLine2, setLine3, setLine4, setLine5, setLine6)
              }}>
                Generic Card
              </button>
            </div>
            <div style={styles.rowItem}></div>
            <div style={styles.rowItem}></div>
            <div style={styles.rowItem}>
              <button style={customcardStyle} onClick={async () => {
                setCardType("custom");
                await CardTypeConfig("custom", setName, setLine1, setLine2, setLine3, setLine4, setLine5, setLine6)
              }}>
                Custom Card
              </button>
            </div>
          </div>
          <div style={styles.field}>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleInputChange(setName)}
              placeholder="Enter your name"
              disabled={cardType !== "custom"}
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={Line1}
              onChange={handleInputChange(setLine1)}
              placeholder="Enter your title"
              disabled={cardType !== "custom"}
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={Line4}
              onChange={handleInputChange(setLine4)}
              placeholder="Enter your email"
              disabled={cardType !== "custom"}
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="number">Number:</label>
            <input
              id="number"
              type="tel"
              value={Line5}
              onChange={handleInputChange(setLine5)}
              placeholder="Enter your number"
              disabled={cardType !== "custom"}
            />
          </div>

          <div style={styles.rowlabel}>
              <label htmlFor="templateType">Design on backside of card?</label>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <button style={nonebuttonstyle} onClick={() => setBackSide("none")}>
                Blank
              </button>
            </div>
            <div style={styles.rowItem}>
              <button style={essentialsButtonStyle} onClick={() => setBackSide("essentials")}>
                10 Essentials
              </button>
            </div>
            <div style={styles.rowItem}>
              <button style={QRCodeButtonStyle} onClick={() => setBackSide("qrcode")}>
                QR Code
              </button>
            </div>
          </div>

          {/* Preview Button */}
          <div style={styles.row}>
            <div style={styles.rowItem}>
              <button style={{ width: "100%", ...styles.button }} onClick={handlePreview}>
                Preview
              </button>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <select
                id="templateType"
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                style={{ width: "100%", height: "100%" }} // Makes the dropdown fill its container
              >
                <option value="null">Select a Template...</option>
                <option value="template">2.5" x 3"</option>
                <option value="avery5371">Avery 5371</option>
              </select>
            </div>
            <div style={styles.rowItem}>
              <button style={{ width: "100%", ...styles.button }} onClick={handleGenerateAction}>
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
              height="600px"
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
    marginTop: "250px",
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
    height: "600px",  // Ensure consistent height
    overflowY: "hidden",
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
  backbutton: {
    padding: "10px",
    color: "white",
    fontSize: "16px",
    width: "100%",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    width: "100%",
    justifyContent: "space-between",
  },
  rowlabel: {
    marginTop: "10px",
    marginBottom: "-20px",
    fontSize: "17px",
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
