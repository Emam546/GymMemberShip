import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
export function createTableDoc(head: RowInput[], body: RowInput[]) {
    const doc = new jsPDF("p", "pt", "letter");

    autoTable(doc, {
        head: head,
        body: body,
        margin: {
            horizontal: 20,
            vertical: 20,
        },
    });
    return doc;
}
