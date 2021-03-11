<template>
  <div>
    <div class="card">
      <DataTable
        :rowHover="true"
        :scrollable="true"
        ref="dt"
        :value="getLocationList"
        dataKey="id"
        :paginator="true"
        :rows="5"
        v-model:filters="filters"
        :globalFilterFields="['name', 'description']"
        filterDisplay="menu"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} locations"
      >
        <template #header>
          <div class="table-header">
            <h5 class="p-m-0" style="font-size:1.25rem">Manage Locations</h5>
            <span class="p-input-icon-left">
              <Button
                icon="pi pi-plus"
                class="p-button-success p-mr-2"
                @click="openNew"
                style="margin:2px"
                label="New"
                v-if="admin"
              />
              <Button
                label="Export"
                icon="pi pi-upload"
                class="p-button-help"
                @click="exportCSV($event)"
                style="margin:2px"
              />
              <span class="p-input-icon-left" style="margin:2px">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </span>
            </span>
          </div>
        </template>

        <template #empty>
          No Locations found.
        </template>
        <Column
          field="name"
          header="Location Name"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.name }}
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
          field="description"
          header="Description"
          :showFilterMatchModes="false"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.description }}
          </template>
          <template #filter="{filterModel}">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by Description"
            />
          </template>
        </Column>
        <Column
          header="Created"
          filterField="created"
          dataType="date"
          style="min-width:10rem"
        >
          <template #body="{data}">
            <Skeleton v-if="loading" />
            {{ callDate(data.created) }}
          </template>
          <template #filter="{filterModel}">
            <Calendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            />
          </template>
        </Column>
        <Column
          header="Last Modified"
          filterField="lastModified"
          dataType="date"
          style="min-width:10rem"
        >
          <template #body="{data}">
            <Skeleton v-if="loading" />
            {{ callDate(data.lastModified) }}
          </template>
          <template #filter="{filterModel}">
            <Calendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            />
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-text p-mr-2"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'View Location Detail'"
              style="margin: 2px"
              v-if="admin"
            />
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text p-mr-2"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'View Location Detail'"
              style="margin: 2px"
              v-if="!admin"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="confirmDeleteProduct(slotProps.data)"
              style="margin: 2px"
              v-tooltip.bottom="'Disable Location'"
              v-if="admin"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="createLocationDiaglog"
      :style="{ width: '450px' }"
      header="Location Information"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name"> Location Name</label>
        <InputText
          id="locationName"
          v-model.trim="locationName"
          maxlength="30"
        />
        <small class="invalid">{{ errors.locationName }}</small>
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <InputText
          id="description"
          v-model.trim="description"
          required="true"
        />
        <small class="invalid">{{ errors.description }}</small>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="createLocation"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Location Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name"> Location Name</label>
        <InputText
          id="locationName"
          v-model.trim="locationName"
          required="true"
          maxlength="30"
        />
        <InputText
          id="locationName"
          v-model.trim="locationName"
          required="true"
          maxlength="30"
          disabled
          v-if="!admin"
        />
        <small class="invalid"> {{ errors.locationName }}</small>
      </div>
      <div class="p-field">
        <label for="description">Description</label>
        <InputText
          id="description"
          v-model.trim="description"
        />
        <InputText
          id="description"
          v-model.trim="description"
          disabled
          v-if="!admin"
        />
        <small class="invalid"> {{ errors.description }}</small>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="created"> Created Date</label>
          <p>{{ product.created }}</p>
        </div>
        <div class="p-field p-col-6">
          <label for="lastModified"> Last Modified</label>
          <p>{{ product.lastModified }}</p>
        </div>
      </div>
      <template #footer v-if="admin">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="updateLocation"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure to delete the location
          <span style="color:red; font-weight: bold;">{{ product.name }}</span
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedLocation"
        />
      </template>
    </Dialog>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import Toast from "primevue/toast";
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import { locationApi } from "../apis/location";
import moment from "moment";
import contentNoti from "../util/contentNoti.js";
import { mapGetters, mapActions } from "vuex";
import { useForm, useField } from "vee-validate";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import Skeleton from "primevue/skeleton";
import webRole from "../util/webRole.js";
import * as yup from "yup";

