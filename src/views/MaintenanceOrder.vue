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
          <h3
            class="p-m-2"
            style="color: #143178;font-weight: 400;font-size:25px"
          >
            Repair Records
          </h3>
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
        <template #empty> No Repair Record found. </template>
        <Column :expander="true" headerStyle="width: 30px" />
        <Column header="No" style="width:2rem">
          <template #body="slotProps">
            {{ slotProps.data.index }}
          </template>
        </Column>
        <Column
          field="locationName"
          header="Area Name"
          :showFilterMatchModes="false"
          :showAddButton="false"
        >
          <template #body="slotProps">
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
          header="Repairer"
          :showFilterMatchModes="false"
          :showAddButton="false"
        >
          <template #body="slotProps">
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
          header="Repair Date"
          filterField="maintenanceDate"
          dataType="date"
          style="min-width: 20px"
          headerStyle="width: 13em"
          :showAddButton="false"
        >
          <template #body="{ data }">
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
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'View Record details'"
            />
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="orders-subtable">
            <div class="table-header">
              <h4 class="p-m-2" id="sub-table-title">List of Cracks</h4>
            </div>
            <DataTable :value="slotProps.data.cracks">
              <Column header="No" style="width:3rem">
                <template #body="slotProps">
                  {{ slotProps.data.index }}
                </template>
              </Column>
              <Column header="Image" headerStyle="width: 150px" class="small">
                <template #body="slotProps">
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
                  <span :class="stockClass(slotProps.data)">
                    {{ slotProps.data.severity }}
                  </span>
                </template>
              </Column>
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <span :class="stockStatus(slotProps.data)">
                    {{ slotProps.data.status }}
                  </span>
                </template>
              </Column>
              <Column field="created" header="Created Date" sortable>
                <template #body="slotProps">
                  <span>{{ callDate(slotProps.data.created) }}</span>
                </template>
              </Column>
              <Column headerStyle="width:4rem">
                <template #body="slotProps">
                  <Button
                    icon="pi pi-eye"
                    @click="showDetail(slotProps.data)"
                    class="p-button-rounded p-button-info p-button-text"
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
        <h3 class="dialog-title-order">Repair Record Details</h3>
      </template>
      <div class="p-col-12 order-detail">
        <div class="p-grid nested-grid">
          <TabView>
            <TabPanel header="Overview">
              <div class="p-grid">
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Repairer: </span
                    >{{ product.maintenanceWorkerName }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Area Name: </span
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
                    <span style="font-weight: bold">Repair Date: </span
                    >{{ product.maintenanceDate }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Assessor Name: </span
                    >{{ product.assessorName }}
                  </p>
                </div>
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Expense: </span
                    >{{ product.maintenanceExpense }}
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
            style="width:250px; height:80%"
          />
        </div>
        <div class="p-col-8">
          <TabView>
            <TabPanel header="Overview">
              <div class="p-grid">
                <div class="p-col-6">
                  <p>
                    <span style="font-weight: bold">Area Name: </span
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
    <Galleria
      :value="cracks"
      :numVisible="7"
      containerStyle="max-width: 850px"
      :circular="true"
      :fullScreen="true"
      :showItemNavigators="true"
      :showThumbnails="false"
      v-model:visible="displayImage"
      v-model:activeIndex="activeIndex"
    >
      <template #item="slotProps">
        <img
          :src="slotProps.item.image"
          style="width: 1100px; display: block;"
        />
        <button
          type="button"
          class="buttonView p-link"
          v-tooltip.right="'View Crack Details'"
          @click="showDetail(slotProps.item)"
        >
          <i class="pi pi-fw pi-eye" style="fontSize: 2rem;"></i>
        </button>
      </template>
      <template #thumbnail="slotProps">
        <img :src="slotProps.item.imageThumbnails" style="display: block;" />
      </template>
    </Galleria>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import Toast from "primevue/toast";
import Rating from "primevue/rating";
import { mapGetters, mapActions } from "vuex";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import moment from "moment";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import crackApi from "../apis/cracks.js";
import Galleria from "primevue/galleria";

export default {
  components: {
    Button,
    Toast,
    Calendar,
    MultiSelect,
    Rating,
    TabView,
    TabPanel,
    Galleria,
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
      cracks: [],
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
      activeIndex: 0,
    };
  },

  methods: {
    ...mapActions("maintenanceOrder", ["setMaintenanceOrderList"]),
    onRowExpand(event) {
      this.expandedRows = this.getMaintenanceOrderList.filter(
        (p) => p.maintenanceOrderId == event.data.maintenanceOrderId
      );
      console.log(event);
      this.cracks = [];
      this.cracks = event.data.cracks;
    },
    onRowCollapse() {
      this.cracks = [];
    },
    hideDialog() {
      this.productDialog = false;
      this.showAssessment = false;
      this.submitted = false;
      this.crackInfoDialog = false;
    },
    showImage(crack) {
      this.crackInfoDialog = false;
      this.activeIndex = crack.index - 1;
      console.log(this.activeIndex);
      this.displayImage = true;
    },
    hiddenImage() {
      this.displayImage = false;
    },
    async showDetail(product) {
      this.displayImage = false;
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
      this.product.index = product.index;
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
          unscheduled: data.status === "UnrecordedRepair",
          scheduledformaintenace: data.status === "RecordedRepair",
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
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #25c997;
  /* background-color:#e2fff6;

    text-align: center;
  width: 80px; */
}

.medium {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.3px;
  color: #ffad44;
  /* background-color:#fff4de;
    text-align: center;
  width: 80px; */
  text-transform: uppercase;
}

.high {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #ff0019;
  /* text-align: center;
  width: 80px;
    background-color:#ffe2e5; */
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
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: rgb(255, 65, 65);
}
.unscheduled {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #fd517d;
  /* text-align: center;
  width: 110px;
    background-color:#b9eee9; */
}
.scheduledformaintenace {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #3699ff;
  /* text-align: center;
  width: 110px;
    background-color:#e1f0ff; */
}
.fix {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #316879;
  /* text-align: center;
  width: 110px;
    background-color:#c7d7db; */
}

.p-col-12 .nested-grid {
  min-height: 345px;
}

.p-col-12 .order-detail .nested-grid {
  min-height: 200px;
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
  background: #ffffff;
  color: #8890b5;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-width: 0 0 1px 0;
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
  background: #ffffff;
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

.buttonView {
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  color: white;
  background: transparent;
  width: 4rem;
  height: 4rem;
  transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
  border-radius: 50%;
  margin: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttonView:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8f9fa;
}

::v-deep(.p-datatable .p-paginator-bottom) {
  border-width: 0 0 0 0;
}
</style>
