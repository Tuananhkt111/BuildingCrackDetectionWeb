<template>
  <div>
    <div class="card">
      <DataTable
        ref="dt"
        dataKey="maintenanceOrderId"
        :value="getMaintenanceOrderList"
        v-model:expandedRows="expandedRows"
        @row-expand="onRowExpand"
        @row-collapse="onRowCollapse"
        :paginator="true"
        :rows="5"
        :rowHover="true"
        v-model:filters="filters"
        filterDisplay="menu"
        :globalFilterFields="[
          'maintenanceWorkerName',
          'locationName',
          'status',
        ]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
      >
        <div class="table-header-main">
          <h3 class="p-m-2">Maintenance Orders</h3>
          <span class="p-input-icon-left">
            <span class="p-input-icon-left" style="margin: 2px">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </span>
        </div>
        <template #empty> No Maintenance Order found. </template>
        <Column :expander="true" headerStyle="width: 30px" />
        <Column
          field="locationName"
          header="Location Name"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.locationName }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          field="maintenanceWorkerName"
          header="Worker Name"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.maintenanceWorkerName }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search"
            />
          </template>
        </Column>
        <Column
          header="Status"
          filterField="status"
          :showFilterMatchModes="false"
          :filterMenuStyle="{ width: '14rem' }"
          style="min-width: 14rem"
        >
          <template #body="{ data }">
            <Skeleton v-if="loading" />
            <span :class="stockStatusOrder(data)">
              {{ data.status }}
            </span>
          </template>
          <template #filter="{ filterModel }">
            <div class="p-mb-3 p-text-bold">Status Picker</div>
            <MultiSelect
              v-model="filterModel.value"
              :options="getStatusList"
              placeholder="Any"
              class="p-column-filter"
            >
              <template #option="slotProps">
                <span>{{ slotProps.option }}</span>
              </template>
            </MultiSelect>
          </template>
        </Column>
        <Column
          header="Maintenance Date"
          filterField="maintenanceDate"
          dataType="date"
          style="min-width: 20px"
          headerStyle="width: 13em"
        >
          <template #body="{ data }">
            <Skeleton v-if="loading" />
            {{ callDate(data.maintenanceDate) }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            />
          </template>
        </Column>
        <Column headerStyle="width: 5em">
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'View Maintenance Order Details'"
            />
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="orders-subtable">
            <div class="table-header">
              <h4 class="p-m-2" id="sub-table-title">List of Cracks</h4>
            </div>
            <DataTable :value="slotProps.data.cracks">
              <Column header="Image" headerStyle="width: 150px" class="small">
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
                  <img
                    :src="slotProps.data.imageThumbnails"
                    :alt="slotProps.data.imageThumbnails"
                    class="product-image"
                    style="width:80px; height: 80px;"
                    @click="showImage(slotProps.data)"
                  />
                </template>
              </Column>
              <Column field="severity" header="Severity" sortable>
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
                  <span :class="stockClass(slotProps.data)">
                    {{ slotProps.data.severity }}
                  </span>
                </template>
              </Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
                  <span :class="stockStatus(slotProps.data)">
                    {{ slotProps.data.status }}
                  </span>
                </template>
              </Column>
              <Column field="created" header="Created Date" sortable>
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
                  <span>{{ callDate(slotProps.data.created) }}</span>
                </template>
              </Column>
              <Column headerStyle="width:4rem">
                <template #body="slotProps">
                  <Skeleton v-if="loading" />
                  <Button
                    icon="pi pi-search"
                    @click="showDetail(slotProps.data)"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '700px' }"
      :modal="true"
      class="dialog"
    >
      <template #header>
        <h3 class="dialog-title-order">Maintenance Order Details</h3>
      </template>
      <div class="p-col-12 order-detail">
        <div class="p-grid nested-grid">
          <TabView>
            <TabPanel header="Overview">
              <div class="p-grid">
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Maintenance Worker: </span
                    >{{ product.maintenanceWorkerName }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Location Name: </span
                    >{{ product.locationName }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Status: </span>
                    <span :class="stockStatusOrder(product)">
                      {{ product.status }}
                    </span>
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Maintenance Date: </span
                    >{{ product.maintenanceDate }}
                  </p>
                </div>
                <div class="p-col-12">
                  <p>
                    <span style="font-weight: bold">Assessor Name: </span
                    >{{ product.assessorName }}
                  </p>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Description">
              <div class="p-col-12">
                <p>
                  <span
                    style="font-weight: bold"
                    v-if="product.desciption != null"
                    >{{ product.description }}</span
                  >
                  <span
                    style="font-weight: bold"
                    v-if="
                      product.desciption == null || product.desciption.isEmpty()
                    "
                  >
                    <span style="font-weight: normal">N/A</span></span
                  >
                </p>
              </div>
            </TabPanel>
            <TabPanel header="Assessment" :disabled="check">
              <div class="p-col-12">
                <div class="p-field">
                  <Rating
                    :modelValue="product.assessmentResult"
                    :readonly="true"
                    :stars="5"
                    :cancel="false"
                  />
                </div>
                <div class="p-field">
                  <label for="assessmentDescription"
                    >Assessment Description</label
                  >
                  <Textarea
                    id="description"
                    v-model="product.assessmentDescription"
                    required="true"
                    rows="2"
                    cols="20"
                    disabled
                  />
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </Dialog>
    <Dialog
      v-model:visible="crackInfoDialog"
      :style="{ width: '1000px' }"
      :modal="true"
      class="dialog"
    >
      <template #header>
        <h3 class="dialog-title">Crack Information</h3>
      </template>
      <div class="p-grid nested-grid">
        <div class="p-col-4">
          <img
            :src="product.imageThumbnails"
            :alt="product.imageThumbnails"
            class="product-image"
            v-if="product.image"
            @click="showImage(product)"
            style="width:250px; height:100%"
          />
        </div>
        <div class="p-col-8">
          <TabView>
            <TabPanel header="Overview">
              <div class="p-grid">
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Location Name: </span
                    >{{ product.locationName }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Position: </span
                    >{{ product.position }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Severity: </span>
                    <span :class="stockClass(product)">
                      {{ product.severity }}
                    </span>
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Status: </span>
                    <span :class="stockStatus(product)">
                      {{ product.status }}
                    </span>
                  </p>
                </div>
                <div class="p-col-6" v-if="product.censorName != null">
                  <p>
                    <span style="font-weight: bold">Censor Name: </span
                    >{{ product.censorName }}
                  </p>
                </div>
                <div class="p-col-6" v-if="product.censorName != null">
                  <p>
                    <span style="font-weight: bold">Updated User: </span
                    >{{ product.updateUserName }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Created Date: </span
                    >{{ product.created }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Last Modified: </span
                    >{{ product.lastModified }}
                  </p>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Description">
              <div class="p-col-12">
                <p>
                  <span
                    style="font-weight: bold"
                    v-if="product.desciption != null"
                    >{{ product.description }}</span
                  >
                  <span
                    style="font-weight: bold"
                    v-if="
                      product.desciption == null || product.desciption.isEmpty()
                    "
                  >
                    <span style="font-weight: normal">N/A</span></span
                  >
                </p>
              </div>
            </TabPanel>
            <TabPanel header="Assessment" :disabled="check">
              <div class="p-col-12">
                <span style="font-weight: bold">Assessment </span>
                <Rating
                  :modelValue="product.assessmentResult"
                  :readonly="true"
                  :stars="5"
                  :cancel="false"
                  class="p-col-9"
                />
              </div>
              <div
                class="p-col-12 p-mt-0"
                v-if="product.assessmentDescription != null"
              >
                <p style="font-weight: bold">Assessment Descripton</p>
                <Textarea
                  id="description"
                  v-model="product.assessmentDescription"
                  required="true"
                  rows="2"
                  cols="20"
                  disabled
                />
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </Dialog>
    <div class="imagePopup" v-if="displayImage" @click="hiddenImage">
      <img :src="crack.image" style="width:90%; height: 80%;" />
    </div>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import Toast from "primevue/toast";
import Skeleton from "primevue/skeleton";
import Rating from "primevue/rating";
import { mapGetters, mapActions } from "vuex";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import moment from "moment";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import crackApi from "../apis/cracks.js";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    MultiSelect,
    Skeleton,
    Rating,
    TabView,
    TabPanel,
  },

  computed: {
    ...mapGetters("maintenanceOrder", [
      "getMaintenanceOrderList",
      "getStatusList",
    ]),
  },

  async created() {
    this.initFilters(this.$route.query.orderId);
    this.setMaintenanceOrderList();
    this.loading = false;
  },

  data() {
    return {
      crackInfoDialog: false,
      productDialog: false,
      showAssessment: false,
      product: {},
      crack: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Waiting for maintenance", "Completed"],
      severitys: ["Low", "Medium", "High"],
      expandedRows: [],
      loading: true,
      displayImage: false,
      check: true,
    };
  },

  methods: {
    ...mapActions("maintenanceOrder", ["setMaintenanceOrderList"]),
    onRowExpand() {},
    onRowCollapse() {},
    hideDialog() {
      this.productDialog = false;
      this.showAssessment = false;
      this.submitted = false;
      this.crackInfoDialog = false;
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
    async showDetail(product) {
      this.product = await crackApi.getById(product.crackId);
      if (
        this.product.assessmentResult != null &&
        this.product.assessmentResult != ""
      ) {
        this.check = false;
      } else {
        this.check = true;
      }

      this.product.created = this.callDate(this.product.created);
      this.product.lastModified = this.callDate(this.product.lastModified);
      this.crackInfoDialog = true;
    },
    editProduct(product) {
      this.product = { ...product };
      if (
        this.product.assessmentResult != null &&
        this.product.assessmentResult != 0
      ) {
        this.check = false;
      } else {
        this.check = true;
      }
      this.product.maintenanceDate = this.callDate(
        this.product.maintenanceDate
      );
      this.productDialog = true;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    initFilters(search) {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        maintenanceOrderId: {
          operator: FilterOperator.AND,
          constraints: [{ value: search, matchMode: FilterMatchMode.EQUALS }],
        },
        maintenanceWorkerName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        assessorName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        locationName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        status: { value: null, matchMode: FilterMatchMode.IN },
        maintenanceDate: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
      };
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getMaintenanceOrderList.length; i++) {
        if (this.getMaintenanceOrderList[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    stockClass(data) {
      return [
        {
          low: data.severity === "Low",
          medium: data.severity === "Medium",
          high: data.severity === "High",
        },
      ];
    },
    stockStatus(data) {
      return [
        {
          detectedFailed: data.status === "DetectedFailed",
          unconfirmed: data.status === "Unconfirmed",
          unscheduled: data.status === "Unscheduled for maintenance",
          scheduledformaintenace: data.status === "Scheduled for maintenance",
          fix: data.status === "Fixed",
        },
      ];
    },
    stockStatusOrder(data) {
      return [
        {
          detectedFailed: data.status === "Waiting for confirm",
          unconfirmed: data.status === "Waiting for maintenance",
          fix: data.status === "Completed",
        },
      ];
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

<style scoped>
textarea {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none; /*remove the resize handle on the bottom right*/
}
.dialog-title {
  color: #69707a;
  margin-left: 44px;
  display: flex;
  align-items: center;
}

.dialog-title-order {
  color: #69707a;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.p-dialog-titlebar {
  background: black;
}
::v-deep(.p-dialog .p-dialog-header) {
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
}

::v-deep(.p-dialog) {
  border-radius: 24px;
}

::v-deep(.p-dialog .p-dialog-content) {
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
  min-height: 270px;
}
::v-deep(.p-tabview .p-tabview-panels) {
  color: #69707a;
}

::v-deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: #2170e7;
}

::v-deep(.p-tabview .p-tabview-panels .p-grid .p-col-6) {
  margin: 10px 0;
}

::v-deep(.p-tabview .p-tabview-panels .p-grid .p-col-12) {
  margin: 10px 0;
}
.dialog-title::before,
.dialog-title-order::before {
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

.p-dialog .product-image {
  width: 150px;
  margin: 0 auto 2rem auto;
  display: block;
}
.small {
  background-color: #66bb6a;
}
.p-fluid .p-dialog-footer .p-button {
  /* margin-bottom: -10px; */
  margin-top: -20px;
}
.orders-subtable {
  border-radius: 24px;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  color: #69707a;
  padding: 1rem;
  font-weight: 700;
}

.p-dialog .crack-image {
  width: 150px;
  margin: 0 auto 2rem auto;
  display: block;
}

.crack-image {
  width: 100px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.confirmation-content {
  display: flex;
  align-items: center;
}
.underline {
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid black;
}
.low {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #66bb6a;
}

.medium {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ffa726;
}

.high {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ff5252;
}
.detectedFailed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ff5252;
}
.unconfirmed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ffa726;
}
.unscheduled {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #66bb6a;
}
.scheduledformaintenace {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #ff5252;
}
.fix {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #61ff52;
}

.p-col-12 .nested-grid {
  min-height: 345px;
}

.p-col-12 .order-detail .nested-grid {
  min-height: 200px;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-m-2::before {
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

.p-m-2 {
  display: flex;
  align-items: center;
}

#sub-table-title {
  font-size: 1.1rem;
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #fcfcfc;
  color: #69707a;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-width: 0 0 1px 0;
  text-align: left;
  box-sizing: content-box;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  font-weight: 700;
}
::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: left;
  border: 1px solid #e9ecef;
  border-width: 0 0 1px 0;
  padding: 1rem 1rem;
}

::v-deep(.p-datatable.p-datatable-hoverable-rows
    .p-datatable-tbody
    > tr:not(.p-highlight):hover) {
  background: white;
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

::v-deep(.p-datatable-row-expansion
    .p-datatable-wrapper
    .p-datatable-table
    .p-datatable-thead
    .p-column-header-content
    .p-column-title) {
  display: block;
}

::v-deep(.p-dialog .p-dialog-header) {
  background: #ffffff;
  color: #69707a;
  font-weight: 700;
  border-bottom: 0 none;
  padding: 1rem;
}

::v-deep(.p-dialog .p-dialog-content) {
  color: #69707a;
  min-height: 286px;
}

::v-deep(.p-tabview.p-component) {
  width: 100%;
}

.table-header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fcfcfc;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-width: 0 0 1px 0;
  color: #69707a;
  padding: 1rem;
  font-weight: 700;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.p-grid .nested-grid {
  min-height: 320px;
}
</style>
