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
/* #app {
  background: url(./assets/bg.jpeg) no-repeat center center fixed !important;
  background-size: cover;
} */

.small {
  max-width: 400px;
  margin: 10px;
}
</style>
