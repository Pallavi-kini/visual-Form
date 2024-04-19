import data from "./sampleData.json" assert { type: "json" };
const formData = data.formData;
let newArray = [];
let finalArray = [];
newArray = formData;
let count = 1;

const getJsonData = () => {
  const contentDiv = document.getElementById("formDesigner");

  formData.forEach((dataItem) => {
    const div = document.createElement("div");
    div.setAttribute("id", dataItem.id);
    div.setAttribute("data-type", dataItem.type);
    div.setAttribute("data-label", dataItem.label);
    div.setAttribute("data-placeholder", dataItem.placeholder);
    div.setAttribute("data-options", dataItem.options);
    div.classList.add("form-content");

    // Create a div for the content
    const contentdiv = document.createElement("div");
    contentdiv.textContent = dataItem.type;
    div.appendChild(contentdiv);
    count++;
    finalArray.push({ ...dataItem });
    // Create a span for the plus icon
    const plusIcon = document.createElement("span");
    plusIcon.innerHTML = '<i class="fa-solid fa-plus"></i>';
    plusIcon.classList.add("plus-icon");
    div.appendChild(plusIcon);
    plusIcon.addEventListener("click", () => {
      const oject = { ...dataItem, id: finalArray.length + 1 };
      finalArray.push(oject);
      handlePlusIconClick(oject);
    });

    // Append the main container div to the content div
    contentDiv.appendChild(div);
  });
};

const handlePlusIconClick = (dataItem) => {
  newArray = [];
  newArray.push({ ...dataItem });
  createForm();
};

const updateNewArrayOrder = () => {
  const updatedArray = [];
  formContainer.childNodes.forEach((node) => {
    const eleId = node.id.charAt(node.id.length - 1);
    const eles = finalArray.filter((ele) => ele.id === +eleId);
    if (eles && eles.length > 0) {
      updatedArray.push({ ...eles[0] });
    }
  });
  newArray = [...updatedArray];
  finalArray = [...updatedArray];
};

