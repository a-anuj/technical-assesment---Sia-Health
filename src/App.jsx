import './App.css';
import Navbar from './components/Navbar';
import ClientSummary from './components/ClientSummary';

function App() {
  const runCheck1 = () => {
    console.log("Check 1 triggered");
  };

  const runCheck2 = () => {
    console.log("Check 2 triggered");
  };

  return (
    <>
      <Navbar onRunCheck1={runCheck1} onRunCheck2={runCheck2} />

      <div className="page-container">
        <ClientSummary />
        {/* Meal Plan + Check Results will come here */}
      </div>
    </>
  );
}

export default App;
