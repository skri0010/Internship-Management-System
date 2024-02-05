<!-- This is the Employer Chart By industry Displayed on Dashboard

  @author Suchit Krishna <skri0010@student.monash.edu>
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<template>
  <Bar :chart-options="chartOptions" :chart-data="chartData" />
</template>
  
  <script>
import { Bar } from "vue-chartjs/legacy";
import { axiosConfig } from "../../axiosConfig";
import store from "../../store";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
  components: {
    Bar,
  },
  props: {
    sectorData: { type: Object, required: true },
    options: { type: Object, required: true },
  },
  data() {
    return {
      chartData: this.sectorData,
      chartOptions: this.options,
    };
  },
  methods: {},
  // Actions to take on load
  async mounted() {
    let axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase()
    );
    // Data to replace in the instance of the chart
    let newData = {
      labels: [
        "Computer/IT",
        "Engineering",
        "Sales/Marketing",
        "Consulting",
        "Services",
        "Healthcare",
        "Accounting/Finance",
        "Hospitality",
        "Retail",
        "Pharmacy",
        "Building/Construction",
        "Banking",
      ],
      //Setting dataset rules
      datasets: [
        {
          label: "",
          backgroundColor: "#f87979",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    };
    // Options common to the graph
    let newOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };
    // Call industry data and reset the chart 
    await axiosInstance
      .get(process.env.VUE_APP_BACKEND_LINK + "admin/app")
      .then((response) => {
        let employers = response.data.rows;
        for (let i = 0; i < employers.length; i++) {
          for (let j = 0; j < newData.labels.length; j++) {
            if (employers[i].status === "APPROVED") {
              if (employers[i].employerIndustry === newData.labels[j]) {
                newData.datasets[0].data[j] += 1;
              }
            }
          }
        }
        //Set the data
        this.chartData = newData;
        this.chartOptions = newOptions;
      });
  },
};
</script>
  