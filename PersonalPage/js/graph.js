var doughnutData = [
    {
      value: 500,
      color:"#007BFF",
      highlight: "#a7d7de",
      label: "スマートフォン"
    },
    {
      value: 150,
      color: "#DC3545",
      highlight: "#e4b68a",
      label: "PC"
    },
    {
      value: 80,
      color: "#615B5F",
      highlight: "#dcb7da",
      label: "タブレット"
    },
    {
      value: 20,
      color: "#FFC107",
      highlight: "#fcfea6",
      label: "その他デバイス"
    }
  ];
  window.onload = function(){
    var ctx = document.getElementById("chart").getContext("2d");
    window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {
      responsive : true
    });
  }