<!-- This is the Top Employers by Applications Info for Dashboard

  @author Suchit Krishna <skri0010@student.monash.edu>
  Created at     : 11-09-2022 10:00
  Last modified  : 10-20-2022 10:00
-->
<template>
  <v-dialog v-model="moreInfoDialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="rgba(0, 0, 0, .7)" block text v-bind="attrs" v-on="on">
        More Details
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Additional Information
      </v-card-title>
      <v-card-text>
                  <span class="d-flex justify-space-between align-center"
                    ><strong>Top Employers</strong> </span
                  >
            <v-timeline align-top dense>
              <v-timeline-item color="red" small>
                <strong>{{this.activityLog[0].TopJobApplications[0].employer}}</strong>
                <div class="text-caption">{{this.activityLog[0].TopJobApplications[0].applicants}} Applicants</div>
              </v-timeline-item>
              <v-timeline-item color="red" small>
                <strong>{{this.activityLog[0].TopJobApplications[1].employer}}</strong>
                <div class="text-caption mb-2">{{this.activityLog[0].TopJobApplications[1].applicants}} Applicants</div>
              </v-timeline-item>

              <v-timeline-item color="red" small>
                <strong>{{this.activityLog[0].TopJobApplications[2].employer}}</strong>
                <div class="text-caption">{{this.activityLog[0].TopJobApplications[2].applicants}} Applicants</div>
              </v-timeline-item>
            </v-timeline>
              </v-card-text>
              <v-card-actions
                class="d-flex justify-space-between"
              ></v-card-actions>
            

      <v-divider></v-divider>

      <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="moreInfoDialog = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
  </v-dialog>
</template>
<script>
import { axiosConfig } from "../../axiosConfig.js";
import store from "../../store.js";
export default {
  data: () => ({
    activityLog: [
      {
        TopJobApplications: [
      {
        employer: "No Data",
        applicants: 0,
      },
      {
        employer: "No Data",
        applicants: 0,
      },
      {
        employer: "No Data",
        applicants: 0,
      },
    ],
      },
    ],
    moreInfoDialog: false
  }),
  methods: {
    async loadData(axiosInstance) {
      let self = this;
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+ 'admin/statistics/getTopEmployers')
        .then(function (response) {
          console.log(response)
          const data = response.data;
          let array = [];
          array = data.sort((a, b) => a.employerId <= b.employerId);         

            for(let i = 0; i < array.length && i <=3; i++)
            {
              axiosInstance
                .get(
                  process.env.VUE_APP_BACKEND_LINK +
                    `emp/prof/${array[i].employerId}`
                )
                .then( (res) => {
                  console.log(res.data)
                  self.activityLog[0].TopJobApplications[i].employer = res.data.employerName;
                  self.activityLog[0].TopJobApplications[i].applicants = array[i].numberOfApplicants;
                });
            }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  //On page load initialize axios instance
  mounted() {
    let axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase()
    );
    this.loadData(axiosInstance);
  },
};
</script>