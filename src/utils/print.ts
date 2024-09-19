import jsPDF from "jspdf";

export async function printJsDoc(doc: jsPDF, filename: string) {
  doc.autoPrint();
  if (window.Environment == "web")
    doc.output("dataurlnewwindow", {
      filename,
    });
  else if (window.Environment == "desktop") {
    const pdfOutput = doc.output("blob");
    const arrayBuffer = await pdfOutput.arrayBuffer();
    await window.api.invoke("saveFile", Buffer.from(arrayBuffer), filename);
  }
}
