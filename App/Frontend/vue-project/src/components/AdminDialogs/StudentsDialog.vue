<!-- This is The Dialog To show Students for Unit or Voluntary internships
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
              <v-card elevation="2" style="height: 150px" color="light-blue lighten-3">
                <v-card-text class="d-flex justify-space-between align-center">
                  <div>
                    <span class="d-flex justify-space-between align-center"
                      >FIT3199</span
                    ><br />
                    <strong style="font-size: 40px; justify-content: center">{{
                      this.activityLog[0].additional.fit3199
                    }}</strong>
                  </div>
                </v-card-text>
                <v-card-actions
                  class="d-flex justify-space-between"
                ></v-card-actions>
              </v-card>
            </v-col>
            <v-col style="height: 200px" class="mt-2">
              <v-card elevation="2" style="height: 150px" color="light-blue lighten-3">
                <v-card-text class="d-flex justify-space-between align-center">
                  <div>
                    <span class="d-flex justify-space-between align-center"
                      >
                      ENG0002</span
                    ><br />
                    <strong style="font-size: 40px; justify-content: center">{{
                      this.activityLog[0].additional.eng0002
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
                      >Voluntary</span
                    ><br />
                    <strong style="font-size: 40px; justify-content: center">{{
                      this.activityLog[0].additional.voluntary
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
            fit3199: 0,
            eng0002: 0,
            voluntary: 0,
          },
        },
      ],
      moreInfoDialog: false,
    }),
    methods: {
      // Method to load the data for students dialog additional information
      async loadData(axiosInstance) {
        let self = this;
        await axiosInstance
            .get(process.env.VUE_APP_BACKEND_LINK+ 'admin/statistics/getStudentsByUnit')
            .then((res) => {
              let options = res.data
              for (let i = 0; i < options.length;i++){
                if (options[i]._id === "ENG0002"){
                  self.activityLog[0].additional.eng0002 = options[i].count;
                }
                else if (options[i]._id === "FIT3199"){
                  self.activityLog[0].additional.fit3199 = options[i].count;
                }
                else {
                  self.activityLog[0].additional.voluntary += options[i].count;
                }
              }
            });
      },
    },
    // On page load initialize axios instance
    mounted() {
      let axiosInstance = axiosConfig(
        store.state.user.token,
        store.state.user.role.toLowerCase()
      );
      this.loadData(axiosInstance);
    },
  };
  </script>