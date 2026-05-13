import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Results from "./Results";
import PublicAudit from "./PublicAudit";

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