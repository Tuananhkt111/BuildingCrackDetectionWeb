<template>
  <div class="main-layout-details">
    <Detecting v-if="isDetect && staff"></Detecting>
    <Upload v-if="!isDetect && staff"></Upload>
    <div class="card">
      <DataTable
        :rowHover="true"
        :scrollable="true"
        ref="dt"
        :value="getFlightList"
        dataKey="flightId"
        :paginator="true"
        :rows="5"
        v-model:filters="filters"
        :globalFilterFields="['locationName', 'dataCollectorName', 'location', 'description', 'video']"
        filterDisplay="menu"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
      >
        <div class="table-header">
          <h3
            class="p-m-0 table-title"
            style="color: #143178;font-weight: 400;font-size:22px"
          >
            Detection Results
          </h3>
          <span class="p-input-icon-left">
            <span class="p-input-icon-left" style="margin:2px">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </span>
        </div>
        <template #empty>
          No Detection Result found.
        </template>
        <Column
          header="No"
          style="margin-right:-10rem"
          headerStyle="width: 30px;border-radius: 20px 0 0 20px"
        >
          <template #body="slotProps">
            {{ slotProps.data.index }}
          </template>
        </Column>
        <Column
          field="description"
          header="Description"
          :showFilterMatchModes="false"
          :showAddButton="false"
          :showFilterOperator="false"
        >
          <template #body="slotProps">
            {{ slotProps.data.description }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <div v-if="!isStaff">
          <Column
            field="locationName"
            header="Area Name"
            :showFilterMatchModes="false"
            :showAddButton="false"
            :showFilterOperator="false"
          >
            <template #body="slotProps">
              {{ slotProps.data.locationName }}
            </template>
            <template #filter="{filterModel}">
              <InputText
                type="text"
                v-model="filterModel.value"
                class="p-column-filter"
                placeholder="Search by name"
              />
            </template>
          </Column>
          <Column
            field="video"
            header="Video"
            :showFilterMatchModes="false"
            :showAddButton="false"
            :showFilterOperator="false"
          >
            <template #body="slotProps">
              <img
                src="@/asset/mp4-6.png"
                style="width: 40px; margin-right: 10px"
              />
              <span v-if="slotProps.data.video != 'null.mp4'">{{
                slotProps.data.video
              }}</span>
              <span v-else style="font-style: italic; color: #adadad"
                >Video deleted</span
              >
            </template>
            <template #filter="{filterModel}">
              <InputText
                type="text"
                v-model="filterModel.value"
                class="p-column-filter"
                placeholder="Search"
              />
            </template>
          </Column>
        </div>
        <div v-else>
          <Column
            field="video"
            header="Video"
            :showFilterMatchModes="false"
            :showAddButton="false"
            :showFilterOperator="false"
          >
            <template #body="slotProps">
              <img
                src="@/asset/mp4-6.png"
                style="width: 40px; margin-right: 10px"
              />
              <span v-if="slotProps.data.video != 'null.mp4'">{{
                slotProps.data.video
              }}</span>
              <span v-else style="font-style: italic; color: #adadad"
                >Video deleted</span
              >
            </template>
            <template #filter="{filterModel}">
              <InputText
                type="text"
                v-model="filterModel.value"
                class="p-column-filter"
                placeholder="Search"
              />
            </template>
          </Column>
          <Column
            header="Record Date"
            filterField="recordDate"
            dataType="date"
            style="min-width:10rem"
            :showAddButton="false"
            :showFilterOperator="false"
            :showFilterMatchModes="false"
          >
            <template #body="{data}">
              {{ callDate(data.recordDate) }}
            </template>
            <template #filter="{filterModel}">
              <Calendar
               v-model="filterModel.value"
                dateFormat="dd/mm/yy"
                placeholder="dd/mm/yyyy"
              />
            </template>
          </Column>
        </div>
        <Column
          field="dataCollectorName"
          header="Collector Name"
          :showFilterMatchModes="false"
          :showAddButton="false"
          style="display:none"
          :showFilterOperator="false"
        >
          <template #body="slotProps">
            {{ slotProps.data.dataCollectorName }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column headerStyle="border-radius:0 20px 20px 0">
          <template #body="slotProps">
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text"
              @click="seeProduct(slotProps.data)"
              v-tooltip.bottom="'View Details'"
            />
            <Button
              v-if="slotProps.data.video != 'null.mp4' && !isStaff"
              icon="pi pi-trash"
              style="color: red"
              class="p-button-rounded p-button-alert p-button-text"
              @click="confirmRemoveVideo($event, slotProps.data)"
              v-tooltip.bottom="'Delete Video'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Toast position="bottom-right" />
    <ConfirmPopup></ConfirmPopup>
    <div class="imagePopup" v-if="displayImage" @click="hiddenImage">
      <img
        :src="crack.image"
        style="width:60%; height: 75%; margin-left:270px; margin-top:100px"
      />
    </div>
  </div>
</template>

<script>
import Toast from "primevue/toast";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import moment from "moment";
import { flightApi } from "../apis/flights";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { mapGetters, mapActions } from "vuex";
import webRole from "../util/webRole.js";
import Upload from "../views/Upload.vue";
import Detecting from "../components/Detecting.vue";
import ConfirmPopup from "primevue/confirmpopup";
import contentNoti from "../util/contentNoti.js";


export default {
  components: {
    Button,
    Toast,
    Upload,
    Detecting,
    Calendar,
    ConfirmPopup,
  },
  computed: {
    ...mapGetters("flight", ["getFlightList"]),
    ...mapGetters("application", ["getVideo"]),

    data() {
      return this.getFlightList;
    },

    isStaff() {
      let role = JSON.parse(localStorage.getItem("user")).role;
      if (webRole.STAFF_ROLE === role) return true;
      return false;
    },

    isDetect() {
      return this.getVideo != null;
    },
  },
  data() {
    return {
      product: {},
      filters: {},
      role: null,
      staff: false,
      displayImage: false,
    };
  },
  created() {
    this.initFilters();
    this.setFlightList();
  },

  mounted() {
    this.role = JSON.parse(localStorage.getItem("user")).role;
    if (this.role === webRole.STAFF_ROLE) {
      this.staff = true;
    } 
  },

  methods: {
    ...mapActions("flight", ["setFlightList"]),

    seeProduct(product) {
      this.$router.push(
        "/detection-result-details?detectionResultId=" + product.flightId
      );
    },
    showImage(crack) {
      document.body.style.overflow = "hidden";
      this.crack = { ...crack };
      this.displayImage = true;
    },
    hiddenImage() {
      document.body.style.overflow = "visible";
      this.displayImage = false;
    },
    editProduct(product) {
      this.handleReset();
      this.product = { ...product };
      this.locationName = this.product.name;
      this.description = this.product.description;
      this.product.created = this.callDate(product.created);
      this.product.lastModified = this.callDate(product.lastModified);
      this.submitted = false;
      this.productDialog = true;
    },

    confirmRemoveVideo(event, product) {
      this.$confirm.require({
        target: event.currentTarget,
        message: "Are you sure you want to delete video from this result?",
        icon: "pi pi-info-circle",
        acceptClass: "p-button-danger",
        accept: async () => {
          await flightApi.removeVideo(product.flightId).then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: contentNoti.SUCCESS_SUMMARY,
                detail: contentNoti.VIDEO_DELETE_SUCCESS,
                life: 3000,
              });
              this.setFlightList();
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.VIDEO_DELETE_FAILED,
                life: 3000,
              });
            }
          });
        },
        reject: () => {},
      });
    },

    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY HH:mm:ss");
    },
    formatDate(value) {
      return new Date(value).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        locationName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        description: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        dataCollectorName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        video: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        recordDate: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
      };
    },
  },
};
</script>

<style scoped>
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
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.product-image {
  width: 100px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 150px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
}

.invalid {
  color: red;
}

.imagePopup {
  width: 100%;
  height: 100%;
  z-index: 999999;
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  left: 0;
  align-content: center;
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

.table-title {
  display: flex;
  justify-content: center;
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
