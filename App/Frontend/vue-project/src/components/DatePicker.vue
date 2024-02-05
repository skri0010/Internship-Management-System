<!-- This is the date range picker component used to allow the user to select a date

  @author Jacky Foo <jfoo0016@student.monash.edu>
  Reference: https://codesandbox.io/s/glfiv?file=/src/components/DatePicker.vue:0-663
  
  Created at     : 19-08-2022 19:12
  Last modified  : 20-10-2022 23:20
-->

<template>
  <v-menu v-model="menu" offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" color="primary">mdi-calendar</v-icon>
    </template>
    <v-date-picker v-model="picker" range @click="menu = false" />
  </v-menu>
</template>
<script>
export default {
  props: {
    value: []
  },
  data() {
    return {
      menu: false,
    };
  },
  computed: {
    picker: {
      get() {
        return this.value;
      },
      set(val) {
        // this.menu = false;
        this.$emit("input", val);
      },
    },
  },
};
</script>