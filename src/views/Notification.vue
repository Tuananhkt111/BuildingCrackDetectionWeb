<template>
 <div  class="main-layout-details">
  <div class="card">
    <DataTable
      :rowHover="true"
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
      currentPageReportTemplate=""
    >
      <div class="table-header">
        <h3 class="p-m-0" style="width:30%">Notifications</h3>
        <Button
          label="Mark All as Read"
          icon="pi pi-check"
          class="p-button-info p-mr-2"
          @click="markAsRead"
        />
      </div>
      <template #empty> No Notification found. </template>
      <Column field="title" header="Title" sortable="true" headerStyle="border-radius:20px 0 0 20px">
        <template #body="slotProps">
          <span>{{ slotProps.data.title }}</span>
          <span v-if="!slotProps.data.isRead" class="new-att">NEW</span>
        </template>
      </Column>
      <Column field="body" header="Body" sortable="true"></Column>
      <Column
        field="created"
        header="Created"
        filterMatchMode="custom"
        :filterFunction="filterDate"
        sortable="true"
        headerStyle="border-radius:0 20px 20px 0"
      >
        <template #body="slotProps">
          <span>{{ callDate(slotProps.data.created) }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import { notificationApi } from "../apis/notification";
import contentNoti from "../util/contentNoti.js";

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
      product: {},
      selectedProducts: null,
      filters: {},
    };
  },

  async created() {
    await this.setNotificationList();
  },
  methods: {
    ...mapActions("noti", ["setNotificationList"]),
    async onRowSelect() {
      if (this.selectedProducts.isRead == false) {
        await notificationApi.deleteNoti(
          this.selectedProducts.pushNotificationId
        );
        this.setNotificationList();
      }
    },
    onRowUnselect() {},
    async markAsRead() {
      const id = [];
      var count = 0;
      for (let index = 0; index < this.getNotificationList.length; index++) {
        if (!this.getNotificationList[index].isRead) {
          id[count] = this.getNotificationList[index].pushNotificationId;
          count = count + 1;
        }
      }
      await notificationApi
        .deleteAllNoti(id)
        .catch(() => this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.NOTIFICATION_CLEAR_FAILED,
              life: 3000,
            }))
        .then((res) => {
          if (res.status == 200) {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.NOTIFICATION_CLEAR_SUCCESS,
              life: 3000,
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.NOTIFICATION_CLEAR_FAILED,
              life: 3000,
            });
          }
        });
      await this.setNotificationList();
    },

    rowClass(data) {
      return !data.isRead ? "row-accessories" : null;
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY HH:mm:ss");
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

<style scoped>
.new-att {
  padding: 1px 8px 3px;
  border-radius: 24px;
  background: #e2fff6;
  width: 20px;
  color: #25c997;
  font-weight: 600;
  margin-left: 10px;
}
.row-accessories {
  background-color: #d0e7fa !important;
}

.p-m-0::before {
  content: "";
  width: 5px;
  height: 12px;
  display: block;
  border-radius: 3px;
  padding-bottom: 10px;
  position: relative;
  left: -10px;
  top: 0;
  background: #007dfe;
}

.p-m-0 {
  display: flex;
  align-items: center;
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f2f9ff;
  color: #4ca4f9;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-width: 0 0 0 0;
  text-align: left;
  box-sizing: content-box;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  font-weight: 500;
}
::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: left;
  border: 1px solid #e9ecef;
  border-width: 0 0 0 0;
  padding: 1rem 1rem;
}

::v-deep(.p-datatable.p-datatable-hoverable-rows
    .p-datatable-tbody
    > tr:not(.p-highlight):hover) {
  background: rgba(119, 123, 241, 0.1);
}

::v-deep(.p-column-filter-menu-button:hover) {
  color: #2170e7;
}

::v-deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
}

::v-deep(.p-button) {
  background: #464df2;
  color: #ffffff;
  border: 1px solid #464df2;
  margin: 0;
  outline: 0 none;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}

::v-deep(.p-button.p-button-success, .p-buttonset.p-button-success
    > .p-button, .p-splitbutton.p-button-success > .p-button) {
  color: #ffffff;
  background: #55e757;
  border: 1px solid #55e757;
}

::v-deep(.p-button.p-button-info, .p-buttonset.p-button-info
    > .p-button, .p-splitbutton.p-button-info > .p-button) {
  color: #ffffff;
  background: #7fb4fa;
  border: 1px solid #7fb4fa;
}

::v-deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: rgba(70, 77, 242, 0.9);
  color: #ffffff;
}

::v-deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  padding: 0;
  border: 1px solid transparent;
  text-align: center;
  line-height: 2.286em;
  min-width: 2.286em;
  height: 2.286em;
  color: #83888f;
  margin: 0 0.125em;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-width: 0 0 0 0;
  color: #69707a;
  padding: 1rem;
  font-weight: 700;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

::v-deep(.p-datatable .p-paginator-bottom) {
  border-width: 0 0 0 0;
}
.main-layout-details {
  border-radius: 24px;
  padding: 20px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
.active .main-layout-details {
  margin-left: 266.5px;
  transition: all 0.2s;
}
.inactive .main-layout-details {
  margin-left: 0;
  transition: all 0.2s;
}
</style>
