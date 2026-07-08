import{s as a,a as l,n as r}from"./index-DUjbirWh.js";const c=`<section class="auth-page fade-in-up">
  <div class="row justify-content-center">
    <div class="col-lg-6 col-xl-5">
      <div class="surface-panel p-4 p-lg-5">
        <span class="badge text-bg-warning status-chip mb-3">Authentication</span>
        <h1 class="page-title h2 mb-2">Sign in</h1>
        <p class="muted-copy mb-4">Use any name and pick a role to simulate an authenticated session.</p>

        <form id="login-form" class="d-grid gap-3">
          <div>
            <label class="form-label" for="login-name">Display name</label>
            <input id="login-name" name="name" class="form-control form-control-lg" type="text" placeholder="Alex Reader" required />
          </div>
          <div>
            <label class="form-label" for="login-role">Role</label>
            <select id="login-role" name="role" class="form-select form-select-lg">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button class="btn btn-primary btn-lg" type="submit">Continue</button>
        </form>
      </div>
    </div>
  </div>
</section>`;function d(){return c}function g(){const n=document.getElementById("login-form");n==null||n.addEventListener("submit",i=>{i.preventDefault();const t=new FormData(n),e=String(t.get("name")??"").trim(),o=String(t.get("role")??"member");if(!e){a({title:"Missing name",message:"Enter a display name to continue.",variant:"warning"});return}l({name:e,role:o}),a({title:"Signed in",message:`Welcome back, ${e}.`,variant:"success"});const s=new URLSearchParams(window.location.search).get("redirect")||"/dashboard";r(s,{replace:!0})})}export{g as init,d as render};
