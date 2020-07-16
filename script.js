// for initiating the local storage as one data value

// var first = [{
//   complaint_no : 'Masai/2020-21/1',
//   name : 'Shankhadeep Dhar',
//   date : '2020-06-17',
//   department : 'Current Student Issue',
//   issue : 'Python and Back-end Curriculum needs to be in focus more.',
//   status : 'Open',
// }]
// localStorage.setItem('all_complaints',JSON.stringify(first))

// defining all the global variable and setting the intial value

var data = JSON.parse(localStorage.getItem("all_complaints"));
var total_issue = data.length;
var current_page = 1;
var per_page = 5;
var total_pages = Math.ceil(total_issue / per_page);
var current_search;
var search;

// onload and the first render

window.onload = function () {
  search = document.getElementById("search");
  search.addEventListener("keyup", debouncer(500, keyword_search));

  render_table();
  update_badge();
};

// debouncer function search 

function debouncer(delay, callback) {
  var debounce;
  return function () {
    debounce && clearTimeout(debounce);
    debounce = setTimeout(function () {
      callback();
    }, delay);
  };
}

// keyword search along with the search params and converting to lowercase all to match search

function keyword_search() {
  current_search = search.value;
  current_search = current_search.toLowerCase();
  temp = data;
  data = [];
  //var temp = JSON.parse(localStorage.getItem("all_complaints"));


  for (var i = 0; i < temp.length; i++) {
    var str1 = temp[i].complaint_no.toLowerCase();
    var str2 = temp[i].name.toLowerCase();
    var str3 = temp[i].department.toLowerCase();
    var str4 = temp[i].issue.toLowerCase();
    var str5 = temp[i].status.toLowerCase();

    if (
      str1.includes(current_search) ||
      str2.includes(current_search) ||
      str3.includes(current_search) ||
      str4.includes(current_search) ||
      str5.includes(current_search)
    ) {
      data.push(temp[i]);
    }
  }
  render_table()
}

// determine the complaint number for the complaint raising form

function complaint_no() {
  var temp = JSON.parse(localStorage.getItem("all_complaints"));
  var current_complaint = temp.length + 1;
  var comp = document.getElementById("complaint_no");
  comp.innerText = "Ticket No : Masai/2020-21/" + current_complaint;
}

// adding a new issue

function add_issue() {
  var temp = JSON.parse(localStorage.getItem("all_complaints"));

  var current_complaint = temp.length + 1;
  var new_issue = {
    complaint_no: "Masai/2020-21/" + current_complaint,
    name: document.getElementById("name").value,
    date: document.getElementById("date").value,
    department: document.getElementById("department").value,
    issue: document.getElementById("issue").value,
    status: "Open",
  };

  temp.push(new_issue);
  data.push(new_issue);
  localStorage.setItem("all_complaints", JSON.stringify(temp));

  total_issue++;
  total_pages = Math.ceil(total_issue / per_page);
  render_table();
}

// RENDERING THE TABLE WITH GLOBAL VARIABLE

function render_table() {
  var table = document.getElementById("table");
  table.innerHTML = "";

  total_issue = data.length;
  total_pages = Math.ceil(total_issue / per_page);

  var to_item_no = current_page * per_page;
  if (to_item_no > total_issue) {
    to_item_no = total_issue;
  }

  for (var i = (current_page - 1) * per_page; i < to_item_no; i++) {
    var row = document.createElement("tr");

    var col1 = document.createElement("th");
    col1.setAttribute("scope", "row");
    col1.innerText = i + 1;

    var col2 = document.createElement("td");
    col2.innerText = data[i].complaint_no;

    var col3 = document.createElement("td");
    col3.innerText = data[i].name;

    var col4 = document.createElement("td");
    col4.innerText = data[i].date;

    var col5 = document.createElement("td");
    col5.innerText = data[i].department;

    var col6 = document.createElement("td");
    col6.innerText = data[i].issue;

    var col7 = document.createElement("td");
    if (data[i].status == "Open") {
      col7.setAttribute("class", "text-danger font-weight-bold");
    } else {
      col7.setAttribute("class", "text-primary");
    }
    col7.innerText = data[i].status;

    var col8 = document.createElement("td");
    var col8_2 = document.createElement("button");
    col8_2.setAttribute("class", "btn btn-outline-primary btn-sm");
    col8_2.innerText = "UPDATE";
    col8_2.setAttribute("id", i);

    col8.appendChild(col8_2);

    row.append(col1, col2, col3, col4, col5, col6, col7, col8);
    table.append(row);
  }

  table.addEventListener("click", update_status);

  render_page_index();
}

// status updated function , for both global as well as local storage variable

