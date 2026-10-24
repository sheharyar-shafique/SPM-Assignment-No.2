'use strict';
const form=document.getElementById('registration-form');
form.addEventListener('submit',async event=>{
  event.preventDefault();
  const message=document.getElementById('message');
  const button=form.querySelector('button');
  button.disabled=true;
  message.classList.remove('success');
  message.textContent='';
  try{
    const response=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});
    const data=await response.json();
    if(!response.ok) throw new Error(data.error||'Registration failed');
    message.textContent='Account created successfully. You can now log in.';
    message.classList.add('success');
    form.reset();
  }catch(err){message.textContent=err.message||'Network error';}
  finally{button.disabled=false;}
});
