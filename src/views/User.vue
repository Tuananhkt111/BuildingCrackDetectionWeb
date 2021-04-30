<template>
  <div class="main-layout-details">
    <div class="card">
      <DataTable
        :scrollable="true"
        ref="dt"
        :value="getUserList"
        dataKey="userId"
        :paginator="true"
        :rows="5"
        :globalFilterFields="[
          'userName',
          'name',
          'email',
          'role',
          'phoneNumber',
          'fullLocation',
        ]"
        v-model:filters="filters"
        :rowHover="true"
        filterDisplay="menu"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate=""
      >
        <div class="table-header">
          <h3
            class="p-m-2"
            style="font-size: 22px; font-weight: 400; color: rgb(20, 49, 120);"
            v-if="isAdmin"
          >
            Users
          </h3>
          <h3
            class="p-m-2"
            style="font-size: 22px; font-weight: 400; color: rgb(20, 49, 120);"
            v-else
          >
            Staffs
          </h3>
          <span class="p-input-icon-left">
            <Button
              icon="pi pi-plus"
              class="p-button-info p-mr-2"
              @click="openNew"
              style="margin: 2px"
              label="New"
              v-if="admin"
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
        <template #empty> No Users found. </template>
        <Column
          header="No"
          style="max-width:70px"
          headerStyle="border-radius: 20px 0 0 20px;max-width:40px"
        >
          <template #body="slotProps">
            {{ slotProps.data.index }}
          </template>
        </Column>
        <Column
          field="userName"
          header="User Name"
          :showFilterMatchModes="false"
          :showAddButton="false"
          :showFilterOperator="false"
          headerStyle="max-width: 116px"
          style="max-width:150px"
        >
          <template #body="slotProps">
            {{ slotProps.data.userName }}
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
          field="name"
          header="Full Name"
          :showFilterMatchModes="false"
          :showAddButton="false"
          :showFilterOperator="false"
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
          field="email"
          header="Email"
          :showFilterMatchModes="false"
          headerStyle="min-width: 243px;max-width: 270px"
          style="min-width:280px;max-width:300px"
          :showAddButton="false"
          :showFilterOperator="false"
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
        <span v-if="isAdmin">
          <Column
            header="Role"
            filterField="role"
            :showFilterMatchModes="false"
          >
            <template #body="{ data }">
              <span :class="stockRole(data.role)">{{ data.role }}</span>
            </template>
            <template #filter="{ filterModel }">
              <div class="p-mb-3 p-text-bold">Role Picker</div>
              <MultiSelect
                v-model="filterModel.value"
                :options="roles"
                placeholder="Any"
                class="p-column-filter"
              >
                <template #option="slotProps">
                  <span>{{ slotProps.option }}</span>
                </template>
              </MultiSelect>
            </template>
          </Column>
        </span>
        <span v-else>
          <Column
            field="phoneNumber"
            header="Phone"
            :showFilterMatchModes="false"
            :showAddButton="false"
            :showFilterOperator="false"
          >
            <template #body="slotProps">
              {{ slotProps.data.phoneNumber }}
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
        </span>
        <Column
          field="locations"
          header="Areas"
          :showFilterMatchModes="false"
          :showAddButton="false"
          :showFilterOperator="false"
        >
          <template #body="slotProps">
            <span
              v-if="
                slotProps.data.locations !== null &&
                  slotProps.data.locations.length > 0
              "
            >
              {{ slotProps.data.fullLocation }}
            </span>
            <span v-else style="font-style: italic; color: #adadad">
              No Area assigned
            </span>
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
              icon="pi pi-user-edit"
              class="p-button-rounded p-button-info p-button-text"
              @click="editProduct(slotProps.data)"
              v-tooltip.bottom="'Edit'"
              v-if="admin"
            />
            <Button
              icon="pi pi-eye"
              class="p-button-rounded p-button-info p-button-text"
              @click="seeProduct(slotProps.data)"
              v-tooltip.bottom="'View Staff Details'"
              v-if="!admin"
            />
            <Button
              v-if="admin"
              icon="pi pi-lock"
              class="p-button-rounded p-button-warning p-button-text"
              @click="ResetPassowrd(slotProps.data)"
              v-tooltip.bottom="'Reset Password'"
            />
            <Button
              v-if="admin"
              icon="pi pi-ban"
              class="p-button-rounded p-button-danger p-button-text"
              @click="Disable(slotProps.data)"
              v-tooltip.bottom="'Delete Account'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="UserUpdateDialog"
      :style="{ width: '450px' }"
      header="User Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="userName" class="form-control-label">User Name: </label>
        <div class="form-control form-control-alternative" readonly>
          {{ product.userName }}
        </div>
      </div>
      <div class="p-field">
        <label for="name" class="form-control-label">Full Name</label>
        <InputText
          name="name"
          v-model.trim="name"
          class="form-control form-control-alternative"
        />
        <small class="invalid">{{ errors.name }}</small>
      </div>
      <div class="p-field">
        <label for="email" class="form-control-label">Email</label>
        <InputText
          type="email"
          name="email"
          v-model.trim="email"
          class="form-control form-control-alternative"
        />
        <small class="invalid">{{ errors.email }}</small>
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
        <Textarea
          name="address"
          v-model="address"
          rows="3"
          cols="20"
          class="form-control form-control-alternative"
          :autoResize="true"
        />
        <small class="invalid">{{ errors.address }}</small>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="role" class="form-control-label">Role</label>
          <p class="dropdown-list form-control-alternative">
            {{ selectedRole }}
          </p>
        </div>
        <div class="p-field p-col-6" v-if="selectedRole != null">
          <label for="Location" class="form-control-label">Area</label>
          <MultiSelect
            v-if="selectedRole === 'Manager'"
            v-model="selectedLocation"
            :options="getAvailableLocationManager"
            optionLabel="name"
            placeholder="Select Areas"
            :filter="true"
            class="multiselect-custom dropdown-list form-control-alternative"
            key="locationId"
            @change="checkMaxArea"
          />
          <small class="invalid">{{ checkMaxLocation }}</small>
          <p
            class="dropdown-list form-control-alternative"
            v-if="selectedRole === 'Staff'"
          >
            {{ selectedLocation.name }}
          </p>
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
          label="Update"
          icon="pi pi-user-edit"
          class="p-button-text"
          @click="UpdateUser"
        />
        <p style="color: red" v-if="submitted">{{ warnning }}</p>
      </template>
    </Dialog>
    <Dialog
      v-model:visible="StaffDialog"
      :style="{ width: '450px' }"
      header="Staff Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="userName" class="form-control-label">User Name: </label>
        <div class="form-control form-control-alternative" readonly>
          {{ product.userName }}
        </div>
      </div>
      <div class="p-field">
        <label for="name" class="form-control-label">Full Name</label>
        <InputText
          name="name"
          v-model.trim="name"
          class="form-control form-control-alternative"
          readonly
        />
        <small class="invalid">{{ errors.name }}</small>
      </div>
      <div class="p-field">
        <label for="email" class="form-control-label">Email</label>
        <InputText
          type="email"
          name="email"
          v-model.trim="email"
          class="form-control form-control-alternative"
          readonly
        />
        <small class="invalid">{{ errors.email }}</small>
      </div>
      <div class="p-field">
        <label for="phoneNumber" class="form-control-label">Phone Number</label>
        <InputText
          type="phone"
          name="phone"
          v-model.trim="phone"
          class="form-control form-control-alternative"
          placeholder="Phone Number"
          readonly
        />
        <small class="invalid">{{ errors.phone }}</small>
      </div>
      <div class="p-field">
        <label for="address" class="form-control-label"
          >Address (optional)</label
        >
        <Textarea
          name="address"
          v-model="address"
          rows="3"
          cols="20"
          class="form-control form-control-alternative"
          readonly
          :autoResize="true"
        />
        <small class="invalid">{{ errors.address }}</small>
      </div>
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="role" class="form-control-label">Role</label>
          <p class="dropdown-list form-control-alternative">
            {{ selectedRole }}
          </p>
        </div>
        <div class="p-field p-col-6" v-if="selectedRole != null">
          <label for="Location" class="form-control-label">Area</label>
          <Dropdown
            v-if="selectedRole === 'Staff'"
            v-model="selectedLocation"
            inputId="locationId"
            :options="getAvailableLocationStaff"
            optionLabel="name"
            placeholder="Select an Area"
            :filter="true"
            class="dropdown-list form-control-alternative"
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
          label="Update Area"
          icon="pi pi-user-edit"
          class="p-button-text"
          @click="updateLoaction"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="UserDialog"
      :style="{ width: '450px' }"
      header="User Information"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="name" class="form-control-label">Full Name</label>
        <InputText
          name="name"
          v-model.trim="name"
          class="form-control form-control-alternative"
          placeholder="Fullname"
        />
        <small class="invalid">{{ errors.name }}</small>
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
      <div class="p-formgrid p-grid">
        <div class="p-field p-col-6">
          <label for="role" class="form-control-label">Role</label>
          <Dropdown
            v-model="selectedRole"
            :options="roles"
            class="dropdown-list form-control-alternative"
          >
            <template #option="slotProps">
              <span :class="'customer-badge status-' + slotProps.option">{{
                slotProps.option
              }}</span>
            </template>
          </Dropdown>
          <small class="invalid">{{ errors.selectedRole }}</small>
        </div>
        <div class="p-field p-col-6" v-if="selectedRole == 'Manager'">
          <label for="Location" class="form-control-label">Area</label>
          <MultiSelect
            v-if="selectedRole === 'Manager'"
            v-model="selectedLocation"
            :options="getAvailableLocationManager"
            optionLabel="name"
            placeholder="Select Areas"
            :filter="true"
            class="multiselect-custom dropdown-list form-control-alternative"
            @change="checkMaxArea"
          />
          <small class="invalid">{{ checkMaxLocation }}</small>
        </div>
      </div>
      <div class="p-field">
        <label for="address" class="form-control-label"
          >Address (optional)</label
        >
        <Textarea
          name="address"
          v-model="address"
          rows="3"
          cols="20"
          class="form-control form-control-alternative"
          placeholder="Address"
          :autoResize="true"
        />
        <small class="invalid">{{ errors.address }}</small>
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
          @click="CreateUser"
        />
        <p style="color: red" v-if="submitted">{{ warnning }}</p>
      </template>
    </Dialog>
    <Dialog
      v-model:visible="ResetPasswordDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure to reset password account <b>{{ product.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="ResetPasswordDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="confirmResetPassword"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="DisableDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure to delete account <b>{{ product.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="DisableDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="DisableAccount"
        />
      </template>
    </Dialog>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import Button from "primevue/button";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import contentNoti from "../util/contentNoti.js";
