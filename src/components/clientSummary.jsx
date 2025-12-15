import clientLog from "../data/clientLog.json";

function ClientSummary() {
  const { basicHistory } = clientLog;

  return (
    <div className="card">
      <h2>Client Summary</h2>

      <p><strong>Age:</strong> {basicHistory.age}</p>
      <p><strong>Weight:</strong> {basicHistory.weightKg} kg</p>
      <p><strong>Height:</strong> {basicHistory.heightCm} cm</p>
      <p><strong>Symptoms:</strong> {basicHistory.primarySymptoms.join(", ")}</p>
      <p><strong>Duration:</strong> {basicHistory.durationOfSymptoms}</p>
    </div>
  );
}

export default ClientSummary;
