import "./sidebar.js";

const chartTargets = ["salesPurchaseChart", "customerChart", "salesChart"];

const loadChartsIfNeeded = () => {
	const needsCharts = chartTargets.some((id) => document.getElementById(id));

	if (needsCharts) {
		import("./chart.js");
	}
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", loadChartsIfNeeded);
} else {
	loadChartsIfNeeded();
}