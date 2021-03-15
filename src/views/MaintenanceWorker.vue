<template>
  <div>
    <div class="card">
      <DataTable
        :rowHover="true"
        :scrollable="true"
        ref="dt"
        :value="getMaintenanceWorkerList"
        dataKey="id"
        :paginator="true"
        :rows="5"
        v-model:filters="filters"
        :globalFilterFields="['name', 'phone', 'email', 'created']"
        filterDisplay="menu"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
      >
        <div class="table-header">
          <h3 class="p-m-2">Maintenance Workers</h3>
          <span class="p-input-icon-left">
            <Button
              icon="pi pi-plus"
              class="p-button-success p-mr-2"
              @click="openNew"
              style="margin: 2px"
              label="New"
            />

            <span class="p-input-icon-left" style="margin: 2px">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </span>
        </div>
        <template #empty> No Maintenance Worker found. </template>
        <Column field="name" header="Name" :showFilterMatchModes="false">
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.name }}
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
        <Column field="phone" header="Phone" :showFilterMatchModes="false">
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.phone }}
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
        <Column field="email" header="Email" :showFilterMatchModes="false">
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.email }}
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
        <Column field="address" header="Address" :showFilterMatchModes="false">
          <template #body="slotProps">
            <Skeleton v-if="loading" />
            {{ slotProps.data.address }}
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
          header="Created"
          filterField="created"
          dataType="date"
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            <Skeleton v-if="loading" />
            {{ callDate(data.created) }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
            />
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'Edit'"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="confirmDeleteProduct(slotProps.data)"
              v-tooltip.bottom="'Disable'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Maintenance Worker Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name" class="form-control-label">Name</label>
        <InputText
          name="name"
          v-model.trim="name"
          class="form-control form-control-alternative"
          placeholder="Name"
        />
        <small class="invalid">{{ errors.name }}</small>
      </div>
      <div class="p-field">
        <label for="phone" class="form-control-label">Phone</label>
        <InputMask
          name="phone"
          mask="9999999999"
          v-model.trim="phone"
          class="form-control form-control-alternative"
          placeholder="Phone"
        />
        <small class="invalid">{{ errors.phone }}</small>
      </div>
      <div class="p-field">
        <label for="address" class="form-control-label">Address</label>
        <InputText
          name="address"
          v-model="address"
          class="form-control form-control-alternative"
          placeholder="Address"
        />
        <small class="invalid">{{ errors.address }}</small>
      </div>
      <div class="p-field">
        <label for="email" class="form-control-label">Email</label>
        <InputText
          type="email"
          name="email"
          v-model.trim="email"
          class="form-control form-control-alternative"
          placeholder="Email"
        />
        <small class="invalid">{{ errors.email }}</small>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <p class="form-control-label">Created Date</p>
          <span class="form-control form-control-alternative">{{
            product.created
          }}</span>
        </div>
        <div class="p-field p-col-6">
          <p class="form-control-label">Last Modified</p>
          <span class="form-control form-control-alternative">{{
            product.lastModified
          }}</span>
        </div>
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
          @click="editMaintenanceWorker"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="CreateProductDialog"
      :style="{ width: '450px' }"
      header="Create Maintenance Worker"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name" class="form-control-label">Name</label>
        <InputText
          id="name"
          v-model="name"
          class="form-control form-control-alternative"
          placeholder="Name"
        />
        <small class="invalid">{{ errors.name }}</small>
      </div>
      <div class="p-field">
        <label for="phone" class="form-control-label">Phone</label>
        <InputMask
          id="phone"
          minlenght="10"
          mask="9999999999"
          v-model="phone"
          class="form-control form-control-alternative"
          placeholder="Phone"
        />
        <small class="invalid">{{ errors.phone }}</small>
      </div>
      <div class="p-field">
        <label for="address" class="form-control-label">Address</label>
        <InputText
          id="address"
          v-model="address"
          class="form-control form-control-alternative"
          placeholder="Address"
        />
        <small class="invalid">{{ errors.address }}</small>
      </div>
      <div class="p-field">
        <label for="email" class="form-control-label">Email</label>
        <InputText
          name="email"
          v-model="email"
          required="true"
          class="form-control form-control-alternative"
          placeholder="Email"
        />
        <small class="invalid">{{ errors.email }}</small>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Create"
          icon="pi pi-check"
          class="p-button-text"
          @click="createMaintenanceWorker"
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
          >Are you sure to disable this worker
          <span style="color: red; font-weight: bold">{{ product.name }}</span
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
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import Button from "primevue/button";
import Calendar from "primevue/calendar";
import InputMask from "primevue/inputmask";
import Toast from "primevue/toast";
import Skeleton from "primevue/skeleton";
import contentNoti from "../util/contentNoti.js";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import maintenanceWorkerApi from "../apis/maintenanceWorker.js";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

export default {
  setup() {
    const schema = yup.object({
      email: yup.string().required().email(),
      address: yup.string().max(30).label("Address"),
      name: yup
        .string()
        .required("Worker Name can't be blank")
        .max(20)
        .label("Name"),
      phone: yup.string().required().label("Phone"),
    });
    const { errors, meta, handleReset } = useForm({
      validationSchema: schema,
    });

    const { value: email } = useField("email");
    const { value: name } = useField("name");
    const { value: address } = useField("address");
    const { value: phone } = useField("phone");

    return {
      handleReset,
      email,
      name,
      address,
      phone,
      errors,
      meta,
    };
  },

  components: {
    Button,
    Toast,
    Calendar,
    InputMask,
    Skeleton,
  },
  computed: {
    ...mapGetters("maintenanceWorker", ["getMaintenanceWorkerList"]),

    data() {
      return this.getMaintenanceWorkerList;
    },
  },
  data() {
    return {
      CreateProductDialog: false,
      deleteProductsDialog: false,
      productDialog: false,
      product: {},
      selectedProducts: null,
      filters: {},
      submitted: false,
      messages: [],
      statuses: ["Available", "Unavailable"],
      loading: true,
    };
  },
  async created() {
    this.initFilters();
    await this.setMaintenanceWorkerList();
    this.loading = false;
  },

  methods: {
    ...mapActions("maintenanceWorker", ["setMaintenanceWorkerList"]),
    confirmDeleteProduct(product) {
      this.product = product;
      this.deleteProductsDialog = true;
    },
    async createMaintenanceWorker() {
      if (this.meta.valid) {
        await maintenanceWorkerApi
          .create(this.name, this.address, this.phone, this.email)
          .catch((err) => {
            alert(err);
          })
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.MAINTENANCEWORKER_CREATE_SUCCESS,
              life: 3000,
            });
            this.setMaintenanceWorkerList();
            this.hideDialog();
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.MAINTENANCEWORKER_CREATE_FAILED,
              life: 3000,
            });
            this.hideDialog();
          });
      }
    },
    async editMaintenanceWorker() {
      if (this.meta.valid) {
        await maintenanceWorkerApi
          .update(
            this.product.maintenanceWorkerId,
            this.name,
            this.address,
            this.phone,
            this.email
          )
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.MAINTENANCEWORKER_EDIT_SUCCESS,
              life: 3000,
            });
            this.setMaintenanceWorkerList();
            this.productDialog = false;
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.MAINTENANCEWORKER_EDIT_FAILED,
              life: 3000,
            });
            this.productDialog = false;
          });
      }
    },

    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        phone: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        email: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        created: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
      };
    },

    async deleteSelectedProducts() {
      await maintenanceWorkerApi
        .disable(this.product.maintenanceWorkerId)
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: contentNoti.SUCCESS_SUMMARY,
            detail: contentNoti.MAINTENANCEWORKER_DISABLE_SUCCESS,
            life: 3000,
          });
          this.setMaintenanceWorkerList();
          this.hideDialog();
        })
        .catch(() => {
          this.$toast.add({
            severity: "error",
            summary: contentNoti.FAIL_SUMMARY,
            detail: contentNoti.MAINTENANCEWORKER_DISABLE_FAILED,
            life: 3000,
          });
          this.hideDialog();
        });
    },
    openNew() {
      this.handleReset();
      this.CreateProductDialog = true;
    },
    editProduct(product) {
      this.product = { ...product };
      this.product.created = this.callDate(this.product.created);
      this.product.lastModified = this.callDate(this.product.lastModified);
      this.name = this.product.name;
      this.address = this.product.address;
      this.phone = this.product.phone;
      this.email = this.product.email;
      this.submitted = false;
      this.productDialog = true;
    },
    hideDialog() {
      this.productDialog = false;
      this.CreateProductDialog = false;
      this.deleteProductsDialog = false;
      this.submitted = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.getMaintenanceWorkerList.length; i++) {
        if (this.getMaintenanceWorkerList[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
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
::v-deep(.p-dialog .p-dialog-header) {
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
}

::v-deep(.p-dialog) {
  border-radius: 24px;
}
::v-deep(.p-dialog .p-dialog-header .p-dialog-title) {
  color: #69707a;
  margin-left: 12px;
}

::v-deep(.p-dialog .p-dialog-footer) {
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
}

::v-deep(.p-fluid .p-inputtext) {
  border-radius: 8px;
}
::v-deep(.p-fluid .p-inputtext) {
  border-radius: 8px;
}
::v-deep(.p-dialog .p-dialog-header .p-dialog-title::before) {
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
label {
  display: inline-block;
  margin-bottom: 0.5rem;
}
.form-control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #525f7f;
}
.form-control:-ms-input-placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control::-ms-input-placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control::placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control:focus:-ms-input-placeholder {
  color: #adb5bd;
}
.form-control:focus::-ms-input-placeholder {
  color: #adb5bd;
}
.form-control:focus::placeholder {
  color: #adb5bd;
}
.form-control {
  font-size: 1rem;
  line-height: 1.5;
  display: block;
  width: 100%;
  height: calc(2.75rem + 2px);
  padding: 0.625rem 0.75rem;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  color: #8898aa;
  border: 1px solid #cad1d7;
  border-radius: 0.375rem;
  background-color: #fff;
  background-clip: padding-box;
  box-shadow: none;
}
.form-control:focus {
  color: #8898aa;
  border-color: rgba(50, 151, 211, 0.25);
  outline: 0;
  background-color: #fff;
  box-shadow: none, none;
}
.form-control {
  font-size: 0.875rem;
}
.focused .form-control {
  border-color: rgba(50, 151, 211, 0.25);
}
.form-control:disabled,
.form-control[readonly] {
  opacity: 1;
  background-color: #fff;
}
.form-control-alternative {
  transition: box-shadow 0.15s ease;
  border: 0;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
}
.form-control-alternative:focus {
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}
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
.invalid {
  color: red;
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
  top: 25px;
  background: #007dfe;
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
</style>