const createForm = () => {
  const formContainer = document.getElementById("formContainer");

  //Create outer container for each form field
  newArray.forEach((item, index) => {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("form-field-container");
    outerDiv.setAttribute("draggable", "true");
    outerDiv.setAttribute("id", "main" + item.id);

    outerDiv.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", "main" + item.id);
    });

    outerDiv.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow drop
    });
    outerDiv.addEventListener("drop", (e) => {
      e.preventDefault();
      const startIndex = e.dataTransfer.getData("text/plain");
      const endIndex = e.currentTarget.id;
      if (startIndex !== endIndex) {
        // Reorder the elements in the DOM
        const draggedElement = document.getElementById(startIndex);
        const dropZoneElement = document.getElementById(endIndex);

        // Get the index of the drop zone element in the list of form fields
        const dropZoneIndex = Array.from(formContainer.children).indexOf(
          dropZoneElement
        );

        // Check if the dragged element should be inserted before or after the drop zone element
        if (draggedElement.offsetTop > dropZoneElement.offsetTop) {
          // Dragging upwards
          formContainer.insertBefore(draggedElement, dropZoneElement);
        } else if (draggedElement.offsetTop < dropZoneElement.offsetTop) {
          // Dragging downwards
          if (formContainer.children[dropZoneIndex + 1]) {
            // If there is a next sibling, insert before it
            formContainer.insertBefore(
              draggedElement,
              formContainer.children[dropZoneIndex + 1]
            );
          } else {
            // If there is no next sibling, append to the end
            formContainer.appendChild(draggedElement);
          }
        }
        // Update the newArray with the new order
        updateNewArrayOrder();
      }
    });

    // Create inner container for label and delete icon
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("inner-container");

    // Create label element
    const label = document.createElement("label");
    label.textContent = item.label;

    label.contentEditable = true;
    label.addEventListener("input", () => {
      const newItem = { ...item, label: label.textContent.trim() };
      const index = newArray.findIndex((element) => element.id === item.id);
      newArray[index] = { ...newItem };
      finalArray[index] = { ...newItem };
    });

    // Create delete icon
    const deleteIcon = document.createElement("span");
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteIcon.classList.add("delete-icon");
    deleteIcon.addEventListener("click", () => {
      outerDiv.remove();
      deleteSpecificData(item);
    });

    // Append label and delete icon to inner container
    innerDiv.appendChild(label);
    innerDiv.appendChild(deleteIcon);

    // Append inner container to outer container
    outerDiv.appendChild(innerDiv);

    // Create form field element based on type
    let formField;
    if (item.type === "input" || item.type === "textarea") {
      formField = document.createElement(item.type);
      formField.setAttribute("id", item.id);
      formField.setAttribute("placeholder", item.placeholder);

      // Make placeholder editable on click
    } else if (item.type === "select") {
      formField = document.createElement("div");

      const mainSmall = document.createElement("div");
      const arrow = document.createElement("span");
      const content = document.createElement("span");
      content.textContent = "Select an option";
      arrow.innerHTML = '<i class="fa-solid fa-angle-down"></i>';
      arrow.classList.add("delete-icon");

      mainSmall.addEventListener("click", () => {
        dropdownOptions.classList.toggle("dropdown-options-show");
      });

      mainSmall.appendChild(content);
      mainSmall.appendChild(arrow);
      mainSmall.classList.add("drop-content");
      formField.appendChild(mainSmall);

      const dropdownOptions = document.createElement("div");
      dropdownOptions.classList.add("dropdown-options");

      const optionsCopy = item.options.map((obj) => ({ ...obj }));

      optionsCopy.forEach((option) => {
        const optionDiv = document.createElement("div");
        const optionContenet = document.createElement("span");
        optionContenet.textContent = option.name;
        const optiondelete = document.createElement("span");
        optiondelete.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        optiondelete.classList.add("delete-icon");
        optiondelete.addEventListener("click", (event) => {
          event.stopImmediatePropagation();
          content.textContent = "Select an option";
          optionDiv.remove();
          deleteOptionDrop(item, option);
          dropdownOptions.classList.toggle("dropdown-options-show");
        });

        optionDiv.classList.add("drop-content-label");
        optionDiv.appendChild(optionContenet);
        optionDiv.appendChild(optiondelete);
        optionDiv.addEventListener("click", (event) => {
          event.stopImmediatePropagation();
          dropdownOptions.classList.toggle("dropdown-options-show");
          content.textContent = option.name;
        });
        dropdownOptions.appendChild(optionDiv);
      });

      // Add an "Add New" option
      const addNewOptionDiv = document.createElement("div");
      addNewOptionDiv.classList.add("drop-content-label");
      const addNewOptionSpan = document.createElement("span");
      addNewOptionSpan.textContent = "Add New Option";
      addNewOptionDiv.appendChild(addNewOptionSpan);
      addNewOptionDiv.addEventListener("click", (event) => {
        event.stopImmediatePropagation();
        const newOptionName = prompt("Enter the new option:");
        if (newOptionName) {
          const newOption = { name: newOptionName }; // Create a new option object
          optionsCopy.push(newOption); // Add the new option to the options array
          const newOptionDiv = document.createElement("div");
          const newOptionContent = document.createElement("span");
          newOptionContent.textContent = newOption.name;
          const newOptionDelete = document.createElement("span");
          newOptionDelete.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
          newOptionDelete.classList.add("delete-icon");

          addNewOptionDrop(item, optionsCopy); // Add the new option to the item object
          newOptionDelete.addEventListener("click", (event) => {
            event.stopImmediatePropagation();
            content.textContent = "Select an option";
            newOptionDiv.remove();
            deleteOptionDrop(item, newOption);
            dropdownOptions.classList.toggle("dropdown-options-show");
          });

          newOptionDiv.classList.add("drop-content-label");
          newOptionDiv.appendChild(newOptionContent);
          newOptionDiv.appendChild(newOptionDelete);
          newOptionDiv.addEventListener("click", (event) => {
            event.stopImmediatePropagation();
            dropdownOptions.classList.toggle("dropdown-options-show");
            content.textContent = newOption.name;
          });
          dropdownOptions.insertBefore(newOptionDiv, addNewOptionDiv); // Insert new option before the "Add New" option
        }
      });
      dropdownOptions.appendChild(addNewOptionDiv);

      formField.appendChild(dropdownOptions);
    }
    formField.classList.add("form-field-style");

    // Append form field to outer container
    outerDiv.appendChild(formField);

    // Append outer container to form container
    formContainer.appendChild(outerDiv);
  });
};

const deleteSpecificData = (item) => {
  newArray = newArray.filter((ele) => ele.id !== item.id);
  finalArray = finalArray.filter((ele) => ele.id !== item.id);
};

function deleteOptionDrop(item, optionToDelete) {
  const updatedOptions = item.options.filter(
    (option) => option.name !== optionToDelete.name
  );
  const newItem = { ...item, options: updatedOptions };
  const index = newArray.findIndex((element) => element.id === item.id);
  newArray[index] = { ...newItem };
  const finalIndex = finalArray.findIndex((element) => element.id === item.id);
  finalArray[finalIndex] = { ...newItem };
}

function addNewOptionDrop(item, optionsCopy) {
  const newItem = { ...item, options: optionsCopy };
  const index = newArray.findIndex((element) => element.id === item.id);
  newArray[index] = { ...newItem };
  const finalIndex = finalArray.findIndex((element) => element.id === item.id);
  finalArray[finalIndex] = { ...newItem };
}

const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", () => {
  console.log(finalArray);
});

// Call the createForm function to generate the form
getJsonData();
createForm();