import webRole from "../util/webRole.js";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { userApi } from "../apis/user";
import { useForm, useField } from "vee-validate";
import { FilterMatchMode, FilterOperator, FilterService } from "primevue/api";
import * as yup from "yup";
import "yup-phone";

const AREAS_FILTER = "AREAS_FILTER";

export default {
  setup() {
    const schema = yup.object({
      name: yup
        .string()
        .max(20)
        .label("Name")
        .required(),
      email: yup
        .string()
        .label("Email")
        .required()
        .email(),
      address: yup
        .string()
        .max(30)
        .label("Address")
        .nullable(),
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
    Dropdown,
    MultiSelect,
  },
  computed: {
    ...mapGetters("user", ["getUserList"]),
    ...mapGetters("location", [
      "getLocationList",
      "getAvailableLocationStaff",
      "getAvailableLocationManager",
    ]),

    isAdmin() {
      let role = JSON.parse(localStorage.getItem("user")).role;
      if (webRole.ADMIN_ROLE === role) return true;
      return false;
    },
  },
  data() {
    return {
      createStaffLocation: null,
      StaffDialog: false,
      changedRole: null,
      selectedLocation: null,
      UserDialog: false,
      UserUpdateDialog: false,
      showAssessment: false,
      DisableDialog: false,
      product: {},
      ResetPasswordDialog: false,
      filters: {},
      submitted: true,
      selectedRole: null,
      messages: [],
      roles: ["Manager", "Staff"],
      warnning: null,
      loading: true,
      role: null,
      admin: false,
      selectedProduct: null,
      checkAvailable: false,
      checkMaxLocation: "",
    };
  },

  async created() {
    this.initFilters();
    await this.setUserList().then(() => {
      this.loading = false;
    });
    await this.setLocationList();
  },

  mounted() {
    this.role = JSON.parse(localStorage.getItem("user")).role;
    if (this.role === webRole.ADMIN_ROLE) {
      this.admin = true;
    }
    FilterService.register(AREAS_FILTER, (value, filter) => {
      if (filter === undefined || filter === null) {
        return true;
      }
      if (value.length === 0) return false;
      if (value === undefined || value === null) {
        return false;
      }
      return value
        .map((l) => l.name)
        .toString()
        .includes(filter.toString());
    });
  },
  methods: {
    ...mapActions("user", ["setUserList"]),
    ...mapActions("location", [
      "setLocationList",
      "setAvailableLocationStaff",
      "setAvailableLocationManager",
    ]),

    openNew() {
      this.checkAvailable = false;
      this.setAvailableLocationStaff(null);
      this.setAvailableLocationManager(null);
      this.handleReset();
      this.checkMaxLocation = "";
      this.UserDialog = true;
      this.selectedRole = "Staff";
      this.selectedLocation = null;
    },
    ResetPassowrd(product) {
      this.product = product;
      this.ResetPasswordDialog = true;
    },
    async confirmResetPassword() {
      await userApi
        .resetPassword(this.product.userId)
        .catch(() => {
          this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_RESETPASSWORK_FAILED,
              life: 3000,
            });
        })
        .then((res) => {
          if (res.status == 200) {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.USER_RESETPASSWORK_SUCCESS,
              life: 3000,
            });
            this.setUserList();
            this.submitted = false;
            this.ResetPasswordDialog = false;
          } else {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_RESETPASSWORK_FAILED,
              life: 3000,
            });
            this.ResetPasswordDialog = false;
          }
        })
        .catch(() => {
          this.$toast.add({
            severity: "error",
            summary: contentNoti.FAIL_SUMMARY,
            detail: contentNoti.USER_RESETPASSWORK_FAILED,
            life: 3000,
          });
          this.ResetPasswordDialog = false;
        });
    },
    checkMaxArea() {
      if (this.selectedLocation.length > 3) {
        this.checkMaxLocation = "Manager only manages at most 3 areas";
      } else {
        this.checkMaxLocation = "";
      }
    },

    async CreateUser() {
      this.validate();
      if (
        this.selectedLocation != null &&
        this.selectedRole != "Staff" &&
        this.selectedLocation.length > 3
      ) {
        this.checkMaxLocation = "Manager only manages at most 3 areas";
      } else if (
        this.meta.valid &&
        this.name != null &&
        this.email != null &&
        this.phone != null
      ) {
        await userApi
          .createUser(
            this.selectedRole,
            this.name,
            this.email,
            this.phone,
            this.address,
            this.selectedLocation
          )
          .then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: contentNoti.SUCCESS_SUMMARY,
                detail: contentNoti.USER_CREATE_SUCCESS,
                life: 3000,
              });
              this.setUserList();
              this.UserDialog = false;
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.USER_CREATE_FAILED,
                life: 3000,
              });
              this.UserDialog = false;
            }
          })
          .catch((err) => {
            this.$toast.add({
              severity: contentNoti.FAIL_SUMMARY,
              summary: contentNoti.USER_CREATE_FAILED,
              detail: err.data,
              life: 3000,
            });
            this.UserDialog = false;
          });
      } else {
        if (this.selectedLocation.length <= 3) {
          this.checkMaxLocation = "Manager only manages at most 3 areas";
        }
        this.validate();
      }
    },
    async UpdateUser() {
      this.validate();
      if (
        this.selectedLocation != null &&
        this.selectedRole != "Staff" &&
        this.selectedLocation.length > 3
      ) {
        this.checkMaxLocation = "Manager only manages at most 3 areas";
      } else if (this.meta.valid) {
        await userApi
          .updateUser(
            this.product.userId,
            this.name,
            this.email,
            this.phone,
            this.address,
            this.selectedLocation,
            this.selectedRole
          )
          .then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: contentNoti.SUCCESS_SUMMARY,
                detail: contentNoti.USER_EDIT_SUCCESS,
                life: 3000,
              });
              this.setUserList();
              this.UserUpdateDialog = false;
            } else if (res.status == 500) {
              this.$toast.add({
                severity: "success",
                summary: contentNoti.SUCCESS_SUMMARY,
                detail: contentNoti.USER_EDIT_SUCCESS,
                life: 3000,
              });
              this.setUserList();
              this.UserUpdateDialog = false;
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.USER_EDIT_FAILED,
                life: 3000,
              });
              this.setUserList();
              this.UserUpdateDialog = false;
            }
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_EDIT_FAILED,
              life: 3000,
            });
            this.setUserList();
            this.UserUpdateDialog = false;
          });
      } else {
        if (this.selectedLocation.length <= 3) {
          this.checkMaxLocation = "Manager only manages at most 3 areas";
        }
        this.validate();
      }
    },
    Disable(product) {
      this.product = product;
      this.DisableDialog = true;
    },
    async DisableAccount() {
      await userApi
        .deleteUser(this.product.userId)
        .then((res) => {
          if (res.status == 200) {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.USER_DISABLE_SUCCESS,
              life: 3000,
            });
            this.setUserList();
            this.DisableDialog = false;
          } else {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_DISABLE_FAILED,
              life: 3000,
            });
            this.DisableDialog = false;
          }
        })
        .catch(() => {
          this.$toast.add({
            severity: "error",
            summary: contentNoti.FAIL_SUMMARY,
            detail: contentNoti.USER_DISABLE_FAILED,
            life: 3000,
          });
          this.DisableDialog = false;
        });
    },
    hideDialog() {
      this.showAssessment = false;
      this.submitted = false;
      this.UserDialog = false;
      this.UserUpdateDialog = false;
      this.StaffDialog = false;
    },
    showAssessmentDialog(product) {
      this.product = { ...product };
      this.showAssessment = true;
    },
    findIndexById(id) {
      let index = -1;
      if (this.selectedRole == "Staff") {
        for (let i = 0; i < this.getAvailableLocationStaff.length; i++) {
          if (this.getAvailableLocationStaff[i].locationId === id) {
            index = i;
            break;
          }
        }
      } else {
        for (let i = 0; i < this.getAvailableLocationManager.length; i++) {
          if (this.getAvailableLocationManager[i].locationId === id) {
            index = i;
            break;
          }
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
    stockRole(role) {
      return [
        {
          staff: role === "Staff",
          manager: role === "Manager",
        },
      ];
    },
    async editProduct(product) {
      this.checkAvailable = false;
      var tmpLocation = {
        locationId: 0,
        name: "<<No Area>>",
      };
      this.handleReset();
      this.checkMaxLocation = "";
      this.name = product.name;
      this.email = product.email;
      this.phone = product.phoneNumber;
      this.address = product.address;
      this.product = { ...product };
      this.selectedLocation = null;
      this.product.created = this.callDate(product.created);
      this.product.lastModified = this.callDate(product.lastModified);
      this.selectedRole = this.product.role;
      const tmp = this.product.locations;
      if (tmp == "" && this.selectedRole == "Staff") {
        await this.setAvailableLocationStaff(product.userId);
        this.getAvailableLocationStaff.push(tmpLocation);
        this.selectedLocation = tmpLocation;
        if (this.getAvailableLocationStaff.length == 1) {
          this.checkAvailable = true;
        }
      } else if (tmp == "" && this.selectedRole == "Manager") {
        this.selectedLocation = [];
        await this.setAvailableLocationManager(product.userId);
        if (this.getAvailableLocationManager.length == 1) {
          this.checkAvailable = true;
        }
      } else if (tmp.length == 1 && this.selectedRole == "Staff") {
        await this.setAvailableLocationStaff(product.userId);
        this.selectedLocation = this.getAvailableLocationStaff[
          this.findIndexById(this.product.locations[0].locationId)
        ];
        this.getAvailableLocationStaff.push(tmpLocation);
      } else {
        this.selectedLocation = [];
        await this.setAvailableLocationManager(product.userId);
        for (let i = 0; i < tmp.length; i++) {
          const location = this.getAvailableLocationManager[
            this.findIndexById(tmp[i].locationId)
          ];
          if (location != null) {
            this.selectedLocation.push(location);
          }
        }
      }
      this.UserUpdateDialog = true;
    },

    async seeProduct(product) {
      this.checkAvailable = false;
      var tmpLocation = {
        locationId: 0,
        name: "<<No Area>>",
      };
      this.handleReset();
      this.name = product.name;
      this.email = product.email;
      this.phone = product.phoneNumber;
      this.address = product.address;
      this.product = { ...product };
      this.selectedLocation = null;
      this.product.created = this.callDate(product.created);
      this.product.lastModified = this.callDate(product.lastModified);
      this.selectedRole = this.product.role;
      const tmp = this.product.locations;
      if (tmp != "") {
        await this.setAvailableLocationStaff(product.userId);
        this.getAvailableLocationStaff.push(tmpLocation);
        this.selectedLocation = this.getAvailableLocationStaff[
          this.findIndexById(this.product.locations[0].locationId)
        ];
      } else {
        await this.setAvailableLocationStaff(product.userId);
        this.getAvailableLocationStaff.push(tmpLocation);
        this.selectedLocation = tmpLocation;
        if (this.getAvailableLocationStaff.length == 1) {
          this.checkAvailable = true;
        }
      }
      this.StaffDialog = true;
    },
    async updateLoaction() {
      await userApi
        .updateLocationStaff(
          this.product.userId,
          this.selectedLocation.locationId
        )
        .then((res) => {
          if (res.status == 200) {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.USER_UPDATE_AREA_SUCCESS,
              life: 3000,
            });
            this.StaffDialog = false;
            this.setUserList();
          } else {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_UPDATE_AREA_FAILED,
              life: 3000,
            });
            this.StaffDialog = false;
            this.setUserList();
          }
        })
        .catch(() => {
          this.$toast.add({
            severity: "error",
            summary: contentNoti.FAIL_SUMMARY,
            detail: contentNoti.USER_UPDATE_AREA_FAILED,
            life: 3000,
          });
          this.StaffDialog = false;
          this.setUserList();
        });
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        userName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        email: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        phoneNumber: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        locations: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: AREAS_FILTER }],
        },
        role: { value: null, matchMode: FilterMatchMode.IN },
      };
    },
  },
};
</script>

