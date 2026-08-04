import "./ReportTable.css";
import ReportRow from "./ReportRow";

// Automatically import PDF files from src/assets/reports/
const pdfFiles = import.meta.glob("../../assets/reports/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
});

// Helper to format raw filenames into presentable titles
function formatReportTitle(filename) {
  return filename
    .replace(/\.pdf$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const reports = Object.entries(pdfFiles)
  .map(([path, url]) => {
    const rawName = path.split("/").pop() || "";
    return {
      name: formatReportTitle(rawName),
      rawName,
      url,
    };
  })
  .sort((a, b) => b.rawName.localeCompare(a.rawName));

export default function ReportTable() {
  return (
    <section className="reports-table">
      <div className="reports-table-wrapper">
        <div className="table-head">
          <span>Name</span>
          <span>Type</span>
          <span>Action</span>
        </div>

        {reports.length > 0 ? (
          reports.map((report, index) => (
            <ReportRow key={report.url || index} report={report} />
          ))
        ) : (
          <div className="reports-empty">No reports available at the moment.</div>
        )}
      </div>
    </section>
  );
}