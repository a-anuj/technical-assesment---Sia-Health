import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Dashboard</h1>
      <div className="card">
        <p>
          Hello World!
        </p>
      </div>
    </>
  )
}

export default App
