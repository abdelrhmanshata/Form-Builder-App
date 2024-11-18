<template>
  <div class="form-builder-container">
    <!-- Sidebar with available fields -->
    <div class="sidebar w-25">
      <h3>Available Fields</h3>
      <div
        v-for="field in filteredAvailableFields"
        :key="field.model"
        class="field-item"
        :draggable="true"
        @dragstart="onDragStart(field)"
      >
        <span>{{ field.label }}</span>
      </div>
      <hr />
      <!-- Control Panel for selected field -->
      <div v-if="selectedField" class="control-panel mt-4">
        <h4>Edit Field</h4>
        <label>Field Label</label>
        <input
          v-model="selectedField.label"
          type="text"
          class="form-control"
          placeholder="Enter field label"
        />

        <!-- Placeholder (for input, textarea, etc.) -->
        <div
          v-if="
            ['text', 'email', 'number', 'textarea'].includes(selectedField.type)
          "
        >
          <label>Placeholder</label>
          <input
            v-model="selectedField.placeholder"
            type="text"
            class="form-control"
            placeholder="Enter placeholder"
          />
        </div>

        <!-- Options for select, radio (dynamic) -->
        <div v-if="['select', 'radio'].includes(selectedField.type)">
          <hr />
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label>Options</label>
            <v-icon class="text-blue border rounded-1" @click="addOption"
              >mdi-playlist-plus</v-icon
            >
          </div>

          <div
            v-for="(option, index) in selectedField.options"
            :key="index"
            class="input-group mb-2 align-center"
          >
            <input
              v-model="selectedField.options[index]"
              type="text"
              class="form-control"
              placeholder="Enter option"
            />
            <v-icon class="text-red" @click="removeOption(index)">
              mdi-trash-can-outline
            </v-icon>
          </div>
        </div>
        <hr />
        <button
          type="button"
          class="btn btn-outline-success mt-3 flex-1 w-100"
          @click="saveFieldChanges"
        >
          Save Changes
        </button>
      </div>
    </div>

    <!-- Form Area with Drag and Drop support -->
    <form
      @submit.prevent="handleSubmit"
      class="p-4 bg-light border rounded w-75"
    >
      <div
        v-for="(field, index) in schema"
        :key="field.model"
        class="p-1"
        style="cursor: all-scroll"
        draggable="true"
        @dragstart="onDragStart(field)"
        @dragover.prevent
        @drop.prevent="onReorderDrop($event, index)"
        @click="selectField(index)"
      >
        <!-- Label -->
        <label :for="field.model" class="form-label">{{ field.label }}</label>
        <!-- Field -->
        <div class="d-flex">
          <div class="flex-1-1">
            <input
              v-if="
                ['text', 'email', 'number', 'password'].includes(field.type)
              "
              :type="field.type"
              :id="field.model"
              v-model="formData[field.model]"
              class="form-control"
            />
            <select
              v-if="field.type === 'select'"
              :id="field.model"
              v-model="formData[field.model]"
              class="form-select"
            >
              <option value="" disabled>Select {{ field.label }}</option>
              <option
                v-for="option in field.options"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <textarea
              v-if="field.type === 'textarea'"
              :id="field.model"
              v-model="formData[field.model]"
              class="form-control"
              :placeholder="field.placeholder"
            ></textarea>
            <div v-if="field.type === 'checkbox'" class="form-check">
              <input
                :id="field.model"
                type="checkbox"
                v-model="formData[field.model]"
                class="form-check-input"
              />
              <label :for="field.model" class="form-check-label">{{
                field.label
              }}</label>
            </div>
            <div v-if="field.type === 'radio'" class="form-check">
              <input
                type="radio"
                v-model="formData[field.model]"
                :id="field.model"
                :value="field.value"
                class="form-check-input"
              />
              <label :for="field.model" class="form-check-label">{{
                field.label
              }}</label>
            </div>
          </div>
          <!-- Action Buttons for Edit and Remove -->
          <div class="p-2 d-flex justify-end align-center">
            <v-icon class="text-red" @click="removeField(index)">
              mdi-close-circle-outline
            </v-icon>
          </div>
        </div>
      </div>
      <!-- Save Schema -->
      <button
        type="button"
        class="btn btn-primary text-white w-100 mt-10"
        @click="saveSchema"
      >
        Save Schema
      </button>
    </form>
  </div>
</template>
<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  schema: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["form-submit", "schema-update"]);

const formData = ref({});
const selectedField = ref(null);
const availableFields = ref([
  { model: "name", label: "Name", type: "text" },
  { model: "email", label: "Email", type: "email" },
  { model: "age", label: "Age", type: "number" },
  { model: "bio", label: "Bio", type: "textarea" },
  { model: "newsletter", label: "Subscribe to newsletter", type: "checkbox" },
  {
    model: "gender",
    label: "Gender",
    type: "radio",
    options: ["Male", "Female"],
  },
]);
const draggedField = ref(null);

// Computed property to filter available fields
const filteredAvailableFields = computed(() => {
  const addedModels = props.schema.map((field) => field.model);
  return availableFields.value.filter(
    (field) => !addedModels.includes(field.model)
  );
});

const initializeFormData = () => {
  formData.value = {};
  props.schema.forEach((field) => {
    if (field.type === "checkbox") {
      formData.value[field.model] = false;
    } else if (field.type === "radio") {
      formData.value[field.model] = null;
    } else {
      formData.value[field.model] = "";
    }
  });
};

const handleSubmit = () => {
  emit("form-submit", formData.value);
};

const onDragStart = (field) => {
  draggedField.value = field;
};

const onReorderDrop = (event, dropIndex) => {
  const draggedIndex = props.schema.findIndex(
    (field) => field.model === draggedField.value.model
  );

  if (draggedIndex === -1) {
    // Add new field
    props.schema.splice(dropIndex, 0, { ...draggedField.value });
  } else {
    // Reorder field
    const [removed] = props.schema.splice(draggedIndex, 1);
    props.schema.splice(dropIndex, 0, removed);
  }
  initializeFormData();
};

const removeField = (index) => {
  const removedField = props.schema.splice(index, 1)[0];
  delete formData.value[removedField.model];
  console.log(formData.value);
};

const selectField = (index) => {
  selectedField.value = { ...props.schema[index] };
};

const addOption = () => {
  if (selectedField.value && selectedField.value.options) {
    selectedField.value.options.push("");
  }
};

const removeOption = (index) => {
  if (selectedField.value && selectedField.value.options) {
    selectedField.value.options.splice(index, 1);
  }
};

const saveFieldChanges = () => {
  const index = props.schema.findIndex(
    (field) => field.model === selectedField.value.model
  );
  if (index !== -1) {
    props.schema[index] = { ...selectedField.value };
    selectedField.value = null;
    initializeFormData();
  }
};

const saveSchema = () => {
  emit("schema-update", props.schema);
};

watch(
  () => props.schema,
  () => initializeFormData(),
  { immediate: true }
);
</script>

<style scoped>
.form-builder-container {
  display: flex;
  gap: 2rem;
}

.sidebar {
  width: 250px;
  border-right: 1px solid #ccc;
  padding: 10px;
}

.field-item {
  cursor: pointer;
  padding: 8px;
  background: #f0f0f0;
  margin-bottom: 10px;
  border-radius: 5px;
}

.field-item:hover {
  background: #ddd;
}

.control-panel {
  padding-top: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 15px;
}

.input-group {
  display: flex;
  gap: 10px;
}
.action-buttons {
  display: flex;
  gap: 2px;
}
</style>
