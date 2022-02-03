<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-row>
        <v-spacer></v-spacer>
        <div v-if="!responseData">
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
        <div v-else>
          <v-card
            elevation="2"
            light
            outlined
            shaped
            max-width="1200"
            min-width="1200"
            class="pa-10 ma-10"
          >
            <v-card-title>
              <h1 class="text-center" style="width: 100%">Review Analysis</h1>
            </v-card-title>
            <v-divider color="red"></v-divider>
            <div class="small">
              <pie-chart
                :data="chartData1"
                :options="chartOptions"
                width="100px"
                height="100px"
              ></pie-chart>
            </div>
            <div class="small">
              <pie-chart
                :data="chartData2"
                :options="chartOptions"
                width="100px"
                height="100px"
              ></pie-chart>
            </div>
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

                  <v-simple-table v-if="selectedFeature">
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
        </div>
        <v-spacer></v-spacer>
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
  }),
  methods: {
    async submit() {
      try {
        this.loading = true;
        let res = {}
        res.data=require("./res.json");

        if(parseInt(res.data.Fake)>parseInt(res.data.Real)){
          let temp=res.data.Fake;
          res.data.Fake=res.data.Real;
          res.data.Real=temp;
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