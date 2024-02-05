<!-- This is the Admin info subcomponent for the dashboard

  @author Suchit Krishna <skri0010@student.monash.edu>
  Created at     : 11-10-2022 10:00
  Last modified  : 
-->
<template>
  <v-dialog v-model="moreInfoDialog" width="500">
     <!-- More Details Dialog-->
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
            <v-card elevation="2" style="height: 150px" color="blue lighten-3">
              <v-card-text class="d-flex justify-space-between align-center">
                <div>
                   <!-- Student Admin Info-->
                  <span class="d-flex justify-space-between align-center"
                    >Student Admins</span
                  ><br />
                  <strong style="font-size: 40px; justify-content: center">{{
                    this.activityLog[0].additional.studentAdmin
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
                   <!-- Main Admin Info-->
                  <span class="d-flex justify-space-between align-center"
                    >Main Admins</span
                  ><br />
                  <strong style="font-size: 40px; justify-content: center">{{
                    this.activityLog[0].additional.mainAdmin
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
          studentAdmin: 0,
          mainAdmin: 0,
        },
      },
    ],
    moreInfoDialog:false,
  }),
  methods: {
    loadData(axiosInstance) {
      // Load information for admins dialog
      let self = this;

      axiosInstance
        .get(process.env.VUE_APP_BACKEND_LINK+"admin/users/getUsers")
        .then(function (response) {
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].userRole == "ADMIN" ) {
              self.activityLog[0].additional.mainAdmin +=1;
            }
            else if (response.data[i].userRole == "COADMIN"){
              self.activityLog[0].additional.studentAdmin += 1
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });


    },
  },
  // Load user info on load
  mounted() {
    let axiosInstance = axiosConfig(
      store.state.user.token,
      store.state.user.role.toLowerCase()
    );
    this.loadData(axiosInstance);
  },
};
</script>