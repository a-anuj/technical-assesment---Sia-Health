function Navbar({ onRunCheck1, onRunCheck2 }) {
  return (
    <div className="navbar">
      <div className="navbar-title">Health Coach Dashboard</div>

      <div className="navbar-actions">
        <button type="button" onClick={onRunCheck1}>
          Run Check 1
        </button>
        <button type="button" onClick={onRunCheck2}>
          Run Check 2
        </button>
      </div>
    </div>
  );
}

export default Navbar;
