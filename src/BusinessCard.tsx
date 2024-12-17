import React from "react";

interface BusinessCardProps {
  name: string;
  title: string;
  email: string;
  number: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  name,
  title,
  email,
  number,
}) => {
  return (
    <div style={styles.card}>
      <h2>{name}</h2>
      <p>{title}</p>
      <p>{email}</p>
      <p>{number}</p>
    </div>
  );
};

// Styles for the business card
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "300px",
    height: "150px",
    border: "1px solid black",
    borderRadius: "5px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
};

export default BusinessCard;
