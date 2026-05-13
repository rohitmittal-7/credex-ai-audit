import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";
import PublicAudit from "./pages/PublicAudit.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/audit/:id" element={<PublicAudit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;