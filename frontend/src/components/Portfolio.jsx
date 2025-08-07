import Overview from "./Overview";
import AssetAllocation from "./AssetAllocation";
import Holdings from "./Holdings";
import PerformanceComparison from "./PerformanceComparison";
import TopPerformers from "./TopPerformers";

function Portfolio(){
    return(
        <div>
            <h2>Portfolio Dashboard</h2>
            <Overview />
            <AssetAllocation />
            <Holdings />
            <PerformanceComparison />
            <TopPerformers />
        </div>
    );
}

export default Portfolio;