<style scoped>
::v-deep(.p-multiselect-label-container) {
  margin-top: -7px;
}
::v-deep(.p-dropdown .p-dropdown-label) {
  margin-top: -5px !important;
}
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
.form-control::placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control:focus:-ms-input-placeholder {
  color: #adb5bd;
}
.form-control:focus::placeholder {
  color: #adb5bd;
}
.dropdown-list:-ms-input-placeholder {
  opacity: 1;
  color: #adb5bd;
}
.dropdown-list::placeholder {
  opacity: 1;
  color: #adb5bd;
}
.dropdown-list:focus:-ms-input-placeholder {
  color: #adb5bd;
}
.dropdown-list:focus::placeholder {
  color: #adb5bd;
}

.dropdown-list {
  font-size: 0.875rem;
  line-height: 1.5;
  /* display: block; */
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
.dropdown-list:focus {
  color: #8898aa;
  border-color: rgba(50, 151, 211, 0.25);
  outline: 0;
  background-color: #fff;
  box-shadow: none, none;
}
.form-control {
  font-size: 0.875rem;
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

.p-m-2 {
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep(.p-dialog .p-dialog-header) {
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
}

::v-deep(.p-dialog .p-dialog-header .p-dialog-title) {
  color: #69707a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
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

.product-image {
  width: 100px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 150px;
  margin: 0 auto 2rem auto;
  display: block;
}

.staff {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-size: 14px;
  color: #2fa0d3;
  width: 90px;
  text-align: center;
  background-color: #e2f6ff;
}

.manager {
  border-radius: 2px;
  padding: 0.25em 0.5rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-size: 14px;
  color: #249e9a;
  width: 90px;
  text-align: center;
  background-color: #9cf4c1;
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

.confirmation-content {
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
  text-align: left;
  background: rgba(119, 123, 241, 0.1);
}

.p-column-filter-menu-button {
  color: #2170e7 !important;
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

::v-deep(.p-dialog .p-dialog-content) {
  padding: 0 1.5rem 0rem 1.5rem;
}

::v-deep(.p-dialog .p-dialog-footer) {
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
}

::v-deep(.p-dialog) {
  border-radius: 24px;
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
