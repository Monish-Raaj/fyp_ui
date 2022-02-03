<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-row
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        "
      >
        <div v-if="!responseData" class="animate__animated animate__zoomInUp">
          <v-card
            elevation="2"
            light
            outlined
            shaped
            max-width="1000"
            min-width="1000"
            class="pa-10 ma-10"
          >
            <v-card-title>
              Amazon Review Analyzer
              <v-rating
                :value="5"
                color="amber"
                dense
                half-increments
                readonly
                size="20"
                class="ml-2"
              ></v-rating
            ></v-card-title>

            <v-card-text>
              <v-row align="center" class="mx-0">
                <v-text-field
                  label="Amazon Review URL"
                  :rules="rules"
                  hide-details="auto"
                  v-model="url"
                ></v-text-field>
                <v-btn
                  elevation="2"
                  large
                  raised
                  color="purple"
                  @click="submit()"
                  class="ml-5"
                  :loading="loading"
                  dark
                  >Analyze
                  <v-icon dark> mdi-arrow-right </v-icon>
                </v-btn>
              </v-row>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
          </v-card>
        </div>
        <div v-else class="animate__animated animate__backInDown">
          <v-spacer></v-spacer>
          <v-card elevation="2" light outlined shaped class="pa-10 ma-10">
            <v-card-title>
              <h1 class="text-center" style="width: 100%">Review Analysis</h1>
            </v-card-title>
            <v-divider color="red"></v-divider>
            <v-container class="grey lighten-5">
              <v-row justify="center">
                <v-col cols="12" md="6" class="d-flex justify-center">
                  <div class="small">
                    <pie-chart
                      :data="chartData1"
                      :options="chartOptions"
                    ></pie-chart>
                  </div>
                </v-col>
                <v-col cols="12" md="6" class="d-flex justify-center">
                  <div class="small">
                    <pie-chart
                      :data="chartData2"
                      :options="chartOptions"
                    ></pie-chart>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-expansion-panels multiple v-model="panel">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h1>Positive Review Summary</h1>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ responseData.PosSummary }}
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h1>Negative Review Summary</h1>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ responseData.NegSummary }}
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h1>Feature Based Summary</h1>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-chip
                    class="ma-2"
                    v-for="(feature, index) in Object.keys(
                      responseData.featureSummary
                    )"
                    :key="index"
                    @click="selectFeature(feature)"
                  >
                    <b v-if="selectedFeature === feature">{{ feature }}</b>
                    <span v-else>{{ feature }}</span>
                  </v-chip>
                  <!-- <div id="card">
                    <div id="chart">
                      <apexchart
                        type="radialBar"
                        height="350"
                        :options="chartOptions"
                        :series="[75]"
                      ></apexchart>
                    </div>
                  </div> -->
                  <v-simple-table v-if="selectedFeature">
                    <apexchart
                      width="500"
                      type="radialBar"
                      :options="apexChartOptions.chartOptions"
                      :series="apexChartOptions.series"
                    ></apexchart>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <!-- <th class="text-left"><h1>Reviews with selected feature</h1></th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(review, index) in responseData.featureSummary[
                            selectedFeature
                          ].reviews"
                          :key="index"
                        >
                          <td>
                            <div v-html="'<br/>' + review + '<br/><br/>'"></div>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
          <v-spacer></v-spacer>
        </div>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import PieChart from "./PieChart.js";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "App",

  components: {
    PieChart,
    apexchart: VueApexCharts,
  },

  data: () => ({
    url: null,
    rules: [(value) => !!value || "Required."],
    loading: false,
    selectedFeature: null,
    responseData: null,
    chartOptions: {
      responsive: true,
      legend: {
        display: true,
      },
    },
    chartData1: require("./chart1Init.json"),
    chartData2: require("./chart1Init.json"),
    panel: [0, 1, 2],
    apexChartOptions: {
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        labels: ["Percent"],

        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 0,
              size: "70%",
              background: "#fff",
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: "front",
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24,
              },
            },
            track: {
              background: "#fff",
              strokeWidth: "67%",
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35,
              },
            },

            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: true,
                color: "#888",
                fontSize: "17px",
              },
              value: {
                formatter: function (val) {
                  return parseInt(val);
                },
                color: "#111",
                fontSize: "36px",
                show: true,
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#ABE5A1"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },

        stroke: {
          lineCap: "round",
        },
      },
      series: [30],
    },
  }),
  methods: {
    async submit() {
      try {
        this.loading = true;
        let res = {};
        res.data = require("./res.json");

        if (parseInt(res.data.Fake) > parseInt(res.data.Real)) {
          let temp = res.data.Fake;
          res.data.Fake = res.data.Real;
          res.data.Real = temp;
        }
        for (let feature in res.data["featureSummary"]) {
          let temp = [];
          for (let review of res.data["featureSummary"][feature]["reviews"]) {
            temp.push(
              this.getHighlightedText(
                this.getHighlightedText(review, feature.split(" ")[0]),
                feature.split(" ")[1]
              )
            );
          }
          res.data["featureSummary"][feature]["reviews"] = temp;
        }
        this.responseData = res.data;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
    selectFeature(feature) {
      this.selectedFeature = feature;
      let { positiveCount, negativeCount } =
        this.responseData.featureSummary[feature];
        console.log(positiveCount,negativeCount);
      if (positiveCount + negativeCount == 0) this.series = [0];
      else this.series = [parseInt((positiveCount / (positiveCount + negativeCount))*100)];
      console.log(parseInt((positiveCount / (positiveCount + negativeCount))*100))
    },
    getHighlightedText(text, highlight) {
      // Split on highlight term and include term into parts, ignore case
      let parts = text.split(new RegExp(`(${highlight})`, "gi"));
      return parts
        .map((part) =>
          part.toLowerCase() === highlight.toLowerCase()
            ? `<b style="background-color:yellow">${part}</b>`
            : part
        )
        .join("");
    },
  },
};
</script>

<style scoped>
/* #app {
  background: url(./assets/bg.jpeg) no-repeat center center fixed !important;
  background-size: cover;
} */

.small {
  max-width: 400px;
  margin: 10px;
}
</style>
