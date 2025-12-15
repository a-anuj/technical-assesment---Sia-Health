import clientLog from "../data/clientLog.json";

function ClientSummary() {
  const { basicHistory, medical } = clientLog;

  return (
    <div className="card">
      <h2>Client Summary</h2>
      <hr />
      {/* Basic Info */}
      <p className="clientSummaryTop"><strong>Age:</strong> {basicHistory.age}</p>
      <p><strong>Weight:</strong> {basicHistory.weightKg} kg</p>
      <p><strong>Height:</strong> {basicHistory.heightCm} cm</p>
      <p><strong>Duration of Symptoms:</strong> {basicHistory.durationOfSymptoms}</p>

      <hr style={{ margin: "12px 0", opacity: 0.2 }} />

      {/* Symptoms */}
      <p><strong>Primary Symptoms:</strong></p>
      <p>{basicHistory.primarySymptoms.join(", ")}</p>

      <p><strong>Reported Issues:</strong></p>
      <p>{basicHistory.symptomBrief.join(", ")}</p>

      <hr style={{ margin: "12px 0", opacity: 0.2 }} />

      {/* Medical Details */}
      <p><strong>Hormonal Profile:</strong></p>
      <p>FSH : FH Ratio — {medical.hormonalProfile.FSH_FH_ratio}</p>

      <p><strong>Inflammation / Lab Markers:</strong></p>
      <p>
        TGDS: {medical.inflammationMarkers.TGDS},{" "}
        Uric Acid: {medical.inflammationMarkers.uricAcid},{" "}
        Testosterone: {medical.inflammationMarkers.testosterone},{" "}
        TSH: {medical.inflammationMarkers.TSH}
      </p>

      <p><strong>Medication History:</strong></p>
      <p>{medical.medication.join(", ")}</p>
    </div>
  );
}

export default ClientSummary;
