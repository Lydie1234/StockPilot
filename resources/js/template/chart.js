import ApexCharts from 'apexcharts';

const formatterCurrency = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0,
});

const toCurrency = (value) => formatterCurrency.format(Number(value) || 0);

const getMonthlySeries = (months = 12) => {
  if (window.StockPilotMock?.getMonthlySeries) {
    return window.StockPilotMock.getMonthlySeries(months);
  }

  const labels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    labels: labels.slice(-months),
    entries: [120000, 135000, 118000, 146000, 160000, 156000, 171000, 168000, 174000, 183000, 179000, 192000].slice(-months),
    outputs: [98000, 112000, 106000, 119000, 132000, 138000, 141000, 145000, 150000, 156000, 149000, 163000].slice(-months),
    statusBreakdown: {
      normal: 6,
      alert: 2,
    },
  };
};

const buildSalesPurchaseConfig = () => {
  const seriesData = getMonthlySeries(9);

  return {
    series: [
      {
        name: 'Entrees',
        data: seriesData.entries,
      },
      {
        name: 'Sorties',
        data: seriesData.outputs,
      },
    ],
    colors: ['#0d6efd', '#e2e8f0'],
    chart: {
      type: 'bar',
      height: 350,
      width: '100%',
      parentHeightOffset: 0,
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      padding: { top: 0, right: 0, bottom: 0, left: 10 },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      markers: {
        size: 6,
        shape: 'circle',
        strokeWidth: 0,
        offsetX: -2,
        offsetY: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: seriesData.labels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'k';
          }
          return value;
        },
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (value) => toCurrency(value),
      },
    },
  };
};

const buildStockSplitConfig = () => {
  const { statusBreakdown } = getMonthlySeries(6);
  const normal = Number(statusBreakdown?.normal) || 0;
  const alert = Number(statusBreakdown?.alert) || 0;
  const total = Math.max(normal + alert, 1);
  const normalPercent = Math.round((normal / total) * 100);
  const alertPercent = Math.round((alert / total) * 100);

  return {
    series: [normalPercent, alertPercent],
    chart: {
      height: 320,
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#198754', '#ffc107'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              fontSize: '14px',
              fontWeight: 500,
              color: '#64748b'
            },
            value: {
              fontSize: '24px',
              fontWeight: 700,
              color: '#1e293b'
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 500,
              color: '#64748b',
              formatter: function (w) {
                return total + " art.";
              }
            }
          }
        }
      }
    },
    stroke: {
      show: true,
      colors: '#ffffff',
      width: 4
    },
    labels: ['Stock normal', 'Sous seuil'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      markers: {
        radius: 12,
        offsetX: -4,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8
      }
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + "%";
        }
      }
    }
  };
};

const buildSalesOverviewConfig = () => {
  const seriesData = getMonthlySeries(12);

  return {
    chart: {
      id: 'sales-overview',
      type: 'area',
      height: 420,
      zoom: { enabled: false },
      toolbar: {
        show: false,
      },
    },
    colors: ['#00B8DB', '#E66239'],
    stroke: { width: [3, 2.5], curve: 'smooth' },
    markers: { size: 4, hover: { sizeOffset: 2 } },
    series: [
      { name: 'Entrees', data: seriesData.entries },
      { name: 'Sorties', data: seriesData.outputs },
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 60, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => toCurrency(value),
      },
      title: {
        text: 'Flux valorise (FCFA)',
      },
    },
    xaxis: {
      categories: seriesData.labels,
      tickPlacement: 'on',
    },
    tooltip: {
      shared: true,
      y: {
        formatter: (value) => toCurrency(value),
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 340 },
          legend: { position: 'bottom', horizontalAlign: 'center' },
        },
      },
    ],
  };
};

const initCharts = () => {
  const hasChartTargets = document.getElementById('salesPurchaseChart') || document.getElementById('customerChart') || document.getElementById('salesChart');

  if (!hasChartTargets) {
    return;
  }
  const chartInstances = {
    salesPurchase: null,
    customerSplit: null,
    salesOverview: null,
  };

  let entriesOnly = false;

  const updateChartsFromMock = () => {
    const monthly = getMonthlySeries(12);

    if (chartInstances.salesPurchase) {
      chartInstances.salesPurchase.updateOptions({
        xaxis: { categories: monthly.labels.slice(-9) },
      });
      chartInstances.salesPurchase.updateSeries([
        { name: 'Entrees', data: monthly.entries.slice(-9) },
        { name: 'Sorties', data: monthly.outputs.slice(-9) },
      ]);
    }

    if (chartInstances.customerSplit) {
      const normal = Number(monthly.statusBreakdown?.normal) || 0;
      const alert = Number(monthly.statusBreakdown?.alert) || 0;
      const total = Math.max(normal + alert, 1);
      chartInstances.customerSplit.updateSeries([
        Math.round((normal / total) * 100),
        Math.round((alert / total) * 100),
      ]);
    }

    if (chartInstances.salesOverview) {
      chartInstances.salesOverview.updateOptions({
        xaxis: {
          categories: monthly.labels,
          tickPlacement: 'on',
        },
      });

      chartInstances.salesOverview.updateSeries(
        entriesOnly
          ? [{ name: 'Entrees', data: monthly.entries }]
          : [
              { name: 'Entrees', data: monthly.entries },
              { name: 'Sorties', data: monthly.outputs },
            ],
      );
    }
  };

  if (document.getElementById('salesPurchaseChart')) {
    chartInstances.salesPurchase = new ApexCharts(
      document.querySelector('#salesPurchaseChart'),
      buildSalesPurchaseConfig(),
    );
    chartInstances.salesPurchase.render();
  }

  if (document.getElementById('customerChart')) {
    chartInstances.customerSplit = new ApexCharts(
      document.querySelector('#customerChart'),
      buildStockSplitConfig(),
    );
    chartInstances.customerSplit.render();
  }

  if (document.getElementById('salesChart')) {
    chartInstances.salesOverview = new ApexCharts(
      document.querySelector('#salesChart'),
      buildSalesOverviewConfig(),
    );
    chartInstances.salesOverview.render();

    const randomButton = document.getElementById('btn-random');
    if (randomButton) {
      randomButton.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('stockpilot:mock-reset'));
      });
    }

    const updateButton = document.getElementById('btn-update');
    if (updateButton) {
      updateButton.addEventListener('click', () => {
        entriesOnly = !entriesOnly;
        updateButton.textContent = entriesOnly
          ? 'Afficher entree + sortie'
          : 'Afficher entree seulement';
        updateChartsFromMock();
      });
    }
  }

  window.addEventListener('stockpilot:state-changed', updateChartsFromMock);
  updateChartsFromMock();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharts);
} else {
  initCharts();
}