function update_status() {
  var update = event.target;
  var temp = JSON.parse(localStorage.getItem("all_complaints"));

  alert(
    "YOU are about to change the status of ticket No : " +
      data[update.id].complaint_no +
      " Are you certain to proceed?"
  );

  if (data[update.id].status == "Open") {
    data[update.id].status = "Closed";
  } else {
    data[update.id].status = "Open";
  }

  for (var i = 0; i < temp.length; i++) {
    if (temp[i].complaint_no === data[update.id].complaint_no) {
      temp[i].status = data[update.id].status;
      break;
    }
  }

  localStorage.setItem("all_complaints", JSON.stringify(temp));

  update_badge();
  render_table();
}

// Pageination render

function render_page_index() {
  var left_extreme = current_page - 2;
  var right_extreme = current_page + 2;

  if (left_extreme < 1) {
    left_extreme = 1;
    if (total_pages >= left_extreme + 4) {
      right_extreme = left_extreme + 4;
    } else {
      right_extreme = total_pages;
    }
  }
  if (right_extreme > total_pages) {
    right_extreme = total_pages;
    left_extreme = total_pages - 4;
  }

  var page_list = document.getElementById("pagination");
  page_list.innerHTML = "";

  var temp = document.createElement("li");
  temp.setAttribute("class", "page-item page-link");
  temp.setAttribute("id", "pre");
  temp.innerText = "Previous";

  page_list.append(temp);

  for (var i = left_extreme; i <= right_extreme; i++) {
    var temp = document.createElement("li");

    if (current_page == i) {
      temp.setAttribute("class", "page-item page-link colo");
    } else {
      temp.setAttribute("class", "page-item page-link");
    }
    temp.setAttribute("id", i);
    temp.innerText = i;

    page_list.append(temp);
  }

  var temp = document.createElement("li");
  temp.setAttribute("class", "page-item page-link");
  temp.setAttribute("id", "nex");
  temp.innerText = "Next";

  page_list.append(temp);

  page_list.addEventListener("click", page_form);
}

// logic for page propagation with previous & next functions also checking and updating left right and current page

function page_form() {
  var page_number = event.target.id;

  if (page_number == "pagination") {
    return true;
  }

  if (page_number == "pre" && current_page == 1) {
    page_number = 1;
  } else if (page_number == "pre" && current_page > 1) {
    page_number = current_page - 1;
  } else if (page_number == "nex" && current_page == total_pages) {
    page_number = total_pages;
  } else if (page_number == "nex" && current_page < total_pages) {
    page_number = current_page + 1;
  } else {
    page_number = Number(page_number);
  }

  current_page = Number(page_number);

  render_table();
}

// global variable sort

function sort() {
  var sort = document.getElementById("sort_by").value;

  data = data.sort(function (a, b) {
    if (a[sort] > b[sort]) {
      return 1;
    } else {
      return -1;
    }
  });

  current_page = 1;
  render_table();
}

// status counter badge updating

function update_badge() {
  var temp = JSON.parse(localStorage.getItem("all_complaints"));
  var count = 0;

  for (var i = 0; i < temp.length; i++) {
    if (temp[i].status === "Open") {
      count++;
    }
  }
  document.getElementById("badge").innerText = count;
}

// filtering - all data

function all_tickets() {
  current_page = 1;
  data = [];

  data = JSON.parse(localStorage.getItem("all_complaints"));
  render_table();
}

// filtering - open tickets and updating global variable for render

function open_tickets() {
  current_page = 1;

  var temp = JSON.parse(localStorage.getItem("all_complaints"));
  data = [];

  for (var i = 0; i < temp.length; i++) {
    if (temp[i].status === "Open") {
      data.push(temp[i]);
    }
  }
  render_table();
}

// filtering - closed tickets and updating global variable for render

function closed_tickets() {
  current_page = 1;

  var temp = JSON.parse(localStorage.getItem("all_complaints"));
  data = [];

  for (var i = 0; i < temp.length; i++) {
    if (temp[i].status === "Closed") {
      data.push(temp[i]);
    }
  }
  render_table();
}

// filtering - urgent tags to be attached and updated

function urgent_tickets() {
  alert("Urgent Badging to come soon !!");
}

// reports

function report() {
  alert(
    "PLEASE UPDATE YOUR SUBSCRIPTION FOR REPORTS AT $ 9.99 / pm per User only !!!!!"
  );
}

// boom and the page will be slowly eaten away
// the functions and constansts related to ball bouncing

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const circle = {
  x: 200,
  y: 200,
  size: 30,
  dx: 10,
  dy: 8,
};

function fun_ball() {
  alert("R E L A X");
  canvas.style.zIndex = +1;
  update_ball();
}

function draw_ball() {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}

function update_ball() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  draw_ball();

  circle.x += circle.dx;
  circle.y += circle.dy;

  if (circle.x + circle.size > canvas.width || circle.x - circle.size < 0) {
    circle.dx *= -1;
  }

  if (circle.y + circle.size > canvas.height || circle.y - circle.size < 0) {
    circle.dy *= -1;
  }

  requestAnimationFrame(update_ball);
}
