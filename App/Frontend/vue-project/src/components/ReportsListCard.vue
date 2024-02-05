<!-- This is the report list card component which contains the reports created by the user

  @author Jacky Foo <jfoo0016@student.monash.edu>
  @author Hou Ruiqian <rhou0006@student.monash.edu> 
  
  Created at     : 30-08-2022 02:00
  Last modified  : 20-10-2022 23:30
-->

<template>
    <v-card>
        <v-card-title>List of reports</v-card-title>
        <v-expansion-panels>
            <!-- One expansion panel is used for each report-->
            <v-expansion-panel v-for="(item, index) in reports" :key="index">
                <v-expansion-panel-header>
                    {{  item.reportTitle  }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-card>
                        <div class="text-left pb-5">
                            <v-toolbar dark color="primary">
                                <v-card-title>
                                    {{  item.reportType  }} Report - {{item.reportTitle}}
                                </v-card-title>
                                
                                <v-spacer></v-spacer>

                                <v-btn icon @click="editReport(item)">
                                    <v-icon>mdi-pencil</v-icon>

                                    <template>
                                        <EditReport v-model="showDialog"></EditReport>
                                    </template>
                                </v-btn>
                            </v-toolbar>
                            <div class="ma-5">
                                Company name: {{  item.companyName  }}<br>
                                Date range: {{  item.dateRange  }}<br>
                                Hours worked: {{  item.hoursWorked  }}<br>
                            </div>
                            <v-divider></v-divider>
                            <div class="ma-5">Summary: {{  item.summary  }}<br></div>
                            <v-divider></v-divider>
                            <div class="ma-5">Knowledge, skills or experiences gained: {{  item.gains  }}</div>

                        </div>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script>
import { axiosConfig } from "../axiosConfig";
import store from "../store";
import EditReport from "./EditReport.vue";

let axiosInstance;

export default {
    data: () => ({
        reports: [],
        showDialog: false
    }),
    methods: {
        loadReports(email) {
            axiosInstance
                .get(process.env.VUE_APP_BACKEND_LINK+"stud/report/retrieve", {
                params: {
                    studentEmail: email
                }
            })
                .then(response => this.displayReports(response.data));
        },
        displayReports(reportArray) {
            this.reports = [];
            for (let i = 0; i < reportArray.length; i++) {
                let report = reportArray[i];
                this.addReport(report._id, report.reportType, report.reportTitle, report.companyName, report.reportDate, report.hoursWorked, report.summaryWorkDone, report.gainedBenefits);
            }
        },
        addReport(reportId, reportType, reportTitle, companyName, dateRange, hoursWorked, summary, gains) {
            this.reports.push({
                reportId: reportId,
                reportType: reportType,
                reportTitle: reportTitle,
                companyName: companyName,
                dateRange: dateRange,
                hoursWorked: hoursWorked,
                summary: summary,
                gains: gains
            });
        },
        editReport(report) {
            this.showDialog = true;
            this.$root.$emit('editReport', report)
        },
        updateReport(report) {
            for(let i=0; i<this.reports.length; i++) {
                if (this.reports[i].reportId == report.reportId) {
                    this.reports[i] = report
                    break;
                }
            }
        },
    },
    //on page load run this
    mounted() {
        axiosInstance = axiosConfig(store.state.user.token, store.state.user.role.toLowerCase());
        let email = this.$store.state.user.email;
        this.loadReports(email);
        this.$root.$on("submitReport", report => {  //retrieve the newly submitted data from ReportsCard.vue
            this.reports.push(report);
        });
        this.$root.$on("updateReport", report => {  //retrieve the updated editReport data for editReport.vue
            this.updateReport(report);
        });
    },
    components: { EditReport }
}
</script>