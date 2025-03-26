
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
