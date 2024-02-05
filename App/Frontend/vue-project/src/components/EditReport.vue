<!-- This is the edit report component

  @author Jacky Foo <jfoo0016@student.monash.edu>
  @author Hou Ruiqian <rhou0006@student.monash.edu> 

  Created at     : 10-09-2022 16:00
  Last modified  : 15-09-2022 18:40
-->

<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Report Editing</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-title>Change the details below and submit to edit the report</v-card-title>

            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12" sm="6" md="6">


                        <div class="text-left">Select report type below:</div>

                        <v-radio-group v-model="radioGroup" mandatory>
                            <v-radio v-for="(item, index) in reportType" :key="index" :label="item.type"
                                :value="item.type"></v-radio>
                        </v-radio-group>


                        <v-text-field class="mx-2" v-model="reportTitle" :rules="reportTitleRules" label="Report Title"
                            outlined required>
                        </v-text-field>

                        <v-text-field class="mx-2" v-model="companyName" :rules="companyNameRules" label="Company Name"
                            outlined required></v-text-field>

                        <v-text-field class="mx-2" v-model="dateRangeText" label="Reporting dates" readonly>
                            <template v-slot:append-outer>
                                <DatePicker v-model="dateRange"></DatePicker>
                            </template>
                        </v-text-field>

                        <v-text-field class="mx-2" v-model="hoursWorked" :rules="hoursWorkedRules" label="Hours worked"
                            outlined required @keypress="isNumber($event)">
                        </v-text-field>

                        <v-textarea class="mx-2" v-model="summary" label="Summary of what was done"
                            :rules="summaryRules" :counter="200" outlined full-width single-line>
                        </v-textarea>

                        <v-textarea class="mx-2" v-model="gains" label="Knowledge, skills or experiences gained"
                            :rules="gainsRules" :counter="200" outlined full-width single-line>
                        </v-textarea>

                        <v-btn dark color="primary" @click="submitEditedReport()">Submit</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-dialog>
</template>


<script>
import DatePicker from "./DatePicker.vue";
import { axiosConfig } from "../axiosConfig";
import store from "../store";


let axiosInstance;

export default {
    data: () => ({
        valid: true,
        reportType: [{ type: "Weekly report" }, { type: "Monthly report" }],
        reportTitle: "",
        reportTitleRules: [(v) => !!v || "Report title is required"],
        companyName: "",
        companyNameRules: [(v) => !!v || "Company name is required"],
        dateRange: [],
        hoursWorked: 0,
        hoursWorkedRules: [(v) => !!v || "Hours worked is required (Numbers only)"],
        summary: "",
        summaryRules: [(v) => !!v || "This field cannot be blank", v => v.length <= 200 || 'Must be less than 200 characters',],
        gains: "",
        gainsRules: [(v) => !!v || "This field cannot be blank", v => v.length <= 200 || 'Must be less than 200 characters',],
        radioGroup: 1,
        report: "",
    }),
    components: { DatePicker },
    props: {
        value: Boolean
    },
    computed: {
        dateRangeText() {
            return this.dateRange.join(' ~ ')
        },
        dialog: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit("input", value);
            }
        }
    },
    methods: {
        submitEditedReport() { // save the edited report in db
            let dateRangeString = this.dateRange[0] + " to " + this.dateRange[1]
            axiosInstance
                .patch(process.env.VUE_APP_BACKEND_LINK+"stud/report/update", {
                    id: this.report.reportId, 
                    reportType: this.checkReportType(this.radioGroup),
                    reportTitle: this.reportTitle,
                    companyName: this.companyName,
                    reportDate: dateRangeString,
                    hoursWorked: parseFloat(this.hoursWorked),
                    summaryWorkDone: this.summary,
                    gainedBenefits: this.gains
                })
                .catch(error => {
                    console.log(error);
                });

            // update the report attribute
            this.report.reportType =  this.checkReportType(this.radioGroup)
            this.report.reportTitle = this.reportTitle 
            this.report.companyName = this.companyName
            this.report.dateRange = dateRangeString
            this.report.hoursWorked = this.hoursWorked
            this.report.summary = this.summary
            this.report.gains = this.gains

            this.dialog = false;
            this.resetSubmitList();

            // pass updated report data back to the ReportListCard.vue
            this.$root.$emit('updateReport', this.report)
        },
        isNumber(evt) {  // this is the method to prevent string input into worked hours (only number is allowed)
            const charCode = evt.which ? evt.which : evt.keyCode;
            if (
                charCode > 31 &&
                (charCode < 48 || charCode > 57) &&
                charCode !== 46
            ) {
                evt.preventDefault();
            }
        },
        checkReportType(radioGroup) { // to get report type as string 
            if (radioGroup == "Weekly report") {
                return "WEEKLY"
            }
            else {
                return "MONTHLY"
            }
        },
        resetSubmitList() {     // reset the popout new report overlay
            this.reportType = [{ type: "Weekly report" }, { type: "Monthly report" }]
            this.reportTitle = ""
            this.companyName = ""
            this.dateRange = []
            this.hoursWorked = 0
            this.summary = ""
            this.gains = ""
            this.radioGroup = 1
        },
        loadReportIntoEdit(report) {
            //to get the types of report from the string in db
            if (report.reportType == "WEEKLY") {
                this.radioGroup = "Weekly report"
            }
            else {
                this.radioGroup = "Monthly report"
            }
            this.reportTitle = report.reportTitle
            this.companyName = report.companyName
            
            //to find the split the date string into arrays
            let datesArray = report.dateRange.split(/[" to "]/);
            let dateRangeArray = [datesArray[0], datesArray[4]]
            this.dateRange = dateRangeArray

            this.hoursWorked = report.hoursWorked
            this.summary = report.summary
            this.gains = report.gains
            this.report = report
        },
    },
    mounted() {
        axiosInstance = axiosConfig(
            store.state.user.token,
            store.state.user.role.toLowerCase(),
        );
        this.$root.$on("editReport", report => {    // retrieve info on which report to be update
            this.loadReportIntoEdit(report)
        });
    },
}
</script>