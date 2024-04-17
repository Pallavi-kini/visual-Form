var allData = [
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
    id: "45002ecf-85cf-4852-bc46-529f94a758f5",
    type: "input",
    label: "Sample Label",
    placeholder: "Sample Placeholder",
  },
  {
    id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
    type: "textarea",
    label: "Sample Label",
    placeholder: "Sample Placeholder",
  },
];

const getJsonData = () => {
  const formContainer = document.getElementById("formDesigner");
  formContainer.innerHTML = "";

  formData.forEach(function (field) {
    var fieldElement;
    if (field.type === "input" || field.type === "textarea") {
      fieldElement = document.createElement(field.type);
      fieldElement.setAttribute("placeholder", field.placeholder);
    } else if (field.type === "select") {
      fieldElement = document.createElement("select");
      field.options.forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.textContent = option;
        fieldElement.appendChild(optionElement);
      });
    }
    fieldElement.setAttribute("id", field.id);
    fieldElement.setAttribute("name", field.id);
    fieldElement.setAttribute("type", field.type);
    fieldElement.setAttribute("label", field.label);
    formContainer.appendChild(fieldElement);
  });
};

getJsonData();
