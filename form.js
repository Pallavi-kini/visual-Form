import data from "./sampleData.json" assert { type: "json" };
console.log(data);
const formData = data.formData;
console.log(formData);

const getJsonData = () => {
  const contentDiv = document.getElementById("formDesigner");

  formData.forEach((dataItem) => {
    const div = document.createElement("div");
    div.setAttribute(
      "id",
      "type",
      "label",
      "placeholder",
      "options",
      dataItem.id,
      dataItem.type,
      dataItem.label,
      dataItem.placeholder,
      dataItem.options
    );
    div.textContent = dataItem.type;
    div.classList.add("form-content");
    contentDiv.appendChild(div);
  });
};

getJsonData();
