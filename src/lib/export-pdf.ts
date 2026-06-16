import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportToPDF = async (elementId: string, filename: string = "document.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for PDF export");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL("image/png");
    
    // A4 size: 210 x 297 mm
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error("Failed to generate PDF", error);
    return false;
  }
};