export default {
  setup() {
    const schema = yup.object({
      description: yup.string().max(100),
      locationName: yup
        .string()
        .required("Location Name can't be blank")
        .max(20),
    });

    const { errors, meta, handleReset } = useForm({
      validationSchema: schema,
    });

    const { value: description } = useField("description");
    const { value: locationName } = useField("locationName");

    return {
      description,
      locationName,
      errors,
      meta,
      handleReset,
      Skeleton,
    };
  },

  components: {
    Button,
    Calendar,
    Toast,
  },
  computed: {
    ...mapGetters("location", ["getLocationList"]),

    data() {
      return this.getLocationList;
    },
  },
  data() {
    return {
      deleteProductsDialog: false,
      productDialog: false,
      createLocationDiaglog: false,
      product: {},
      filters: {},
      submitted: false,
      messages: [],
      warnning: "",
      search: false,
      loading: true,
      role: null,
      admin: false,
    };
  },
  created() {
    this.initFilters();
    this.setLocationList();
    this.loading = false;
  },

  mounted() {
    this.role = JSON.parse(localStorage.getItem("user")).role;
    if (this.role === webRole.ADMIN_ROLE) {
      this.admin = true;
    }
  },
  methods: {
    ...mapActions("location", ["setLocationList"]),

    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductsDialog = true;
    },
    openNew() {
      this.handleReset();
      this.createLocationDiaglog = true;
    },
    async createLocation() {
      if (this.meta.valid) {
        await locationApi
          .create(this.locationName, this.description)
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.LOCATION_CREATE_SUCCESS,
              life: 3000,
            });
            this.setLocationList();
            this.submitted = false;
            this.hideDialog();
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.LOCATION_CREATE_FAILED,
              life: 3000,
            });
            this.ChangePassworDialog = false;
          });
      }
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
    hideDialog() {
      this.createLocationDiaglog = false;
      this.productDialog = false;
      this.submitted = false;
      this.product = {};
      this.deleteProductsDialog = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    async deleteSelectedLocation() {
      await locationApi
        .disable(this.product.locationId)
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: contentNoti.SUCCESS_SUMMARY,
            detail: contentNoti.LOCATION_DISABLE_SUCCESS,
            life: 3000,
          });
          this.setLocationList();
          this.hideDialog();
        })
        .catch(() => {
          this.$toast.add({
            severity: "error",
            summary: contentNoti.FAIL_SUMMARY,
            detail: contentNoti.LOCATION_DISABLE_FAILED,
            life: 3000,
          });
          this.hideDialog();
        });
    },
    async updateLocation() {
      if (this.meta.valid) {
        await locationApi
          .update(this.product.locationId, this.locationName, this.description)
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.LOCATION_EDIT_SUCCESS,
              life: 3000,
            });
            this.setLocationList();
            this.productDialog = false;
            this.setLocationList();
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.LOCATION_EDIT_FAILED,
              life: 3000,
            });
            this.ChangePassworDialog = false;
          });
      }
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getLocationList.length; i++) {
        if (this.getLocationList[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD/MM/YYYY hh:mm:ss");
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
    formatDateTMP(date) {
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
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        description: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        created: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        lastModified: {
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
.invalid {
  color: red;
}

@media screen and (max-width: 40em) {
  ::v-deep(.p-datatable) {
    &.p-datatable-responsive-demo {
      .p-datatable-thead > tr > th,
      .p-datatable-tfoot > tr > td {
        display: none !important;
      }

      .p-datatable-tbody > tr > td {
        display: block;
        width: 100%;
        border: 0 none;

        .p-column-title {
          padding: 0.4rem;
          min-width: 30%;
          display: inline-block;
          margin: -0.4em 1em -0.4em -0.4rem;
          font-weight: bold;
        }

        &:last-child {
          border-bottom: 1px solid var(--surface-d);
          text-align: center;
        }

        .p-rating {
          display: inline-block;
        }
      }
    }
  }
}
</style>
