<template>
  <div id="app">
      <router-view/>
      <loading v-if="isloading"/>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import loading from "@/components/loading/loading.vue";
export default {
  computed:{
    ...mapGetters(['isloading'])
  },
  components:{
    loading
  }
}
</script>

