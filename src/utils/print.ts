import jsPDF from "jspdf";

export function printJsDoc(doc: jsPDF, filename: string) {
  doc.autoPrint();
  doc.output("dataurlnewwindow", {
    filename,
  });
}
