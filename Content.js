// document.getElementById('fileInput').addEventListener('change', function (event) {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = function (e) {
//         const csvText = e.target.result;
//         const rows = csvText.trim().split('\n').map(row => row.split(','));

//         if (rows.length < 2) {
//             alert("Invalid CSV file!");
//             return;
//         }

//         window.csvData = rows; // Store data globally for filtering
//         populateColumnDropdown(rows[0]);
//         displayTable(rows);
//     };
//     reader.readAsText(file);
// });

// // Populate dropdown with column headers
// function populateColumnDropdown(headers) {
//     const columnSelect = document.getElementById('columnSelect');
//     columnSelect.innerHTML = "";
//     headers.forEach((header, index) => {
//         const option = document.createElement('option');
//         option.value = index;
//         option.textContent = header;
//         columnSelect.appendChild(option);
//     });
// }

// // Filtering function
// document.getElementById('applyFilter').addEventListener('click', function () {
//     const filterValue = document.getElementById('filter').value.toLowerCase();
//     const selectedColumnIndex = document.getElementById('columnSelect').value;
//     if (!window.csvData || window.csvData.length < 2 || selectedColumnIndex === "") return;

//     const filteredRows = window.csvData.filter((row, index) =>
//         index === 0 || (row[selectedColumnIndex] && row[selectedColumnIndex].toLowerCase().includes(filterValue))
//     );

//     window.filteredData = filteredRows; // Store filtered data globally
//     displayTable(filteredRows);
// });

// // Function to display CSV data as a table
// function displayTable(data) {
//     const outputDiv = document.getElementById('output');
//     let tableHTML = "<table border='1' style='border-collapse: collapse; width: 100%;'>";

//     data.forEach((row, rowIndex) => {
//         tableHTML += "<tr>";
//         row.forEach(cell => {
//             tableHTML += rowIndex === 0
//                 ? `<th style='padding: 5px; background: #ddd;'>${cell}</th>`
//                 : `<td style='padding: 5px;'>${cell}</td>`;
//         });
//         tableHTML += "</tr>";
//     });

//     tableHTML += "</table>";
//     outputDiv.innerHTML = tableHTML;
// }

// // Export to Excel function
// document.getElementById('exportExcel').addEventListener('click', function () {
//     if (!window.filteredData || window.filteredData.length < 1) {
//         alert("No data to export!");
//         return;
//     }

//     const ws = XLSX.utils.aoa_to_sheet(window.filteredData); // Convert data to sheet
//     const wb = XLSX.utils.book_new(); // Create a new workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Filtered Data"); // Append the sheet

//     XLSX.writeFile(wb, "Filtered_Data.xlsx"); // Export as Excel file
// });


/*{
the function below will read either a .xslx or .csv file that will parse according to the file type.
the processFiles(dataframes) will contain the parsed files
}*/


document.getElementById("fileInput").addEventListener("change", function (event) {
    let files = event.target.files;
    if (files.length === 0 || files.length > 3) {
        return;
    }

    let dataFrames = [];
    let processedFiles = 0;

    Array.from(files).forEach(file => {
        let reader = new FileReader();

        reader.onload = function (event) {
            let fileData = event.target.result;
            let workbook, jsonData;

            if (file.name.endsWith(".xlsx")) {
                workbook = XLSX.read(fileData, { type: "binary" });
                jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            } else {
                jsonData = fileData.trim().split("\n").map(row => row.split(","));
            }

            dataFrames.push({ name: file.name, data: jsonData });
            processedFiles++;

            if (processedFiles === files.length) {
                alert("Files uploaded successfully");
                processFiles(dataFrames);
            }
        };

        if (file.name.endsWith(".xlsx")) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsText(file);
        }
    });
});

// /*{
// the function below will extract the files from upload and see if there are any common columns between the files 
// if there is no common columns, it will merge on parent name 
// }*/
// function processFiles(dataFrames) {
//     let commonColumns = findCommonColumns(dataFrames);

//     if (commonColumns.length > 0) {
//         populateColumnDropdown(commonColumns);
//     } else {
//         alert("No common columns found. Defaulting to Parent Name.");
//         mergeOnParentName(dataFrames);
//     }
// }

// /*{
// the function below extracts the columns from each file and sees if there are any common columns 
// and returns the common columns for filtering 
// }*/


// function findCommonColumns(dataFrames) {
//     let allColumns = dataFrames.map(df => Object.keys(df.data[0] || {}));
//     return allColumns.reduce((a, b) => a.filter(c => b.includes(c)), allColumns[0] || []);
// }

// /*{
// the function below takes the common columns from above and populates the <select> list for filtering

// }*/


// function populateColumnDropdown(columns) {
//     let columnSelect = document.getElementById("columnSelect");
//     columnSelect.innerHTML = "";
//     columns.forEach(col => {
//         let option = document.createElement("option");
//         option.value = col;
//         option.textContent = col;
//         columnSelect.appendChild(option);
//     });
// }

// /*{
// the function below if there are no common columns it will revert to merging on the parent name (needs to cbe changed )
// }*/


// function mergeOnParentName(dataFrames) {
//     let mergedData = {};

//     dataFrames.forEach(df => {
//         df.data.forEach(row => {
//             let key = row["Parent First Name"] + " " + row["Parent Last Name"];
//             if (!mergedData[key]) {
//                 mergedData[key] = row;
//             } else {
//                 Object.assign(mergedData[key], row);
//             }
//         });
//     });

//     displayTable(Object.values(mergedData));
// }
// /*{
// the function below gets the selected column and filter text.
// merged data to show only rows that include the filter text in selected column
// call displaytable(filtereddata)
// }*/

// document.getElementById("applyFilter").addEventListener("click", function () {
//     let filterValue = document.getElementById("filter").value.toLowerCase();
//     let selectedColumn = document.getElementById("columnSelect").value;

//     let filteredData = mergedData.filter(row =>
//         row[selectedColumn] && row[selectedColumn].toLowerCase().includes(filterValue)
//     );

//     displayTable(filteredData);
// });

/*{
the function below converts data into HTML <table>
handles both headers and cell values 
}*/


function displayTable(data) {
    let outputDiv = document.getElementById("output");
    let tableHTML = "<table border='1' style='border-collapse: collapse; width: 100%;'>";

    if (data.length > 0) {
        tableHTML += "<tr>";
        Object.keys(data[0]).forEach(col => {
            tableHTML += `<th style='padding: 5px; background: #ddd;'>${col}</th>`;
        });
        tableHTML += "</tr>";

        data.forEach(row => {
            tableHTML += "<tr>";
            Object.values(row).forEach(cell => {
                tableHTML += `<td style='padding: 5px;'>${cell}</td>`;
            });
            tableHTML += "</tr>";
        });
    } else {
        tableHTML += "<tr><td>No matching data found</td></tr>";
    }

    tableHTML += "</table>";
    outputDiv.innerHTML = tableHTML;
}
/*{
the function below exports the merged files into one file for information
}*/
// Export to Excel function
document.getElementById('exportExcel').addEventListener('click', function () {
    if (!window.filteredData || window.filteredData.length < 1) {
        alert("No data to export!");
        return;
    }

    const ws = XLSX.utils.aoa_to_sheet(window.filteredData); // Convert data to sheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data"); // Append the sheet

    XLSX.writeFile(wb, "Filtered_Data.xlsx"); // Export as Excel file
});