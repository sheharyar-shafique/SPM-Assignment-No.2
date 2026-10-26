'use strict';
const form=document.getElementById('login-form');
const message=document.getElementById('message');
const signedIn=document.getElementById('signed-in');
function showUser(user){
  form.hidden=true;
  signedIn.hidden=false;
  document.getElementById('account-name').textContent=user.name;
  message.textContent='';
}
form.addEventListener('submit',async event=>{
  event.preventDefault();
  const button=form.querySelector('button');
  button.disabled=true;
  message.classList.remove('success');
  message.textContent='';
  try{
    const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(Object.fromEntries(new FormData(form)))});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'Login failed');
    form.reset();
    showUser(data.user);
  }catch(err){message.textContent=err.message||'Network error';}
  finally{button.disabled=false;}
});
document.getElementById('logout-button').addEventListener('click',async()=>{
  const res=await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'});
  if(!res.ok){message.textContent='Logout failed';return;}
  signedIn.hidden=true;
  form.hidden=false;
  message.classList.add('success');
  message.textContent='Logged out successfully.';
});
fetch('/api/auth/me',{credentials:'same-origin'}).then(r=>r.ok?r.json():null).then(data=>{if(data && data.user)showUser(data.user);}).catch(()=>{});
