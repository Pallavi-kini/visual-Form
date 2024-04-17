import data from "./sampleData.json" assert { type: "json" };
console.log(data);
const formData = data.formData;
console.log(formData);

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
  console.log("Plus icon clicked for:", dataItem);
};

getJsonData();
