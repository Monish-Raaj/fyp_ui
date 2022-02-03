<template>
  <v-app>
    <v-app-bar app color="primary" dark class="navbar-custom-bg">
      <v-btn
        elevation="3"
        large
        raised
        color="purple"
        @click="responseData = ''"
        class="ml-5"
        dark
        v-if="responseData"
      >
        <v-icon dark> mdi-arrow-left </v-icon>
      </v-btn>
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
        <div
          v-if="!responseData && !loading"
          class="animate__animated animate__zoomInUp"
          style="
            margin: 0;
            position: absolute;
            top: 50%;
            -ms-transform: translateY(-50%);
            transform: translateY(-50%);
          "
        >
          <v-card
            elevation="3"
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
                  elevation="3"
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
        <div
          v-if="loading"
          class="animate__animated animate__zoomInUp"
          style="
            margin: 0;
            position: absolute;
            top: 50%;
            -ms-transform: translateY(-50%);
            transform: translateY(-50%);
          "
        >
          <img
            alt=""
            width="700"
            height="249"
            role="presentation"
            src="https://miro.medium.com/max/700/1*CsJ05WEGfunYMLGfsT2sXA.gif"
            srcset="
              https://miro.medium.com/max/276/1*CsJ05WEGfunYMLGfsT2sXA.gif 276w,
              https://miro.medium.com/max/552/1*CsJ05WEGfunYMLGfsT2sXA.gif 552w,
              https://miro.medium.com/max/640/1*CsJ05WEGfunYMLGfsT2sXA.gif 640w,
              https://miro.medium.com/max/700/1*CsJ05WEGfunYMLGfsT2sXA.gif 700w
            "
            sizes="700px"
          />
        </div>
        <div
          v-if="!loading && responseData"
          class="animate__animated animate__backInDown"
        >
          <v-spacer></v-spacer>
          <v-card elevation="3" light outlined shaped class="pa-10 ma-10">
            <v-card-title>
              <h1 class="text-center" style="width: 100%">Review Analysis</h1>
            </v-card-title>
            <v-divider color="red"></v-divider>
            <v-container class="grey lighten-5">
              <v-row justify="center" v-if="responseData">
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
                <v-expansion-panel-content class="pa-5">
                  {{ responseData.PosSummary }}
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h1>Negative Review Summary</h1>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-5">
                  {{ responseData.NegSummary }}
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h1>Feature Based Summary</h1>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-5">
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
                  <v-row>
                    <v-spacer></v-spacer>
                  <apexchart
                    width="500"
                    type="radialBar"
                    :options="apexChartOptions.chartOptions"
                    :series="apexChartOptions.series"
                    v-if="selectedFeature"
                  ></apexchart>
                    <v-spacer></v-spacer>

                  </v-row>
                  <v-simple-table v-if="selectedFeature">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">
                            <h1>Reviews with selected feature</h1>
                          </th>
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
    chartKey: 0,
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
    chartData2: require("./chart2Init.json"),
    panel: [0, 1, 2],
    apexChartOptions: {
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        labels: ["Score"],

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
        let res = await this.$http.get(`/db?url=${this.url}`);
        // res.data = require("./res.json");

        this.chartData2.datasets[0].data[0] = res.data.PosCount
        this.chartData2.datasets[0].data[1] = res.data.NegCount
        if (parseInt(res.data.Fake) > parseInt(res.data.Real)) {
          let temp = res.data.Fake;
          res.data.Fake = res.data.Real;
          res.data.Real = temp;
        }

        this.chartData1.datasets[0].data[0] = res.data.Fake
        this.chartData1.datasets[0].data[1] = res.data.Real
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
      console.log(positiveCount, negativeCount);
      if (positiveCount + negativeCount == 0)
        this.apexChartOptions.series = [0];
      else
        this.apexChartOptions.series = [
          parseInt((positiveCount / (positiveCount + negativeCount)) * 100),
        ];
      console.log(
        parseInt((positiveCount / (positiveCount + negativeCount)) * 100)
      );

      this.chartKey = this.chartKey === 0 ? 1 : 0;
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
#app {
  background-color: #e5e5f7;
  opacity: 0.8;
  background: linear-gradient(135deg, #d9dbfd55 25%, transparent 25%) -10px 0/
      20px 20px,
    linear-gradient(225deg, #d9dbfd 25%, transparent 25%) -10px 0/ 20px 20px,
    linear-gradient(315deg, #d9dbfd55 25%, transparent 25%) 0px 0/ 20px 20px,
    linear-gradient(45deg, #d9dbfd 25%, #e5e5f7 25%) 0px 0/ 20px 20px;
}

.small {
  max-width: 400px;
  margin: 10px;
}

.navbar-custom-bg {
  background-image: linear-gradient(
      45deg,
      rgba(134, 205, 255, 0.82),
      rgb(0, 110, 253)
    ),
    url("https://www.elegantthemes.com/blog/wp-content/uploads/2017/05/design-review.png");
}
</style>
