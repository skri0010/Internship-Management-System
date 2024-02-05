<!-- This is the student applications page component.
     The page allows students to view the status of their applications.

  @author Jacky Foo <jfoo0016@student.monash.edu>

  Created at     : 11-09-2022 10:00
  Last modified  : 20-10-2022 22:15
-->

<template>
    <!-- Container for the student application page-->
    <v-container fluid>
        <v-card>
            <v-card-title>Student applications page</v-card-title>
            <span class="text-left">
                <v-card-text>The page to view the status of applications</v-card-text>
            </span>
            <!-- This card contains the list of applications-->
            <v-card>
                <v-card-title>List of applications</v-card-title>
                <v-expansion-panels>
                    <v-expansion-panel v-for="(item, index) in applications" :key="index">
                        <v-expansion-panel-header>
                            {{item.jobTitle}} at {{ item.companyName }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-card>
                                <div class="text-left pb-5">
                                    <v-toolbar dark color="primary">
                                        <v-card-title>
                                            Application for {{item.jobTitle}} at {{item.companyName}}
                                        </v-card-title>

                                    </v-toolbar>
                                    <div class="ma-5">
                                        Application status: {{item.status}}<br>
                                        Date applied: {{item.date}}<br>
                                    </div>
                                </div>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card>

        </v-card>
    </v-container>
</template>

<script>
import { axiosConfig } from "../../axiosConfig";
import store from "../../store";

let axiosInstance;

export default {
    data: () => ({
        applications: []
    }),
    methods: {
        loadApplications(student_id) {
            console.log(student_id)
            axiosInstance
                .get(process.env.VUE_APP_BACKEND_LINK+"stud/jobapply/retrieve", {
                params: {
                    applicantId: student_id
                }
            }).then(response => this.displayApplications(response.data));
        },
        displayApplications(list) {
            for (let i=0; i<list.length; i++) {
                console.log(list[i].jobId)
                axiosInstance
                    .get(process.env.VUE_APP_BACKEND_LINK+"stud/job/search/jobId", {
                    params: {
                        jobId: list[i].jobId
                    }
                }).then(response => this.applications.push(
                                    {companyName: response.data.employerName, 
                                        jobTitle: response.data.jobTitle,
                                        status: list[i].applicationStatus, 
                                        date: list[i].createdAt}
                                        ));
            }
        },

    },
    // on page load run this
    mounted() {
        axiosInstance = axiosConfig(
        store.state.user.token,
        store.state.user.role.toLowerCase(),
        );
        let data = this.$store.state.user;
        this.loadApplications(data.id);
    },
}
</script>