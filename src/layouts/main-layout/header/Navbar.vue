<template>
  <!--begin::Navbar-->
  <div class="app-navbar flex-shrink-0">


  </div>
  <!--end::Navbar-->
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "header-navbar",
  components: {
  },
  setup() {
    const store = useStore();

    const themeMode = computed(() => {
      return store.getters.getThemeMode;
    });

    return {
      themeMode,
    };
  },
});
</script>
