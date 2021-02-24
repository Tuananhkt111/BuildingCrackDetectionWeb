<template>
  <div class="card">
    <DataTable
      ref="dt"
      :value="getNotificationList"
      v-model:selection="selectedProducts"
      dataKey="pushNotificationId"
      :paginator="true"
      :rows="5"
      :filters="filters"
      selectionMode="single"
      :rowClass="rowClass"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} notis"
    >
      <template #header>
        <div class="table-header">
          <h3 class="p-m-0" style="width:30%">Notification</h3>
          <Button
            label="Mark as Read"
            icon="pi pi-check"
            class="p-button-success p-mr-2"
            @click="markAsRead"
          />
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="title" header="Title"></Column>
      <Column field="body" header="Body"></Column>
      <Column
        field="created"
        header="Created"
        filterMatchMode="custom"
        :filterFunction="filterDate"
      >
        <template #body="slotProps">
          <span>{{ callDate(slotProps.data.created) }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import { notificationApi } from "../apis/notification";

export default {
  components: {},
  computed: {
    ...mapGetters("noti", ["getNotificationList"]),

    data() {
      return this.getNotificationList.isRead === "false"
        ? "row-accessories"
        : null;
    },
  },
  data() {
    return {
      productDialog: false,
      deleteProductDialog: false,
      deleteProductsDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
    };
  },

  async created() {
    await this.setNotificationList();
  },
  methods: {
    ...mapActions("noti", ["setNotificationList"]),
    onRowSelect() {
      notificationApi.deleteNoti(this.selectedProducts.pushNotificationId);
    },
    onRowUnselect() {},
    markAsRead() {},

    rowClass(data) {
      return !data.isRead ? "row-accessories" : null;
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY hh:mm:ss");
    },
    filterDate(value, filter) {
      if (
        filter === undefined ||
        filter === null ||
        (typeof filter === "string" && filter.trim() === "")
      ) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      let tmp = this.callDate(value).substring(0, 10);
      return tmp === this.formatDate(filter);
    },
    formatDate(date) {
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return day + "-" + month + "-" + date.getFullYear();
    },
  },
};
</script>

<style>
.row-accessories {
    background-color: rgba(0,0,0,.15) !important;
}
</style>
