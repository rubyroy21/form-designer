// Sample JSON Data
let formData = [
  {
    id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
    type: "input",
    label: "Sample Label",
    placeholder: "Sample placeholder",
  },
  {
    id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
    type: "select",
    label: "Sample Label",
    options: ["Sample Option", "Sample Option", "Sample Option"],
  },
  {
    id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
    type: "textarea",
    label: "Sample Label",
    placeholder: "Sample placeholder",
  },
];

// Function to generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Function to make elements editable
function makeEditable(element, index, field) {
  element.addEventListener("dblclick", function () {
    const currentValue = this.textContent;
    const input = document.createElement("input");
    input.value = currentValue;
    input.className = "edit-input w-full border rounded p-1";

    const save = () => {
      const newValue = input.value.trim();
      if (newValue) {
        if (field === "options") {
          formData[index].options = newValue
            .split(",")
            .map((opt) => opt.trim());
        } else {
          formData[index][field] = newValue;
        }
        renderForm();
      }
    };

    input.addEventListener("blur", save);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        save();
      }
    });

    this.textContent = "";
    this.appendChild(input);
    input.focus();
  });
}

// Function to render the form from JSON data
function renderForm() {
  const form = document.getElementById("dynamic-form");
  form.innerHTML = ""; // Clear form first

  formData.forEach((element, index) => {
    const formGroup = document.createElement("div");
    formGroup.className =
      "form-element border p-4 rounded bg-white relative shadow-sm mb-4";
    formGroup.setAttribute("draggable", "true");
    formGroup.dataset.index = index;

    // Add drag and drop handlers
    formGroup.addEventListener("dragstart", handleDragStart);
    formGroup.addEventListener("dragover", handleDragOver);
    formGroup.addEventListener("drop", handleDrop);
    formGroup.addEventListener("dragend", handleDragEnd);

    let formElement = "";
    const labelElement = `<label class="block text-sm font-medium mb-2 editable-label">${element.label}</label>`;

    if (element.type === "input") {
      formElement = `
        ${labelElement}
        <input class="block w-full border border-gray-300 rounded p-2" type="text" placeholder="${element.placeholder}" />
        <small class="text-gray-500 editable-placeholder">Placeholder: ${element.placeholder}</small>
      `;
    } else if (element.type === "select") {
      formElement = `
        ${labelElement}
        <select class="block w-full border border-gray-300 rounded p-2">
          ${element.options
            .map((option) => `<option>${option}</option>`)
            .join("")}
        </select>
        <small class="text-gray-500 editable-options">Options: ${element.options.join(
          ", "
        )}</small>
      `;
    } else if (element.type === "textarea") {
      formElement = `
        ${labelElement}
        <textarea class="block w-full border border-gray-300 rounded p-2" placeholder="${element.placeholder}"></textarea>
        <small class="text-gray-500 editable-placeholder">Placeholder: ${element.placeholder}</small>
      `;
    }

    formGroup.innerHTML =
      formElement +
      `
      <button class="delete-btn absolute top-2 right-2 cursor-pointer text-red-500" data-index="${index}">🗑️</button>
    `;

    form.appendChild(formGroup);

    // Make elements editable
    const label = formGroup.querySelector(".editable-label");
    makeEditable(label, index, "label");

    const placeholder = formGroup.querySelector(".editable-placeholder");
    if (placeholder) {
      makeEditable(placeholder, index, "placeholder");
    }

    const options = formGroup.querySelector(".editable-options");
    if (options) {
      makeEditable(options, index, "options");
    }
  });

  // Add event listener for delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", deleteElement);
  });
}

// Drag and drop functionality
let draggedItem = null;

function handleDragStart(e) {
  draggedItem = this;
  this.style.opacity = "0.4";
  e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDrop(e) {
  e.preventDefault();
  if (draggedItem !== this) {
    const allItems = [...document.querySelectorAll(".form-element")];
    const draggedIdx = draggedItem.dataset.index;
    const droppedIdx = this.dataset.index;

    // Reorder the formData array
    const temp = formData[draggedIdx];
    formData[draggedIdx] = formData[droppedIdx];
    formData[droppedIdx] = temp;

    renderForm();
  }
  return false;
}

function handleDragEnd(e) {
  this.style.opacity = "1";
}

// Add new elements
document.getElementById("add-input").addEventListener("click", () => {
  formData.push({
    id: generateId(),
    type: "input",
    label: "New Input",
    placeholder: "Enter text",
  });
  renderForm();
});

document.getElementById("add-select").addEventListener("click", () => {
  formData.push({
    id: generateId(),
    type: "select",
    label: "New Select",
    options: ["Option 1", "Option 2", "Option 3"],
  });
  renderForm();
});

document.getElementById("add-textarea").addEventListener("click", () => {
  formData.push({
    id: generateId(),
    type: "textarea",
    label: "New Textarea",
    placeholder: "Enter text",
  });
  renderForm();
});

// Delete element
function deleteElement(event) {
  const index = event.target.getAttribute("data-index");
  formData.splice(index, 1);
  renderForm();
}

// Save form to console
document.getElementById("save-form").addEventListener("click", () => {
  console.log(JSON.stringify(formData, null, 2));
});

// Initial render
renderForm();
