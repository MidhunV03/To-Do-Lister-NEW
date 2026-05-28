$('#dark-toggle').on('click',function(){
    $('body').toggleClass("dark-mode");
    if ($('body').hasClass("dark-mode")) 
    {
        $('#dark-toggle').text('☀️');
    } 
    else {
        $('#dark-toggle').text('🌙');
    }
})

const API = "http://localhost:3000/tasks";
let currentTab = 'ALL';
const parent_div = document.getElementById('parent-div');
const currentUser = JSON.parse(localStorage.getItem("Userdetail"))
const currentUserID = currentUser.Userid;

document.getElementById("addbtn").addEventListener('click',function()
{
    const startdateInput = document.getElementById('startdate');
    const duedate = document.getElementById('duedate1');
    const today = new Date().toISOString().split("T")[0];

    startdateInput.value = today;
    startdateInput.min = today;
    startdateInput.max = today;

    duedate.value = "";
    duedate.min = today;

})

document.getElementById("saveTask").addEventListener('click', async function () {

    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const startdate = document.getElementById('startdate').value;
    const duedate = document.getElementById('duedate1').value;
    const priority = document.getElementById('priority').value;

    let isPending = false;
    let isCompleted = false;
    let isdeleted = false;

    try {
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: title,
                Desc: desc,
                isPending : isPending,
                isCompleted : isCompleted,
                isdeleted : isdeleted,
                startdate : startdate,
                duedate : duedate,
                priority : priority,
                userid : currentUserID
            })
        });   

        document.getElementById('title').value = "";
        document.getElementById('desc').value = "";

        fetchTask(); 
    }
    catch (error) {
        console.log(error);
    }
});


async function fetchTask()
{
    try
    {
        const response = await fetch(`${API}?userid=${currentUserID}&isdeleted=false`);
        const data = await response.json();
        // const taskContainer = document.getElementById('taskContainer');
        // taskContainer.innerHTML = "";
        // data.forEach(element => {
        //     const div = document.createElement('div');
        //     div.classList.add("mb-3", "p-3", "border", "rounded");
        //     div.innerHTML = `
        //         <h3>${element.Title}</h3>
        //         <h5>${element.Desc}</h5>
        //        <button onclick="deletetask('${element.id}')">
        //             Delete
        //         </button>
        //        <button onclick="completetask('${element.id}')">
        //             Completed
        //         </button>              
        //     `;     
        //     taskContainer.appendChild(div) 
        // });
        renderTasks(data)
    }
    catch(error)
    {
        toastr.error(error);
    }
}
fetchTask();
async function deletetask(taskid)
{
    console.log("delete")
    try
    {   
        await fetch(`${API}/${taskid}`, {
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                isdeleted : true
            })
        });

        refreshCurrentTab();
    }
    catch(error)
    {
        console.log(error);
    }   
}

