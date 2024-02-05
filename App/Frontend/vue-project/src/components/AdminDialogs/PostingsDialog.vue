<!-- This is the dialog to show postings that have been Approved/Rejected/Pending On Dashboard

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
        <v-row>
          <v-col style="height: 200px" class="mt-2">
            <v-card elevation="2" style="height: 150px" color="teal lighten-3">
              <v-card-text class="d-flex justify-space-between align-center">
                <div>
                  <span class="d-flex justify-space-between align-center"
                    >Accepted</span
                  ><br />
                  <strong style="font-size: 40px; justify-content: center">{{
                    this.activityLog[0].additional.approved
                  }}</strong>
                </div>
              </v-card-text>
              <v-card-actions
                class="d-flex justify-space-between"
              ></v-card-actions>
            </v-card>
          </v-col>
          <v-col style="height: 200px" class="mt-2">
            <v-card elevation="2" style="height: 150px" color="red lighten-3">
              <v-card-text class="d-flex justify-space-between align-center">
                <div>
                  <span class="d-flex justify-space-between align-center"
                    >Rejected</span
                  ><br />
                  <strong style="font-size: 40px; justify-content: center">{{
                    this.activityLog[0].additional.rejected
                  }}</strong>
                </div>
              </v-card-text>
              <v-card-actions
                class="d-flex justify-space-between"
              ></v-card-actions>
            </v-card>
          </v-col>
          <v-col style="height: 200px" class="mt-2">
            <v-card elevation="2" style="height: 150px" color="lime lighten-3">
              <v-card-text class="d-flex justify-space-between align-center">
                <div>
                  <span class="d-flex justify-space-between align-center"
                    >Pending</span
                  ><br />
                  <strong style="font-size: 40px; justify-content: center">{{
                    this.activityLog[0].additional.pending
                  }}</strong>
                </div>
              </v-card-text>
              <v-card-actions
                class="d-flex justify-space-between"
              ></v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

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
        // Add Document related attributes here
        additional: {
          total: 0,
          // students who found an internship will be implemented later
          approved: 0,
          rejected: 0,
          pending: 0,
        },
      },
    ],
    moreInfoDialog: false,
  }),
  methods: {
    loadData(axiosInstance) {
      let pending = 0;
      let accepted = 0;
      let rejected = 0;
      let self = this;
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"admin/app")
        .then(function (response) {
          let employer_applications = response.data.rows;
          // update the number of employers
          // self.activityLog[1].amount = employer_applications.length;
          // for each employer
          employer_applications.forEach((element) => {
            if (element.status === "APPROVED") {
              accepted += 1;
            } else if (element.status === "PENDING") {
              pending +=1 ;
            } else if (element.status === "REJECTED") {
              rejected += 1;
            }
          });
          self.activityLog[0].additional.approved = accepted;
          self.activityLog[0].additional.pending = pending;
          self.activityLog[0].additional.rejected = rejected;
        })
        .catch(function (error) {
          console.log(error);
        });
        // Update job postings count in additional info
      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"admin/admin/employerJobPostsCount")
        .then(function (response) {
          let allPostings = response.data.length;
          self.activityLog[0].amount = allPostings;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  // On page load initialize axios Instance
  mounted() {
    let axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase()
    );
    this.loadData(axiosInstance);
  },
};
</script>