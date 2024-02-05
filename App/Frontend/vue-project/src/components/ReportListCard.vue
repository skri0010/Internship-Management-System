<template>
  <v-card class="mx-auto text-left" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline">
          {{ report.reportDate }} - {{ report.companyName }}
        </div>
        <v-list-item-title class="text-h4">
          {{ report.reportTitle }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ report.reportType }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text class="pb-0">
      <p>Student Email: {{ report.studentEmail }}</p>
      <p>Hours Worked: {{ report.hoursWorked }}</p>
      <p>Gained Benefits:<br/> {{ report.gainedBenefits }}</p>
      <p>Summary: <br/> {{ report.summaryWorkDone }}</p>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "ReportListCard",
  props: {
    report: Object,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
