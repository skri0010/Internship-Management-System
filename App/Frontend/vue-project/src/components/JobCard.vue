<template>
  <v-card elevation="0" max-width="100%">
    <v-alert border="top" colored-border :color="dueColor" elevation="2">
      <v-card-title class="py-0">
        <v-list-item one-line>
          <v-list-item-avatar tile size="80" color="grey">
            <img v-if="job.image!=null" v-bind:src="job.image" alt="user" />
            <!-- Place holder image for employer with no profile picture -->
            <v-img v-if="job.image==null" src="../assets/employers_placeholder.png"/> 
          </v-list-item-avatar>
          <v-list-item-content>
            <div class="text-overline text-left">
              {{ job.employerName }}
            </div>
            <v-list-item-title class="text-h4 text-left text-wrap">
              <b>{{ job.jobTitle }}</b>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text class="text-left">
        <v-list-item align="justify">
          Hiring : <br />
          {{ job.hireType }}
        </v-list-item>
        <v-list-item align="justify">
          Address : <br />
          {{ job.employerAddress }}
        </v-list-item>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col cols="12" sm="8" md="8" lg="8" xl="8" class="text-left">
            <v-chip class="ma-2" dark :color="dueColor">
              {{ job.advertisementEndDate.substring(0, 10) }}
            </v-chip>
            <!-- Check if jobType is COMPULSORY -->
            <v-tooltip bottom v-if="this.$store.state.user.role.localeCompare('STUDENT') === 0">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  v-bind="attrs"
                  v-on="on"
                  v-if="job.jobType === 'COMPULSORY'"
                  class="ma-2"
                  dark
                  color="black"
                >
                  VERIFIED
                  <v-icon right> mdi-star </v-icon>
                </v-chip>
              </template>
              <span>This job met requirement for compulsory internship</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="4" xl="4" class="text-right">
            <v-btn dark large class="pl-4" elevation="0" @click="routeToDetail">
              Details
              <v-icon right dark> mdi-magnify </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-alert>
  </v-card>
</template>
<script>
export default {
  name: "MyJob",
  props: {
    job: Object,
  },
  data: () => ({
    dueColor: "#2C4C9C",
    image: "",
  }),
  methods: {
    /**
     * This method is used to route to the page that shows the job detail.
     */
    routeToDetail() {
      this.$router.push({
        name: "jobdetails",
        params: { selectedJob: this.job },
      });
    },
  },
  created() {
    // Determine the colour of the job 
    let today = new Date();
    let dueDate = new Date(this.job.advertisementEndDate);
    let difference = Math.abs(dueDate - today);
    let days = Math.round(difference / (1000 * 3600 * 24));

    if (days <= 7) {
      this.dueColor = "#E3242B";  // Red, shows closing soon
    } else if (days <= 14) {
      this.dueColor = "#D4A017";  // Yellow, shows closing in a week
    } else {
      this.dueColor = "#6CBB3C";  // Green, shows job not closing soon
    }
    
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap");
.disable-events {
  pointer-events: none;
}
.text-h4 {
  font-family: "Roboto Condensed", sans-serif !important;
  max-width: 100%;
  overflow: auto;
  word-break: break-word;
}
</style>
