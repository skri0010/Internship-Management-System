<!-- This is the report card component

  @author Jacky Foo <jfoo0016@student.monash.edu>
  @author Hou Ruiqian <rhou0006@student.monash.edu>   

  Created at     : 19-08-2022 17:00
  Last modified  : 20-10-2022 23:30
-->

<template>
    <v-card>
        <v-card-title>
            Create and submit your reports:
            <v-spacer></v-spacer>
            
            <v-card-actions>
                <!-- Dialog that activates when the "New report" button is pressed-->
                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark v-bind="attrs" v-on="on">
                            New report
                        </v-btn>
                    </template>
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="dialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>Report Creation</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                            </v-toolbar-items>
                        </v-toolbar>

                        <v-card-title>Please fill up the details of the report</v-card-title>

                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-row>
                                <v-col cols="12" sm="6" md="6">


                                    <div class="text-left">Select report type below:</div>

                                    <v-radio-group v-model="radioGroup" mandatory>
                                        <v-radio v-for="(item, index) in reportType" :key="index" :label="item.type"
                                            :value="item.type"></v-radio>
                                    </v-radio-group>


                                    <v-text-field class="mx-2" v-model="reportTitle" :rules="reportTitleRules"
                                        label="Report Title" outlined required>
                                    </v-text-field>

                                    <v-text-field class="mx-2" v-model="companyName" :rules="companyNameRules"
                                        label="Company Name" outlined required></v-text-field>

                                    <v-text-field class="mx-2" v-model="dateRangeText" label="Reporting dates" readonly>
                                        <template v-slot:append-outer>
                                            <DatePicker v-model="dateRange"></DatePicker>
                                        </template>
                                    </v-text-field>

                                    <v-text-field class="mx-2" v-model="hoursWorked" :rules="hoursWorkedRules"
                                        label="Hours worked" outlined required @keypress="isNumber($event)">
                                    </v-text-field>

                                    <v-textarea class="mx-2" v-model="summary" label="Summary of what was done"
                                        :rules="summaryRules" :counter="200" outlined full-width single-line>
                                    </v-textarea>

                                    <v-textarea class="mx-2" v-model="gains"
                                        label="Knowledge, skills or experiences gained" :rules="gainsRules"
                                        :counter="200" outlined full-width single-line>
                                    </v-textarea>

                                    <v-btn dark color="primary" @click="submitNewReport()">Submit</v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card>
                </v-dialog>
            </v-card-actions>


        </v-card-title>


    </v-card>
</template>

<script>
import DatePicker from "./DatePicker.vue";
import { axiosConfig } from "../axiosConfig";
import store from "../store";

let axiosInstance;

export default {
    data: () => ({
        dialog: false,
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

    }),
    components: { DatePicker },
    computed: {
        dateRangeText() {
            return this.dateRange.join(' ~ ')
        },
    },
    methods: {
        submitNewReport() { // post the new report to db
            let email = this.$store.state.user.email;
            // check if future date is undefined
            let dateRangeString = "";

            if (this.dateRange[1] == undefined)
            {
                dateRangeString = this.dateRange[0] + " to (Not Added Yet)"
            }
            else{
                
                dateRangeString = this.dateRange[0] + " to " + this.dateRange[1]
            }
            axiosInstance
                .post(process.env.VUE_APP_BACKEND_LINK+"stud/report/submit", {
                    studentEmail: email,
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
            this.dialog = false;

            let report = {
                reportType: this.checkReportType(this.radioGroup), 
                reportTitle: this.reportTitle, 
                companyName: this.companyName, 
                dateRange: dateRangeString, 
                hoursWorked: parseFloat(this.hoursWorked), 
                summary: this.summary, 
                gains: this.gains 
            }
            this.resetSubmitList();

            this.$root.$emit('submitReport', report)
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
        }
    },
    mounted() {
        axiosInstance = axiosConfig(
        store.state.user.token,
        store.state.user.role.toLowerCase(),
        );
    },
}
</script>