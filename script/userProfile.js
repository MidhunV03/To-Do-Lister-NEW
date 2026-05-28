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

const API = "http://localhost:3000/users";

const currentUser =JSON.parse(localStorage.getItem("Userdetail"));
console.log(currentUser.Userid)

window.onload = async function fetching() {
    
    try
    {
        const response = await fetch(`${API}?id=${currentUser.Userid}`);
        const data = await response.json();

        console.log(data)
        const userDetails = document.getElementById("userDetails")

        data.forEach(element => {
            const div = document.createElement('div');
            div.innerHTML = `
            <div class = "row p-3">
                <div class = "col-md-6">
                    <img src="../asserts/Login.svg" style = "height:auto"> 
                </div>
                <div class = "col-md-6">
                    <h1 class="d-flex justify-content-center "><strong>USER DETAILS</strong></h1>

                    <br>
                    <div class = "d-flex flex-column justify-content-center align-item-start gap-3">
                        <h1 class="fs-4">NAME :<strong> ${element.name}</strong></h1>
                        <h1 class="fs-4">EMAIL :<strong> ${element.email}</strong></h1>
                        <h1 class="fs-4">DATE OF BIRTH [yyyy-mm-dd] :<strong> ${element.dob}</strong></h1>
                        <h1 class="fs-4">GENDER :<strong> ${element.gender}</strong></h1>
                        <h1 class="fs-4">ADDRESS :<strong> ${element.address}</strong></h1>
                        <br>
                        <button class = "btn btn-danger w-25 logout-btn">LOG OUT</button>
                    </div>
                </div>
            </div>
            `;
            userDetails.appendChild(div)
        });

    document.querySelectorAll(".logout-btn").forEach(button => {
            button.addEventListener('click', function () {
                console.log("Click");
                localStorage.clear();
                window.location.href = 'Home.html';
            });
        });

    }
    catch(error)
    {
        toastr.error(error);
    }

}
