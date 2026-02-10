import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQuotePDF = async (quoteData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `quote_${Date.now()}.pdf`;
      const publicPath = path.join(__dirname, "../public/quotes");
      
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true });
      }
      
      const filePath = path.join(publicPath, filename);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc
        .fillColor("#1A1A1A")
        .rect(0, 0, 612, 100)
        .fill();

      doc
        .fillColor("#C9A961")
        .fontSize(25)
        .text("AYOUB FLOORING", 50, 40, { align: "left" });

      doc
        .fillColor("#FFFFFF")
        .fontSize(10)
        .text("Premium Hardwood & LVP Solutions", 50, 70);

      doc
        .fillColor("#FFFFFF")
        .fontSize(12)
        .text("OFFICIAL QUOTE", 0, 45, { align: "right", margin: 50 });

      // Body
      doc.moveDown(5);
      doc.fillColor("#333333");

      // Customer Info
      doc.fontSize(18).text("Project Estimate", 50, 150);
      doc.rect(50, 175, 512, 2).fill("#C9A961");

      doc.fontSize(12).moveDown(2);
      doc.text(`Customer: ${quoteData.firstName || ""} ${quoteData.lastName || ""}`);
      doc.text(`Email: ${quoteData.email}`);
      doc.text(`Project Type: ${quoteData.projectType.toUpperCase()}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);

      doc.moveDown(2);

      // Details
      doc.fontSize(14).text("Detailed Breakdown", { underline: true });
      doc.moveDown();

      doc.fontSize(11);
      if (quoteData.floorDetails && quoteData.floorDetails.sqft) {
        doc.text(`Floor Area: ${quoteData.floorDetails.sqft} sqft`);
        doc.text(`Rooms: ${quoteData.floorDetails.roomCount || 1}`);
        doc.text(`Material: ${quoteData.floorDetails.material || "LVP"}`);
        doc.text(`Grade: ${quoteData.floorDetails.grade || "Standard"}`);
        doc.moveDown();
      }

      if (quoteData.stairDetails && quoteData.stairDetails.steps) {
        doc.text(`Stair Steps: ${quoteData.stairDetails.steps}`);
        doc.text(`Landings: ${quoteData.stairDetails.landings || 0}`);
        doc.text(`Box Steps: ${quoteData.stairDetails.boxSteps || 0}`);
        doc.moveDown();
      }

      // Total
      doc.moveDown(2);
      doc.rect(300, doc.y, 262, 50).fill("#F9F9F9");
      doc.fillColor("#1A1A1A").fontSize(14).text("ESTIMATED TOTAL:", 320, doc.y + 15);
      doc.fillColor("#C9A961").fontSize(20).text(`$${quoteData.totalEstimate.toLocaleString()}`, 450, doc.y - 5);

      // Footer
      doc.moveDown(4);
      doc.fillColor("#666666").fontSize(10).text(
        "Note: This is a preliminary estimate based on the information provided online. Final pricing will be confirmed after a free in-home consultation.",
        { align: "center", width: 512 }
      );

      doc.end();

      stream.on("finish", () => {
        resolve(`/quotes/${filename}`);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