async function completetask(taskid)
{

    try
    {
        await fetch(`${API}/${taskid}`,{
            method : "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify({
                isCompleted : true
            })
        })
        fetchTask();
    }
    catch(error)
    {
        console.log(error)
    }   
}
function renderTasks(data)
{
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = "";
    data.forEach(element => {
        const div = document.createElement('div');
        div.classList.add(
            "mb-3",
            "p-3",
            "border",
            "rounded",
            "shadow-sm"
        );
        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div>
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                <p class="mb-2">
                    <strong>Priority :</strong>
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
            </div>

        
        <div class="">
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        `;
        taskContainer.appendChild(div);
    });
}
function pendingrenderTasks(data)
{
    const pendingtaskContainer =
    document.getElementById('pendingTaskContainer');   
    pendingtaskContainer.innerHTML = "";
    
    data.forEach(element => {
        const div = document.createElement('div');
        div.classList.add("mb-3","p-3","border","rounded");
        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div>
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                <p class="mb-2">
                    <strong>Priority :</strong>
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
            </div>

        
        <div class="">
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        `;
        pendingtaskContainer.appendChild(div);
        
    });
}
document.getElementById('pendingtaskbtn').addEventListener('click', async function pendingtask() {
    currentTab = 'pending';
    try
    {   
       const response = await fetch(`${API}?userid=${currentUserID}&isCompleted=false&isdeleted=false`);
       const data = await response.json();
       pendingrenderTasks(data);
    }
    catch(error)
    {
        console.log(error);
    }
})
async function restoretask(taskid) 
{
    try
    {
        await fetch(`${API}/${taskid}`,{
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                isdeleted : false
            })
        })
    }   
    catch
    {
        console.error("error")
    } 
    refreshCurrentTab();
}
function deletedrenderTasks(data)
{
    const deletedtaskContainer =document.getElementById('deletedTaskContainer');   deletedtaskContainer.innerHTML = "";
    
    data.forEach(element => {
        const div = document.createElement('div');
        div.classList.add("mb-3","p-3","border","rounded");
        div.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
        <div>
            <h3>${element.Title}</h3>
        </div>
    </div>
    <div class="mt-3">
        <button 
            onclick="restoretask('${element.id}')"
            class="btn btn-danger">
            restore
        </button>
    </div>
`;
        deletedtaskContainer.appendChild(div);
        
    });
}
document.getElementById('deletedtaskbtn').addEventListener('click', async function deletedtask() {
    currentTab = 'delete';

    // document.querySelectorAll(".tab-pane").forEach(tab => {
    //     tab.classList.remove('show','active');
    // });

    // document.getElementById('deleted').classList.add('show', 'active');

    try
    {   
       const response = await fetch(`${API}?userid=${currentUserID}&isdeleted=true`);
       const data = await response.json();
       deletedrenderTasks(data);
    }
    catch(error)
    {
        toastr.error(error);
    }
})

let updateTaskId = null;

function openUpdateModal(id,title,desc,startdate,duedate,priority)
{
    updateTaskId = id;

    document.getElementById('updatetitle').value = title;
    document.getElementById('updatedesc').value = desc;

    document.getElementById('updatestartdate').value = startdate;

    document.getElementById('updateduedate').value = duedate;

    document.getElementById('updatepriority').value = priority;
}

document.getElementById("updateTask").addEventListener('click',async function(){

    const updatedTitle =
    document.getElementById('updatetitle').value;

    const updatedDesc =
    document.getElementById('updatedesc').value;
    const updatedStartDate =
    document.getElementById('updatestartdate').value;

    const updatedDueDate =
    document.getElementById('updateduedate').value;

    const updatedPriority =
    document.getElementById('updatepriority').value;
        
    try
    {
        await fetch(`${API}/${updateTaskId}`,{
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
            Title : updatedTitle,
            Desc : updatedDesc,
            startdate : updatedStartDate,
            duedate : updatedDueDate,
            priority : updatedPriority
        })
        })
        refreshCurrentTab();
    }
    catch(error)
    {
        toastr.error(error)
    }
        
    const modal = bootstrap.Modal.getInstance(document.getElementById('updateTaskModal'));
    modal.hide();
})

async function changeStatus(id,value) 
{
    try{
        await fetch(`${API}/${id}`,{
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                isCompleted : value === "true"
            })
        })
        fetchTask();
    }
    catch(error)
    {
        toastr.error(error)
    }    
}
function completedrenderTasks(data)
{
    const completedtaskContainer =
    document.getElementById('completedTaskContainer');   
    completedtaskContainer.innerHTML = "";
    
    data.forEach(element => {
        const div = document.createElement('div');
        div.classList.add(
            "mb-3",
            "p-3",
            "border",
            "rounded"
        );
        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div>
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                <p class="mb-2">
                    <strong>Priority :</strong>
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
            </div>

        
        <div class="">
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        `;
        completedtaskContainer.appendChild(div);
    });
}
document.getElementById('completedtaskbtn').addEventListener('click', async function completedtask() {
    currentTab = 'complete';
    try
    {   
       const response = await fetch(`${API}?userid=${currentUserID}&isCompleted=true`);
       const data = await response.json();
       completedrenderTasks(data);
    }
    catch(error)
    {
        console.log(error);
    }
})

