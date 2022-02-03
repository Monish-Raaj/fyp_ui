<template>
  <v-app>
    <v-app-bar app color="primary" dark class="navbar-custom-bg">
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
                  >
                    {{ feature }}
                  </v-chip>
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

export default {
  name: "App",

  components: {
    PieChart,
  },

  data: () => ({
    url: null,
    rules: [(value) => !!value || "Required."],
    loading: false,
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
  }),
  methods: {
    async submit() {
      try {
        this.loading = true;
        let res = require("./res.json");
        this.responseData = res;
      } catch (error) {
        alert(error);
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
#app {
  background-color: #e5e5f7;
opacity: 0.8;
background: linear-gradient(135deg, #d9dbfd55 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(225deg, #d9dbfd 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(315deg, #d9dbfd55 25%, transparent 25%) 0px 0/ 20px 20px, linear-gradient(45deg, #d9dbfd 25%, #e5e5f7 25%) 0px 0/ 20px 20px;
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
