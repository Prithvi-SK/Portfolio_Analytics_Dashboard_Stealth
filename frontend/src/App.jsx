import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Overview from './components/Overview';
import AssetAllocation from './components/AssetAllocation';
import Holdings from './components/Holdings';
import PerformanceComparison from './components/PerformanceComparison';
import TopPerformers from './components/TopPerformers';
import Portfolio from './components/Portfolio';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/overview"	element={<Overview />} />
				<Route path="/asset-allocation"	element={<AssetAllocation />} />
				<Route path="/holdings"	element={<Holdings />} />
				<Route path="/performance-comparison"	element={<PerformanceComparison />} />
				<Route path="/top-performers"	element={<TopPerformers />} />
				<Route path="/portfolio"	element={<Portfolio />} />
      </Routes>
    </Router>
  )
}

export default App
