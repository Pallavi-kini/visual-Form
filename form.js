import data from "./sampleData.json" assert { type: "json" };
// console.log(data);
const formData = data.formData;
// console.log(formData);
var newArray = [];
newArray = formData;

const getJsonData = () => {
  const contentDiv = document.getElementById("formDesigner");

  formData.forEach((dataItem) => {
    // Create the main container div
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

    // Create a span for the plus icon
    const plusIcon = document.createElement("span");
    plusIcon.innerHTML = '<i class="fa-solid fa-plus"></i>';
    plusIcon.classList.add("plus-icon");
    div.appendChild(plusIcon);
    plusIcon.addEventListener("click", () => {
      handlePlusIconClick(dataItem);
    });

    // Append the main container div to the content div
    contentDiv.appendChild(div);
  });
};

const handlePlusIconClick = (dataItem) => {
  // Your logic here
  newArray = [];
  newArray.push(dataItem);
  createForm();
};

const createForm = () => {
  console.log(newArray);
  const formContainer = document.getElementById("formContainer");

  //Create outer container for each form field
  newArray.forEach((item) => {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("form-field-container");

    // Create inner container for label and delete icon
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("inner-container");

    // Create label element
    const label = document.createElement("label");
    label.textContent = item.label;

    label.contentEditable = true;
    // label.addEventListener("blur", () => {
    //   editFields();
    // });

    // Create delete icon
    const deleteIcon = document.createElement("span");
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteIcon.classList.add("delete-icon");
    deleteIcon.addEventListener("click", () => {
      outerDiv.remove();
      deleteSpecificData(item);
    });
    console.log(newArray);

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
      formField = document.createElement("select");
      formField.setAttribute("name", item.label.toLowerCase());

      item.options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option; // Display option name

        formField.appendChild(optionElement);

        const optionContainer = document.createElement("div");
        optionContainer.classList.add("option-container");

        const optionDelete = document.createElement("span");
        optionDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
        optionDelete.classList.add("delete-icon");
        optionDelete.addEventListener("click", () => {
          deleteOption(option, item);
        });

        optionContainer.appendChild(optionDelete);

        // Append delete icon next to option
        optionElement.dataset.deleteIcon = optionDelete.outerHTML;
      });
    }
    formField.classList.add("form-field-style");
    // Append form field to outer container
    outerDiv.appendChild(formField);

    // Append outer container to form container
    formContainer.appendChild(outerDiv);
  });
};

const deleteOption = (option, item) => {
  // Find the index of the option in the options array
  const indexToDelete = item.options.indexOf(option);
  if (indexToDelete !== -1) {
    // Remove the option from the options array
    item.options.splice(indexToDelete, 1);
    // Re-render the form
    createForm();
  }
};

const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", () => {
  console.log("Save button clicked", newArray);
});

// Call the createForm function to generate the form
getJsonData();
createForm();
