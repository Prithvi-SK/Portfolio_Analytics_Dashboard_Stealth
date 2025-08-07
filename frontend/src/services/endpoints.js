import { get } from "./apiClient";
import { post } from "./apiClient";



export const getSummary = async () => {
  return get("/api/portfolio/summary");
};

export const getSectorAllocation = async () => {
  return get("/api/portfolio/sector-allocation");
};

export const getMarketCapAllocation = async () => {
  return get("/api/portfolio/market-cap");
};

export const getHoldings = async () => {
  return get("/api/portfolio/holdings");
};

export const getHistoricalPerformance = async () => {
  return get("/api/portfolio/historical-performance");
};

export const getTopPerformers = async () => {
  return get("/api/portfolio/top-performers");
};