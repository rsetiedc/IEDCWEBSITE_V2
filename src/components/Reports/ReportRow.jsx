import "./ReportRow.css";
import { FiFileText, FiDownload } from "react-icons/fi";

export default function ReportRow({ report }) {
  return (
    <div className="report-row">
      <div className="report-info">
        <div className="report-icon" aria-hidden="true">
          <FiFileText />
        </div>
        <span className="report-name">{report.name}</span>
      </div>

      <div className="report-type">PDF</div>

      <a
        href={report.url}
        download
        className="download-btn"
        aria-label={`Download ${report.name}`}
      >
        <FiDownload />
        <span>Download</span>
      </a>
    </div>
  );
}