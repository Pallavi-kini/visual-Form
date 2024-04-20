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

    // drag drop function
    dragDropElement(outerDiv, formContainer, item);

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

      const mainSmall = createDivElement("drop-content", () => {
        dropdownOptions.classList.toggle("dropdown-options-show");
      });

      const content = createSpanElement("Select an option");
      const arrow = createIconElement("fa-solid fa-angle-down delete-icon");

      mainSmall.appendChild(content);
      mainSmall.appendChild(arrow);
      formField.appendChild(mainSmall);

      const dropdownOptions = document.createElement("div");
      dropdownOptions.classList.add("dropdown-options");

      item.options.forEach((option) => {
        const optionDiv = createOptionDiv(
          option,
          item,
          dropdownOptions,
          content
        );
        dropdownOptions.appendChild(optionDiv);
      });

      const addNewOptionDiv = createAddNewOptionDiv(dropdownOptions, content);
      dropdownOptions.appendChild(addNewOptionDiv);

      formField.appendChild(dropdownOptions);
    }

    function createDivElement(className, onClickHandler) {
      const div = document.createElement("div");
      div.classList.add(className);
      div.addEventListener("click", onClickHandler);
      return div;
    }

    function createSpanElement(textContent) {
      const span = document.createElement("span");
      span.textContent = textContent;
      return span;
    }

    function createIconElement(className) {
      const icon = document.createElement("span");
      icon.innerHTML = `<i class="${className}"></i>`;
      return icon;
    }

    function createOptionDiv(option, item, dropdownOptions, content) {
      const optionDiv = document.createElement("div");
      const optionContent = createSpanElement(option.name);
      const optionDelete = createIconElement(
        "fa-regular fa-trash-can delete-icon"
      );

      optionDiv.classList.add("drop-content-label");
      optionDiv.appendChild(optionContent);
      optionDiv.appendChild(optionDelete);

      optionDelete.addEventListener("click", (event) => {
        event.stopImmediatePropagation();
        content.textContent = "Select an option";
        optionDiv.remove();
        deleteOptionDrop(item, option);
        dropdownOptions.classList.toggle("dropdown-options-show");
      });

      optionDiv.addEventListener("click", (event) => {
        event.stopImmediatePropagation();
        dropdownOptions.classList.toggle("dropdown-options-show");
        console.log("Selected option:", option);
        content.textContent = option.name;
      });

      addNewOptionDrop(item, [...item.options]);

      return optionDiv;
    }

    function createAddNewOptionDiv(dropdownOptions, content) {
      const addNewOptionDiv = createDivElement(
        "drop-content-label",
        (event) => {
          event.stopImmediatePropagation();
          const newOptionName = prompt("Enter the new option:");
          if (newOptionName) {
            const newOption = { name: newOptionName };
            const newOptionDiv = createOptionDiv(
              newOption,
              item,
              dropdownOptions,
              content
            );
            dropdownOptions.insertBefore(newOptionDiv, addNewOptionDiv);
          }
        }
      );
      const addNewOptionSpan = createSpanElement("Add New Option");
      addNewOptionDiv.appendChild(addNewOptionSpan);
      return addNewOptionDiv;
    }

    formField.classList.add("form-field-style");

    // Append form field to outer container
    outerDiv.appendChild(formField);

    // Append outer container to form container
    formContainer.appendChild(outerDiv);
  });
};

const dragDropElement = (outerDiv, formContainer, item) => {
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
      const draggedElement = document.getElementById(startIndex);
      const dropZoneElement = document.getElementById(endIndex);
      const dropZoneIndex = Array.from(formContainer.children).indexOf(
        dropZoneElement
      );

      if (draggedElement.offsetTop > dropZoneElement.offsetTop) {
        formContainer.insertBefore(draggedElement, dropZoneElement);
      } else if (draggedElement.offsetTop < dropZoneElement.offsetTop) {
        formContainer.insertBefore(
          draggedElement,
          formContainer.children[dropZoneIndex + 1] || null
        );
      }
      updateNewArrayOrder();
    }
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
