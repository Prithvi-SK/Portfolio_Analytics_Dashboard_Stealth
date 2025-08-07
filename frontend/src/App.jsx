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
		<Portfolio />
  )
}

export default App
