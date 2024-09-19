import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
// import Amiri from "./fonts/Amiri-Regular.ttf"
export function createTableDoc(head: RowInput[], body: RowInput[]) {
  const doc = new jsPDF("p", "pt", "letter");
  doc.addFileToVFS("/fonts/Amiri-Regular.txt", "Amiri");
  doc.addFont("/fonts/Amiri-Regular.ttf", "Amiri", "normal");
  doc.setFont("Amiri");
  autoTable(doc, {
    head: head,
    body: body,
    margin: {
      horizontal: 20,
      vertical: 20,
    },
    headStyles: { font: "Amiri" }, // For Arabic text in the table head
    bodyStyles: { font: "Amiri" },
  });
  return doc;
}
