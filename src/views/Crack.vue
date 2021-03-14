<template>
  <div>
    <div class="imagePopup" v-if="displayImage" @click="hiddenImage">
      <img :src="product.image" style="width:90%; height: 80%;" />
    </div>
    <div class="card">
      <DataTable
        :rowHover="true"
        :scrollable="true"
        ref="dt"
        :value="getCrackList"
        dataKey="id"
        :paginator="true"
        :rows="5"
        :loading="loading"
        :globalFilterFields="['locationName', 'reporterName']"
        v-model:filters="filters"
        filterDisplay="menu"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
      >
        <div class="table-header">
          <h5 class="p-m-2">Cracks</h5>
          <span class="p-input-icon-left" style="margin: 2px">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </span>
        </div>
        <template #empty> No Cracks found. </template>
        <template #loading>
          Loading Crack, please wait...
        </template>
        <Column header="Image">
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            <img
              :src="slotProps.data.imageThumbnails"
              :alt="slotProps.data.imageThumbnails"
              class="product-image"
              style="width: 80px ; height: 80px"
              @click="showImage(slotProps.data)"
            />
          </template>
        </Column>
        <Column
          field="locationName"
          header="Location Name"
          :showFilterMatchModes="false"
          style="min-width:12rem"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.locationName }}
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
          field="accuracy"
          header="Accuracy"
          :showFilterMatchModes="false"
          style="min-width:12rem"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.accuracy }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search "
            />
          </template>
        </Column>
        <Column
          header="Severity"
          filterField="severity"
          :showFilterMatchModes="false"
          :filterMenuStyle="{ width: '14rem' }"
          headerStyle="width: 2em"
        >
          <template #body="{data}">
            <Skeleton v-if="loading" />
            <span :class="stockClass(data)">
              {{ data.severity }}
            </span>
          </template>
          <template #filter="{filterModel}">
            <div class="p-mb-3 p-text-bold">Severity Picker</div>
            <MultiSelect
              v-model="filterModel.value"
              :options="getSeveritysList"
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
          header="Status"
          filterField="status"
          :showFilterMatchModes="false"
          :filterMenuStyle="{ width: '12rem' }"
          style="min-width:12rem"
        >
          <template #body="{data}">
            <Skeleton v-if="loading" />
            <span :class="stockStatus(data)">
              {{ data.status }}
            </span>
          </template>
          <template #filter="{filterModel}">
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
        <Column :filterMenuStyle="{ width: '5rem' }">
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text p-mr-2"
              @click="showDetail(slotProps.data)"
              style="margin: 2px"
              v-tooltip.bottom="'View Crack Details'"
            />
            <Button
              v-if="slotProps.data.maintenanceOrderId != null"
              icon="pi pi-calendar-minus"
              class="p-button-rounded p-button-danger p-button-text"
              @click="showMaintenanceOrder(slotProps.data)"
              v-tooltip.bottom="'View Maintenance Order'"
            />
            <Button
              icon="pi pi-video"
              class="p-button-rounded p-button-help p-button-text"
              @click="$router.push('/video')"
              v-tooltip.bottom="'Show Video'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
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
                    <span style="font-weight: bold">
                      Severity:
                    </span>
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
                <div class="p-col-12">
                  <p>
                    <span style="font-weight: bold">Reporter Name: </span
                    >{{ product.reporterName }}
                  </p>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Assessment">
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
          </TabView>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Button from "primevue/button";
import MultiSelect from "primevue/multiselect";
import Rating from "primevue/rating";
import Textarea from "primevue/textarea";
import moment from "moment";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { mapGetters, mapActions } from "vuex";
import Skeleton from "primevue/skeleton";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

export default {
  components: {
    Button,
    Rating,
    Textarea,
    MultiSelect,
    Skeleton,
    TabView,
    TabPanel,
  },
  computed: {
    ...mapGetters("crack", [
      "getCrackList",
      "getStatusList",
      "getSeveritysList",
    ]),

    data() {
      return this.getCrackList;
    },
  },
  data() {
    return {
      image: null,
      crackInfoDialog: false,
      showAssessment: false,
      product: {},
      filters: {},
      submitted: false,
      messages: [],
      loading: true,
      displayImage: false,
    };
  },
  created() {
    this.initFilters();
    this.setCrackList();
    this.loading = false;
  },
  methods: {
    ...mapActions("crack", ["setCrackList"]),
    showImage(product) {
      this.product = { ...product };
      document.body.style.overflow = "hidden";
      this.displayImage = true;
    },
    hiddenImage() {
      document.body.style.overflow = "visible";
      this.displayImage = false;
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
    hideDialog() {
      this.showAssessment = false;
      this.crackInfoDialog = false;
      this.submitted = false;
    },
    showMaintenanceOrder(product) {
      this.product = { ...product };
      this.$router.push(
        "/maintenanceOrders?orderId=" + this.product.maintenanceOrderId
      );
    },
    showDetail(product) {
      this.product = { ...product };
      this.product.created = this.callDate(this.product.created);
      this.product.lastModified = this.callDate(this.product.lastModified);
      this.crackInfoDialog = true;
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    redirectMainteanceOrder() {},
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY hh:mm:ss");
    },

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        locationName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        accuracy: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        severity: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.IN },
      };
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
.table-header {
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
  justify-content: center;
}
textarea {
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none; /*remove the resize handle on the bottom right*/
}
.low {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #61ff6b;
}

.medium {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.3px;
  color: #ffbe49;
  text-transform: uppercase;
}

.high {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #ff2323ba;
}
.detectedFailed {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
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
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: #46e5ff;
}
.scheduledformaintenace {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: rgb(73, 73, 255);
}
.fix {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #61ff52;
}

h5 {
  font-size: 1.25rem;
}

.dialog-title {
  color: #69707a;
  margin-left: 20px;
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

.p-dialog-titlebar {
  background: black;
}

.p-m-2::before,
.dialog-title::before {
  content: "";
  width: 5px;
  height: 12px;
  display: block;
  border-radius: 3px;
  padding-bottom: 10px;
  position: relative;
  left: -10px;
  top: 25px;
  background: #007dfe;
}

.p-grid .nested-grid {
  min-height: 320px;
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
  min-height: 345px;
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
</style>
