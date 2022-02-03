<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-card
        elevation="2"
        light
        outlined
        shaped
        max-width="1000"
        class="pa-10 ma-10"
      >
        <v-card-title>
          Amazon Review Analyser
          <v-rating
            :value="5"
            color="amber"
            dense
            half-increments
            readonly
            size="20"
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
            <v-btn elevation="2" large raised color="purple" @click="submit()" class="ml-5"
            :loading="loading" dark
              >Analyse
              <v-icon dark> mdi-arrow-right </v-icon>
            </v-btn>
          </v-row>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: "App",

  components: {},

  data: () => ({
    url: null,
    rules: [(value) => !!value || "Required."],
    loading: false
  }),
  methods:{
    submit:async ()=>{
      try {
        this.loading=true
        let res=await this.$http.get(`/db?url=${this.url}`)
        console.log(res.data);
      } catch (error) {
        alert(error)
      }
      this.loading=false
    }
  }
};
</script>

<style scoped>
/* #app {
  background: url(./assets/bg.jpeg) no-repeat center center fixed !important;
  background-size: cover;
} */
</style>