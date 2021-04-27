<template>
  <div class="main-layout-details">
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
        :globalFilterFields="['name', 'phone', 'email', 'address']"
        filterDisplay="menu"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
      >
        <div class="table-header">
          <h3
            class="p-m-2"
            style="color: #143178;font-weight: 400;font-size:22px"
          >
            Repairers
          </h3>
          <span class="p-input-icon-left">
            <Button
              icon="pi pi-plus"
              class="p-button-info p-mr-2"
              @click="openNew"
              v-if="isAdmin"
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
        <template #empty> No Repairer found. </template>
        <Column
          header="No"
          headerStyle="max-width: 30px;border-radius: 20px 0 0 20px; min-width: 30px"
          style="max-width:62px;"
        >
          <template #body="slotProps">
            {{ slotProps.data.index }}
          </template>
        </Column>
        <Column
          field="name"
          header="Name"
          :showFilterMatchModes="false"
          :showAddButton="false"
          :showFilterOperator="false"
          headerStyle="max-width: 230px; "
          style="max-width:300px; "
        >
          <template #body="slotProps">
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
        <Column
          field="phone"
          header="Phone"
          :showFilterMatchModes="false"
          :showAddButton="false"
          :showFilterOperator="false"
        >
          <template #body="slotProps">
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
        <Column
          field="email"
          header="Email"
          :showFilterMatchModes="false"
          :showAddButton="false"
          :showFilterOperator="false"
          headerStyle="min-width: 218px; "
          style="min-width:250px;"
        >
          <template #body="slotProps">
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
        <Column
          field="address"
          header="Address"
          :showFilterMatchModes="false"
          :showAddButton="false"
          :showFilterOperator="false"
        >
          <template #body="slotProps">
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
        <Column headerStyle="border-radius: 0 20px 20px 0">
          <template #body="slotProps">
            <Button
              v-if="isAdmin"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'Edit'"
            />
            <Button
              v-else
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'View Details'"
            />
            <Button
              v-if="isAdmin"
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="confirmDeleteProduct(slotProps.data)"
              v-tooltip.bottom="'Delete Repairer'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Repairer Details"
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
          :readonly="!isAdmin"
        />
        <small class="invalid">{{ errors.name }}</small>
      </div>
      <div class="p-field">
        <label for="phoneNumber" class="form-control-label">Phone Number</label>
        <InputText
          type="phone"
          name="phone"
          v-model.trim="phone"
          class="form-control form-control-alternative"
          placeholder="Phone Number"
          :readonly="!isAdmin"
        />
        <small class="invalid">{{ errors.phone }}</small>
      </div>
      <div class="p-field">
        <label for="address" class="form-control-label"
          >Address (optional)</label
        >
        <InputText
          name="address"
          v-model="address"
          :readonly="!isAdmin"
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
          :readonly="!isAdmin"
          v-model.trim="email"
          class="form-control form-control-alternative"
          placeholder="Email"
        />
        <small class="invalid">{{ errors.email }}</small>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label class="form-control-label">Created Date</label>
          <InputText
            v-model.trim="product.created"
            class="form-control form-control-alternative"
            readonly
          />
        </div>
        <div class="p-field p-col-6">
          <label class="form-control-label">Last Modified</label>
          <InputText
            v-model.trim="product.lastModified"
            class="form-control form-control-alternative"
            readonly
          />
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
          v-if="isAdmin"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="CreateProductDialog"
      :style="{ width: '450px' }"
      header="Create Repairer"
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
        <label for="phoneNumber" class="form-control-label">Phone Number</label>
        <InputText
          type="phone"
          name="phone"
          v-model.trim="phone"
          class="form-control form-control-alternative"
          placeholder="Phone Number"
        />
        <small class="invalid">{{ errors.phone }}</small>
      </div>
      <div class="p-field">
        <label for="address" class="form-control-label"
          >Address (optional)</label
        >
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
          >Are you sure to delete this worker
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
import Toast from "primevue/toast";
import contentNoti from "../util/contentNoti.js";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import maintenanceWorkerApi from "../apis/maintenanceWorker.js";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import "yup-phone";
import webRole from "../util/webRole.js";

export default {
  setup() {
    const schema = yup.object({
      email: yup
        .string()
        .label("Email")
        .required()
        .email(),
      address: yup
        .string()
        .max(30)
        .label("Address"),
      name: yup
        .string()
        .required()
        .max(20)
        .label("Repairer"),
      phone: yup
        .string()
        .required()
        .label("Phone")
        .phone("VN")
        .max(10, "Phone must be at most 10 numbers")
        .required(),
    });
    const { errors, meta, handleReset, validate } = useForm({
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
      validate,
    };
  },

  components: {
    Button,
    Toast,
  },
  computed: {
    ...mapGetters("maintenanceWorker", ["getMaintenanceWorkerList"]),

    data() {
      return this.getMaintenanceWorkerList;
    },

    isAdmin() {
      let role = JSON.parse(localStorage.getItem("user")).role;
      if (webRole.ADMIN_ROLE === role) return true;
      return false;
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
      if (
        this.meta.valid &&
        this.name != null &&
        this.phone != null &&
        this.email != null
      ) {
        await maintenanceWorkerApi
          .create(this.name, this.address, this.phone, this.email)
          .then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: contentNoti.SUCCESS_SUMMARY,
                detail: contentNoti.MAINTENANCEWORKER_CREATE_SUCCESS,
                life: 3000,
              });
              this.setMaintenanceWorkerList();
              this.hideDialog();
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.MAINTENANCEWORKER_CREATE_FAILED,
                life: 3000,
              });
              this.hideDialog();
            }
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
      } else {
        this.validate();
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
          .then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: contentNoti.SUCCESS_SUMMARY,
                detail: contentNoti.MAINTENANCEWORKER_EDIT_SUCCESS,
                life: 3000,
              });
              this.setMaintenanceWorkerList();
              this.productDialog = false;
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.MAINTENANCEWORKER_EDIT_FAILED,
                life: 3000,
              });
              this.productDialog = false;
            }
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
      } else {
        this.validate();
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
        address: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      };
    },

    async deleteSelectedProducts() {
      await maintenanceWorkerApi
        .disable(this.product.maintenanceWorkerId)
        .then((res) => {
          if (res.status == 200) {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.MAINTENANCEWORKER_DISABLE_SUCCESS,
              life: 3000,
            });
            this.setMaintenanceWorkerList();
            this.hideDialog();
          } else {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.MAINTENANCEWORKER_DISABLE_FAILED,
              life: 3000,
            });
            this.hideDialog();
          }
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
  display: flex;
  align-items: center;
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
  top: 0;
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
  background-color: #ebf0f5;
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
  position: sticky;
  left: 5px !important;
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

::v-deep(.p-dialog .p-dialog-content) {
  padding: 0 1.5rem 0rem 1.5rem;
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
  display: flex;
  justify-content: left;
  align-items: center;
}
::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  text-align: left;
  border: 1px solid #e9ecef;
  border-width: 0 0 0 0;
  padding: 1rem 1rem;
  display: flex;
  justify-content: left;
  align-items: center;
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
