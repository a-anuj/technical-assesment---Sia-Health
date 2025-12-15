function Navbar({ onRunCheck1, onRunCheck2 }) {
  return (
    <div className="navbar">
      <h1 className="navbar-title">Health Coach Dashboard</h1>

      <div className="navbar-actions">
        <button onClick={onRunCheck1}>Run Check 1</button>
        <button onClick={onRunCheck2}>Run Check 2</button>
      </div>
    </div>
  );
}

export default Navbar;
