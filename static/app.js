

    window.onload = respondStudentRefresh;
    /*
    ------------  Insert data related operations ------------
    */
    // Getting Submit button ID on index.html page
    const btn_submit_student = document.getElementById("btn-student-submit");
    
    // Associating event listener on submit button
    btn_submit_student.addEventListener("click", respondStudentSubmit);

    let clicked_row;
    // function respond on submit button click
    function respondStudentSubmit() {
      // getting data from input fields
      const inputData = getInputFieldsData();

      $.ajax({
        url: `/students`,
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(
          getInputFieldsData()
        ),
        success: function (data) {
          appendRowInTable(data);
        },
        complete: function(){
          $('#alert-succes-insert').alert();
          resetStudentFields();
        }
      });
    }
    
    // function append row in data table upon successful submission of data
    function appendRowInTable(data) {
      const data_table = document.getElementById('data-table-body');
      let table_row = document.createElement('tr');
      table_row.innerHTML = `<th scope="row">${data.id}</th>
            <td>${data.first_name}</td>
            <td>${data.last_name}</td>
            <td>${data.department}</td>
            <td>${data.is_graduated}</td>
            <td>${data.age}</td>
            <td><button id="btn-student-update${data.id}" data-id="${data.id}" type="button" class="btn btn-primary" onclick="respondStudentUpdateRow(event)" >Update Row
          </button></td>
            <td><button id="btn-student-delete${data.id}" data-id="${data.id}" type="button" class="btn btn-danger" onclick="respondStudentDeleteRow(event)">Delete Row
          </button></td>` ;
      data_table.appendChild(table_row);
    }

    /*
    ------------  Update data related operations ------------
    */

    // function respond on update row button click
    // get the fields filled with data and enable update button
    function respondStudentUpdateRow(event) {

      // getting clicked button
      const clicked_update_button = event.srcElement;
      // getting row having elements to be updated
      clicked_row = clicked_update_button.parentElement.parentElement;

      // getting current data in the fields to be updated
      const id = clicked_row.children[0].textContent;
      let update_button = document.getElementById('btn-student-update');
      update_button.setAttribute('data-id', id);
      document.getElementById('first_name').value = clicked_row.children[1].textContent;
      document.getElementById('last_name').value = clicked_row.children[2].textContent;
      document.getElementById('department').value = clicked_row.children[3].textContent;
      const is_graduated = clicked_row.children[4];
      if (is_graduated.textContent === "true") {
        document.getElementById('is-graduated1').checked = true;
      }
      else {
        document.getElementById('is-graduated2').checked = true;
      }   
      document.getElementById('age').value = clicked_row.children[5].textContent;
      
      // toggling buttons' status
      update_button.disabled = false;
      document.getElementById('btn-student-submit').disabled = true;

    }

    // Getting Submit button ID on index.html page
    const btn_update_student = document.getElementById("btn-student-update");
    
    // Associating event listener on submit button
    btn_update_student.addEventListener("click", respondStudentUpdate);

    // function sends ajax request to update data store also update the data table
    function respondStudentUpdate() {
      // getting current data in the fields to be updated
      const id = clicked_row.children[0].textContent;
      $.ajax({
        url: `/students/${id}`,
        method: "PUT",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(
          getInputFieldsData()
        ),
        success: function (data) {
          replaceRowInTable(clicked_row, data);
        },
        complete: function(){
          resetStudentFields();

          // toggling buttons' status
          document.getElementById('btn-student-update').disabled = true;
          document.getElementById('btn-student-submit').disabled = false;
        }
      });
    }

    // function replace row in data table upon successful updation of data
    function replaceRowInTable(table_row, data) {
      table_row.innerHTML = `<th scope="row">${data.id}</th>
            <td>${data.first_name}</td>
            <td>${data.last_name}</td>
            <td>${data.department}</td>
            <td>${data.is_graduated}</td>
            <td>${data.age}</td>
            <td><button id="btn-student-update${data.id}" data-id="${data.id}" type="button" class="btn btn-primary" onclick="respondStudentUpdateRow(event)" >Update Row
          </button></td>
            <td><button id="btn-student-delete${data.id}" data-id="${data.id}" type="button" class="btn btn-danger" onclick="respondStudentDeleteRow(event)" >Delete Row
          </button></td>` ;
    }

    /*
    ------------  Delete data related operations ------------
    */

    function respondStudentDeleteRow(event) {

      let decision = confirm('Type DELETE to delete this record', 'No');
      decision = decision.toLowerCase();
      
      if (decision === 'delete'){
        // getting clicked button
        const clicked_delete_button = event.srcElement;
        // getting row having elements to be updated
        clicked_row = clicked_delete_button.parentElement.parentElement;

        // getting current data in the fields to be updated
        const id = clicked_row.children[0].textContent;

        $.ajax({
          url: `/students/${id}`,
          method: "DELETE",
          success: function() {
            clicked_row.remove();
          }
        });
      }
      
    }


    /*
    ------------------  Refresh table data ------------------
    */
    
    // Getting Submit button ID on index.html page
    const btn_refresh_table = document.getElementById("btn-student-refresh");
    
    // Associating event listener on submit button
    btn_refresh_table.addEventListener("click", respondStudentRefresh);

    function respondStudentRefresh() {

      $.ajax({
        url: `/students`,
        method: "GET",
        success: function(data){
          populateDataInTable(data);
        }
      });
    }

    function populateDataInTable(records) {
      const data_table = document.getElementById('data-table-body');
      let table_html = "";

      for (let record of records) {
        table_html = table_html
          .concat(`<tr><th scope="row">${record.id}</th>
            <td>${record.first_name}</td>
            <td>${record.last_name}</td>
            <td>${record.department}</td>
            <td>${record.is_graduated}</td>
            <td>${record.age}</td>
            <td><button id="btn-student-update${record.id}" data-id="${record.id}" type="button" class="btn btn-primary" onclick="respondStudentUpdateRow(event)" >Update Row</button>
            </td>
            <td><button id="btn-student-delete${record.id}" data-id="${record.id}" type="button" class="btn btn-danger" onclick="respondStudentDeleteRow(event)">Delete Row</button>
            </td>
          </tr>`)
      }
      data_table.innerHTML = table_html;
    }

    // function to get data from input fields
    function getInputFieldsData(){
      const first_name = document.getElementById("first_name").value;
      const last_name = document.getElementById("last_name").value;
      const department = document.getElementById("department").value;
      const is_graduated = document.getElementById('is-graduated1').checked ? true : false;
      const age = JSON.parse(document.getElementById("age").value);

      return {first_name, last_name, department, is_graduated, age}
    }

    // function to reset input fields
    function resetStudentFields() {
      const inputs = document.querySelectorAll('.form-inline input[type = "text"], .form-inline input[type = "number"]');
      for (let input of inputs){
        input.value = '';
      }

      const radioInputs = document.getElementsByName('is_graduated');
      for (let radio of radioInputs) {
        radio.checked = false;
      }
    }