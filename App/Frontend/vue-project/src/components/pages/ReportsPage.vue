<!-- This is the report page component.
     The page contains the option to create and submit reports as well as the list of reports created by the student.

  @author Jacky Foo <jfoo0016@student.monash.edu>
  
  Created at     : 18-08-2022 19:40
  Last modified  : 20-10-2022 21:47
-->

<template>
<v-container fluid>
    <v-card>
        <v-card-title>Reports page</v-card-title>
        <span class="text-left">
        <v-card-text>The page to view, create and submit your reports</v-card-text>
        </span>

        <ReportsCard></ReportsCard>
        <ReportsListCard></ReportsListCard>
        


    </v-card>
</v-container>
</template>

<script>
    import ReportsCard from "../ReportsCard.vue";
import ReportsListCard from "../ReportsListCard.vue";
    export default {
    data: () => ({
    }),
    watch: {
    },
    methods: {
    },
    components: { ReportsCard, ReportsListCard }
  }
</script>