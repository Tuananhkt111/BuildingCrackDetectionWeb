<template>
  <div>
    <Menubar>
      <template #start>
        <img alt="logo" height="40" class="" style="padding-left:10px" />
      </template>
      <template #end>
        <Button
          icon="pi pi-bell"
          class="p-button-rounded  p-button-text"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_tmenu"
          style="margin: 2px"
        />
        <TieredMenu
          id="overlay_tmenu"
          ref="menu"
          :model="items"
          :popup="true"
        />
        <Button
          icon="pi pi-user"
          class="p-button-rounded  p-button-text"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_tmenu"
          style="margin: 2px; margin-right:20px"
        />
      </template>
    </Menubar>
  </div>
</template>

<script>
import Menubar from "primevue/menubar";
import TieredMenu from "primevue/tieredmenu";

export default {
  components: {
    Menubar,
    TieredMenu,
  },
  data() {
    return {
      items: [
        {
          label: "aa",
        },
      ],
    };
  },
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>
