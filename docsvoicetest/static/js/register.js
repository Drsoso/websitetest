const usernamefield=document.querySelector("#usernamefield");
const feedbackarea=document.querySelector("#invalid-feedback");
const passwordfield=document.querySelector("#passwordfield");

const emailfield=document.querySelector("#emailfield");
const emailfeedbackarea=document.querySelector("#invalid-emailfeedback");

const usernamesuccess=document.querySelector("#usernamesuccess");
const emailsuccess=document.querySelector("#emailsuccess");

const showpasswordtoggel=document.querySelector("#showpassword");
const submitBtn=document.querySelector("#submit-btn");



showpasswordtoggel.addEventListener('click',(e)=>{
    console.log("sosos",111)
    if(showpasswordtoggel.textContent==="SHOW"){
        showpasswordtoggel.textContent="HIDE";
        passwordfield.setAttribute('type','text')
    }else{
        showpasswordtoggel.textContent="SHOW";
        passwordfield.setAttribute('type','password')
}

});












emailfield.addEventListener("keyup",(e)=>{
    const emailVal=e.target.value;
    emailsuccess.style.display="block"
    emailsuccess.textContent=`checking ${emailVal}`
    emailfield.classList.remove('is-invalid');
    emailfeedbackarea.style.display="none";
    if (emailVal.length>0){
        fetch("/authentication/validate-email",{
            body:JSON.stringify({email:emailVal}),
            method:"POST",
        })
        .then((res) => res.json())
        .then((data)=>{
            emailsuccess.style.display="none";
            emailresponce=data.email_error

            if(data.email_error){
                emailfield.classList.add('is-invalid');
                emailfeedbackarea.style.display="block";
                emailfeedbackarea.innerHTML=`<p>${data.email_error}</p>`;

                submitBtn.disabled=true;

            }else{
                if(usernameresponce){
                    submitBtn.disabled=true;

                }else{
                submitBtn.disabled=false;
                }
            }
        });
    }

    
});


usernamefield.addEventListener("keyup",(e)=>{
    const usernameVal=e.target.value;
    usernamesuccess.style.display="block"
    usernamesuccess.textContent=`checking ${usernameVal}`


    usernamefield.classList.remove('is-invalid');
    feedbackarea.style.display="none";
    if (usernameVal.length>0){
        fetch("/authentication/validate-username",{
            body:JSON.stringify({username:usernameVal}),
            method:"POST",
        })
        .then((res) => res.json())
        .then((data)=>{
            usernamesuccess.style.display="none";
            usernameresponce=data.username_error
            if(data.username_error){
                usernamefield.classList.add('is-invalid');
                feedbackarea.style.display="block";
                feedbackarea.innerHTML=`<p>${data.username_error}</p>`;
                submitBtn.disabled=true;

            }else{
                if(emailresponce){
                    submitBtn.disabled=true;
                }else{
                    submitBtn.disabled=false;
                }

            }
        });
    }

    
});