function overduerenderTasks(data)
{
    const duedatetaskContainer =
    document.getElementById('duedateTaskContainer');

    duedatetaskContainer.innerHTML = "";

    data.forEach(element => {

        const div = document.createElement('div');

        div.classList.add(
            "mb-3",
            "p-3",
            "border",
            "rounded",
            "shadow-sm"
        );

        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <h3 class="fw-bold mb-2">${element.Title}</h3>
                <p class="mb-2">${element.Desc}</p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>

                <p class="mb-1 text-danger fw-bold">
                    <strong>Due Date :</strong>
                    ${element.duedate}
                </p>
                <p class="mb-2">
                    <strong>Priority :</strong>
                    ${
                        element.priority === "High"
                        ?
                        `<span class="text-danger fw-bold">
                            🔴 High
                        </span>`
                        :
                        `<span class="text-success fw-bold">
                            🟢 Low
                        </span>`
                    }
                </p>
            </div>
        </div>

        <div class="mt-3">

            <button
                onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>

            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">

                Delete
            </button>

        </div>
        `;

        duedatetaskContainer.appendChild(div);
    });
}

document.getElementById('duedatetaskbtn').addEventListener('click', async function () {
    currentTab = 'duedate';
    try
    {
        const today = new Date().toISOString().split("T")[0];

        const response = await fetch(
            `${API}?userid=${currentUserID}&isdeleted=false`
        );

        const data = await response.json();

        const overdueTasks = data.filter(element =>
            element.duedate < today &&
            element.isCompleted === false
        );

        overduerenderTasks(overdueTasks);
    }
    catch(error)
    {
        console.log(error);
    }
});

function highpriorityrenderTasks(data)
{
    const highprioritytaskContainer =
    document.getElementById('highpriorityTaskContainer');

    highprioritytaskContainer.innerHTML = "";

    data.forEach(element => {

        const div = document.createElement('div');

        div.classList.add(
            "mb-3",
            "p-3",
            "border",
            "rounded"
        );

        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">

            <div>
                <h3>${element.Title}</h3>
                <h5>${element.Desc}</h5>

                <p class="text-danger fw-bold">
                    🔴 High Priority
                </p>
            </div>
        </div>
        `;

        highprioritytaskContainer.appendChild(div);
    });
}

document.getElementById('highprioritytaskbtn').addEventListener('click', async function () {

    currentTab = 'highpriority';
    try
    {
        const response = await fetch(
            `${API}?userid=${currentUserID}&priority=High&isdeleted=false`
        );

        const data = await response.json();

        highpriorityrenderTasks(data);
    }
    catch(error)
    {
        console.log(error);
    }
});



async function refreshCurrentTab()
{
    try
    {
        if(currentTab === 'ALL')
        {
            fetchTask();
        }
        else if(currentTab === 'pending')
        {
            const response = await fetch(
                `${API}?userid=${currentUserID}&isCompleted=false&isdeleted=false`
            );
            const data = await response.json();
            pendingrenderTasks(data);
        }
        else if(currentTab === 'completed')
        {
            const response = await fetch(
                `${API}?userid=${currentUserID}&isCompleted=true&isdeleted=false`
            );
            const data = await response.json();
            completedrenderTasks(data);
        }
        else if(currentTab === 'delete')
        {
            const response = await fetch(
                `${API}?userid=${currentUserID}&isdeleted=true`
            );
            const data = await response.json();
            deletedrenderTasks(data);
        }
        else if(currentTab === 'duedate')
        {
            const today = new Date().toISOString().split("T")[0];
            const response = await fetch(
                `${API}?userid=${currentUserID}&isdeleted=false`
            );
            const data = await response.json();
            const overdueTasks = data.filter(element =>
                element.duedate < today &&
                element.isCompleted === false
            );
            overduerenderTasks(overdueTasks);
        }
        else if(currentTab === 'highpriority')
        {
            const response = await fetch(
                `${API}?userid=${currentUserID}&priority=High&isdeleted=false`
            );

            const data = await response.json();

            highpriorityrenderTasks(data);
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

const userNametag = document.getElementById("username");

window.onload = function(){
    const atag = document.createElement('a');
    atag.classList.add("nav-link");
    atag.style.cursor = "pointer";
    atag.href = "userProfile.html"
    atag.innerHTML = 
    `HI,<strong> ${currentUser.Name}</strong>`
    userNametag.appendChild(atag)
}
