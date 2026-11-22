const API = "";
const currentUser =
sessionStorage.getItem(
    "karmaStaffEmail"
);

if(currentUser){

    const userElement =
    document.getElementById(
        "loggedUser"
    );

    if(userElement){

        userElement.textContent =
        currentUser;
    }
}
const logoutBtn =
document.getElementById(
    "logoutBtn"
);

if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        () => {

            sessionStorage.clear();

            window.location.href =
            "login.html";
        }
    );
}
const STORAGE_KEY = "Karma-demo-v1";
const today = new Date();
const dateOffset = (days) => { const d = new Date(); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); };
const initialData = {
  animals: [
    {id:6,name:"Maxuu",species:"Dog",breed:"Beagle",age:"6 year",gender:"Male",status:"Under Care",location:"Sector 15, Chandigarh",rescueDate:dateOffset(-3),notes:"Under observation.",emoji:"🐶"},
    {id:2,name:"Buzo",species:"Cat",breed:"Husky",age:"8 months",gender:"Female",status:"Under Care",location:"Sector 22, Chandigarh",rescueDate:dateOffset(-8),notes:"Needs a quiet environment.",emoji:"🐈"},
    {id:3,name:"Elaichi",species:"Dog",breed:"Pomerian",age:"3 years",gender:"Male",status:"Adopted",location:"Sector 35, Chandigarh",rescueDate:dateOffset(-70),notes:"Calm and playful.",emoji:"🐶"},
    {id:4,name:"Coco",species:"Cat",breed:"Indie",age:"1 year",gender:"Female",status:"Under Care",location:"Manimajra, Chandigarh",rescueDate:dateOffset(-5),notes:"Eating well.",emoji:"🐈‍⬛"},
    {id:5,name:"Chiku",species:"Dog",breed:"Gir",age:"6 months",gender:"Unknown",status:"Transferred",location:"Sector 9, Chandigarh",rescueDate:dateOffset(-22),notes:"Transferred to partner shelter.",emoji:"🐕"},
    {id:1,name:"Pipu",species:"Other",breed:"Rabbit",age:"1 years",gender:"Unknown",status:"Under Care",location:"Sector 17, Chandigarh",rescueDate:dateOffset(-12),notes:"Friendly, recovering well.",emoji:"🐇"}
  ],
  vaccines: [
    {id:1,animalId:1,name:"Rabies",given:dateOffset(-300),due:dateOffset(8)},
    {id:2,animalId:2,name:"FVRCP",given:dateOffset(-320),due:dateOffset(18)},
    {id:3,animalId:3,name:"DHPP",given:dateOffset(-40),due:dateOffset(150)},
    {id:4,animalId:4,name:"Rabies",given:dateOffset(-380),due:dateOffset(-6)},
    {id:5,animalId:6,name:"General check-up",given:dateOffset(-15),due:dateOffset(25)}
  ],
  medical: [
    {id:1,animalId:1,date:dateOffset(-4),condition:"Skin irritation",treatment:"Topical treatment",medication:"As prescribed",vet:"Dr. Mehta"},
    {id:2,animalId:2,date:dateOffset(-3),condition:"Routine health check",treatment:"General examination",medication:"None",vet:"Dr. Kaur"},
    {id:3,animalId:4,date:dateOffset(-2),condition:"Low appetite",treatment:"Observation and hydration",medication:"As prescribed",vet:"Dr. Mehta"}
  ],
  adoptions: [
    {id:1,animalId:3,adopter:"Kananreet Kaur",phone:"9000099999",date:dateOffset(-15)}
  ],
  staff:[
 ["full_name","Full Name","text",true],
 ["role","Role","text",true],
 ["phone","Phone","tel",false],
 ["email","Email","email",false],
 ["join_date","Join Date","date",false],
 ["status","Status","select",true,
    ["Active","On Leave"]
 ],
 ["responsibility","Responsibility","textarea",false]
]
};
// let data = loadData();
// let currentPage = "dashboard";
// let formMode = "";
// let editingId = null;
let data = {
    animals: [],
    medical: [],
    vaccines: [],
    adoptions: [],
    staff: []
};

let currentPage = "dashboard";
let formMode = "";
let editingId = null;
let toastTimer;
function toDateStr(v){
    if(!v) return "";
    if(/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const d = new Date(v);
    return isNaN(d) ? "" : d.toISOString().slice(0,10);
}

async function fetchAnimals() {

    try {

        const response = await fetch(
            `${API}/animals`
        );

        const animals = await response.json();

        data.animals = animals.map(a => ({
            ...a,
            id: a.animal_id,
            rescueDate: a.rescue_date
                ? new Date(a.rescue_date).toISOString().slice(0, 10)
                : ""
        }));

        renderAnimals();
        renderDashboard();
        renderReports();

    }
    catch(error) {

        console.log(error);
    }
}
async function fetchMedical(){

    const response = await fetch(
        `${API}/medical`
    );

    const medical = await response.json();

    data.medical = medical.map(m => ({
        ...m,
        id: m.medical_id,
        animalId: m.animal_id,
        date: toDateStr(m.visit_date),
        condition: m.condition_name,
        vet: m.veterinarian
    }));

    renderMedical();
}
async function fetchVaccinations(){

    const response = await fetch(
        `${API}/vaccinations`
    );

    const vaccines = await response.json();

    data.vaccines = vaccines.map(v => ({
        ...v,
        id: v.vaccine_id,
        animalId: v.animal_id,
        name: v.vaccine_name,
        given: toDateStr(v.date_given),
        due: toDateStr(v.next_due)
    }));

    renderVaccines();
}
async function fetchAdoptions(){

    const response = await fetch(
        `${API}/adoptions`
    );

    const adoptions = await response.json();

    data.adoptions = adoptions.map(r => ({
        ...r,
        id: r.adoption_id,
        animalId: r.animal_id,
        adopter: r.adopter_name,
        date: toDateStr(r.adoption_date)
    }));

    renderAdoptions();
}
async function fetchStaff(){

    const response =
    await fetch(
        `${API}/staff`
    );

    const staff =
    await response.json();

    data.staff = staff;

    renderStaff();
}
function renderStaff(){

    const grid =
    document.getElementById(
        "staffGrid"
    );

    if(!grid) return;

    grid.innerHTML = "";

    document.getElementById(
        "staffTotal"
    ).textContent =
    data.staff.length;

    document.getElementById(
        "staffActive"
    ).textContent =
    data.staff.filter(
        s => s.status === "Active"
    ).length;

    document.getElementById(
        "staffLeave"
    ).textContent =
    data.staff.filter(
        s => s.status === "On Leave"
    ).length;

    data.staff.forEach(staff => {

        grid.innerHTML += `

        <article class="staff-card">

            <div class="staff-card-top">

                <div class="staff-avatar">
                    ${staff.full_name
                        .split(" ")
                        .map(x=>x[0])
                        .join("")
                    }
                </div>

                <span class="
                    staff-status
                    ${
                        staff.status
                        === "Active"
                        ? "staff-active"
                        : "staff-leave"
                    }">

                    ${staff.status}

                </span>

            </div>

            <div class="staff-card-main">

                <h3>
                    ${staff.full_name}
                </h3>

                <p class="staff-role">
                    ${staff.role}
                </p>

                <p class="staff-responsibility">
                    ${staff.responsibility}
                </p>

            </div>

            <div class="staff-contact">

                <div>
                    📧 ${staff.email}
                </div>

                <div>
                    📞 ${staff.phone}
                </div>

            </div>

            <div class="staff-card-footer">

                <small>
                    Joined:
                    ${staff.join_date}
                </small>

            </div>

        </article>

        `;
    });
}
function loadData() {
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : structuredClone(initialData); }
  catch { return JSON.parse(JSON.stringify(initialData)); }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function escapeHtml(value="") {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
}
function getAnimal(id) { return data.animals.find(a => Number(a.id) === Number(id)); }
function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value + "T12:00:00");
  return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
}
function daysUntil(value) {
  const target = new Date(value + "T00:00:00");
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.round((target-now)/86400000);
}
function statusClass(status) {
  return {"Under Care":"tag-care","Adopted":"tag-adopted","Transferred":"tag-transferred","Released":"tag-released","Deceased":"tag-deceased"}[status] || "tag-care";
}
function statusTag(status) { return `<span class="status-tag ${statusClass(status)}">${escapeHtml(status)}</span>`; }
function animalIcon(animal) { return animal?.emoji || (animal?.species === "Cat" ? "🐈" : animal?.species === "Dog" ? "🐕" : "🐾"); }
function animalCell(animal) {
  if (!animal) return `<span class="muted">Animal record unavailable</span>`;
  return `<div class="table-animal"><div class="pet-thumb">${animalIcon(animal)}</div><div><strong>${escapeHtml(animal.name)}</strong><small>${escapeHtml(animal.species)} · ${escapeHtml(animal.breed || "Breed unknown")}</small></div></div>`;
}
function showToast(message) {
  const toast = document.getElementById("toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove("show"),2600);
}
function goToPage(page) {
  currentPage = page;
  document.querySelectorAll(".page").forEach(el=>el.classList.toggle("active",el.id===`page-${page}`));
  document.querySelectorAll(".nav-link").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
  const active = document.querySelector(`.nav-link[data-page="${page}"]`);
  document.getElementById("breadcrumb").textContent = active ? active.textContent.trim().replace(/\s+/g," ") : "Dashboard";
  document.getElementById("sidebar").classList.remove("open");
  renderAll();
}
function renderAll() {
  renderDashboard(); renderAnimals(); renderMedical(); renderVaccines(); renderAdoptions(); renderReports();
  document.getElementById("navAnimalCount").textContent=data.animals.length;
  const due=data.vaccines.filter(v=>daysUntil(v.due)<=30).length;
  document.getElementById("navVaccineDot").style.display=due?"block":"none";
}
function renderDashboard() {
  const care=data.animals.filter(a=>a.status==="Under Care").length;
  const adopted=data.animals.filter(a=>a.status==="Adopted").length;
  const due=data.vaccines.filter(v=>daysUntil(v.due)<=30).length;
  document.getElementById("statTotal").textContent=data.animals.length;
  document.getElementById("statCare").textContent=care;
  document.getElementById("statAdopted").textContent=adopted;
  document.getElementById("statDue").textContent=due;
  const recent=[...data.animals].sort((a,b)=>b.id-a.id).slice(0,4);
  document.getElementById("recentAnimals").innerHTML=recent.length?recent.map(a=>`<div class="recent-item"><div class="pet-thumb">${animalIcon(a)}</div><div class="recent-info"><strong>${escapeHtml(a.name)}</strong><small>${escapeHtml(a.species)} · ${escapeHtml(a.breed||"Breed unknown")}</small></div><div class="recent-right">${statusTag(a.status)}<small>${formatDate(a.rescueDate)}</small></div></div>`).join(""):`<div class="empty-inline">No animals registered yet.</div>`;
  const upcoming=[...data.vaccines].filter(v=>daysUntil(v.due)<=30).sort((a,b)=>daysUntil(a.due)-daysUntil(b.due)).slice(0,4);
  document.getElementById("attentionList").innerHTML=upcoming.length?upcoming.map(v=>{const a=getAnimal(v.animalId),days=daysUntil(v.due);return `<div class="attention-item"><div class="attention-date">${days<0?"OVERDUE":days===0?"DUE TODAY":`IN ${days} DAYS`}</div><div class="attention-info"><strong>${escapeHtml(a?.name||"Unknown animal")}</strong><small>${escapeHtml(v.name)} · ${formatDate(v.due)}</small></div><span class="attention-state">${days<0?"Overdue":"Upcoming"}</span></div>`}).join(""):`<div class="empty-inline">No vaccination follow-ups due soon. Great work!</div>`;
}
function renderAnimals() {
  const search=(document.getElementById("animalSearch")?.value||"").trim().toLowerCase();
  const status=document.getElementById("statusFilter")?.value||"All";
  const species=document.getElementById("speciesFilter")?.value||"All";
  const list=data.animals.filter(a=>(status==="All"||a.status===status)&&(species==="All"||a.species===species)&&[a.name,a.species,a.breed,a.location].join(" ").toLowerCase().includes(search)).sort((a,b)=>b.id-a.id);
  document.getElementById("animalGrid").innerHTML=list.map(a=>`<article class="animal-card"><div class="animal-cover ${a.species==="Cat"?"cat-bg":a.species==="Other"?"other-bg":""}"><span class="status-tag ${statusClass(a.status)}">${escapeHtml(a.status)}</span><span class="animal-emoji">${animalIcon(a)}</span></div><div class="animal-card-body"><div class="animal-card-title"><div><h3>${escapeHtml(a.name)}</h3><div class="animal-meta">${escapeHtml(a.species)} · ${escapeHtml(a.breed||"Breed unknown")}</div></div><button class="icon-btn" title="Edit animal" data-edit-animal="${a.id}">✎</button></div><div class="animal-details"><span class="detail-chip">◷ ${escapeHtml(a.age||"Age unknown")}</span><span class="detail-chip">${escapeHtml(a.gender||"Unknown gender")}</span></div><div class="animal-card-footer"><small>Rescued ${formatDate(a.rescueDate)}</small><div class="card-actions"><button class="icon-btn" title="View medical records" data-view-medical="${a.id}">✚</button><button class="icon-btn" title="Delete animal" data-delete-animal="${a.id}">⌫</button></div></div></div></article>`).join("");
  document.getElementById("animalEmpty").classList.toggle("hidden",list.length!==0);
}
function renderMedical() {
  const rows=[...data.medical].sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById("medicalCount").textContent=`${rows.length} RECORDS`;
  document.getElementById("medicalTable").innerHTML=rows.length?rows.map(m=>`<tr><td>${animalCell(getAnimal(m.animalId))}</td><td>${formatDate(m.date)}</td><td>${escapeHtml(m.condition)}</td><td>${escapeHtml(m.treatment)}</td><td>${escapeHtml(m.vet||"—")}</td></tr>`).join(""):`<tr><td colspan="5">No medical records yet. Add the first record using the button above.</td></tr>`;
}
function renderVaccines() {
  const rows=[...data.vaccines].sort((a,b)=>a.due.localeCompare(b.due));
  const overdue=rows.filter(v=>daysUntil(v.due)<0).length;
  const upcoming=rows.filter(v=>daysUntil(v.due)>=0&&daysUntil(v.due)<=30).length;
  document.getElementById("vaccineUpcoming").textContent=upcoming;
  document.getElementById("vaccineOverdue").textContent=overdue;
  document.getElementById("vaccineAll").textContent=rows.length;
  document.getElementById("vaccineTable").innerHTML=rows.length?rows.map(v=>{const days=daysUntil(v.due);const state=days<0?`<span class="status-tag tag-deceased">Overdue</span>`:days<=30?`<span class="status-tag tag-released">${days===0?"Due today":"Upcoming"}</span>`:`<span class="status-tag tag-care">Scheduled</span>`;return `<tr><td>${animalCell(getAnimal(v.animalId))}</td><td>${escapeHtml(v.name)}</td><td>${formatDate(v.given)}</td><td>${formatDate(v.due)}</td><td>${state}</td></tr>`}).join(""):`<tr><td colspan="5">No vaccination records yet.</td></tr>`;
}
function renderAdoptions() {
  const rows=[...data.adoptions].sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById("adoptionCount").textContent=`${rows.length} ADOPTIONS`;
  document.getElementById("adoptionTable").innerHTML=rows.length?rows.map(r=>`<tr><td>${animalCell(getAnimal(r.animalId))}</td><td>${escapeHtml(r.adopter)}</td><td>${escapeHtml(r.phone||"—")}</td><td>${formatDate(r.date)}</td><td><span class="status-tag tag-adopted">Completed</span></td></tr>`).join(""):`<tr><td colspan="5">No adoption records yet.</td></tr>`;
}
function renderReports() {
  const total=data.animals.length, care=data.animals.filter(a=>a.status==="Under Care").length, adopted=data.animals.filter(a=>a.status==="Adopted").length;
  document.getElementById("reportTotal").textContent=total;document.getElementById("reportCare").textContent=care;document.getElementById("reportAdopted").textContent=adopted;
  document.getElementById("barTotal").style.width=total?"100%":"0%";
  document.getElementById("barCare").style.width=total?`${care/total*100}%`:"0%";
  document.getElementById("barAdopted").style.width=total?`${adopted/total*100}%`:"0%";
  const statuses=["Under Care","Adopted","Transferred","Released","Deceased"];
  document.getElementById("statusBreakdown").innerHTML=statuses.map(s=>{const n=data.animals.filter(a=>a.status===s).length;return `<div class="breakdown-row"><span>${s}</span><div class="breakdown-track"><i style="width:${total?n/total*100:0}%"></i></div><strong>${n}</strong></div>`}).join("");
}
const fields = {
  animal:[
    ["name","Animal name","text",true],["species","Species","select",true,["Dog","Cat","Other"]],["breed","Breed","text",false],["age","Age","text",false],["gender","Gender","select",false,["Male","Female","Unknown"]],["status","Status","select",true,["Under Care","Adopted","Transferred","Released","Deceased"]],["rescueDate","Rescue date","date",false],["location","Rescue location","text",false],["notes","Notes","textarea",false]
  ],
  vaccine:[["animalId","Animal","animal",true],["name","Vaccine / check-up name","text",true],["given","Date given","date",true],["due","Next due date","date",true]],
  medical:[["animalId","Animal","animal",true],["date","Visit date","date",true],["condition","Condition / reason","text",true],["treatment","Treatment","text",true],["medication","Medication","text",false],["vet","Veterinarian","text",false]],
  adoption:[["animalId","Animal","adoptable-animal",true],["adopter","Adopter full name","text",true],["phone","Contact number","tel",false],["date","Adoption date","date",true]]
  ,staff:[
 ["full_name","Full Name","text",true],
 ["role","Role","text",true],
 ["phone","Phone","tel",false],
 ["email","Email","email",false],
 ["join_date","Join Date","date",false],
 ["status","Status","select",true,
    ["Active","On Leave"]
 ],
 ["responsibility","Responsibility","textarea",false]
]
};
function openForm(mode,id=null) {
  formMode=mode;editingId=id;
const labels={
    animal:id?"Edit animal":"Register an animal",
    vaccine:"Add vaccination",
    medical:"Add medical record",
    adoption:"Record an adoption",
    staff:"Add Staff"
};  document.getElementById("modalTitle").textContent=labels[mode];
  document.getElementById("saveButton").textContent=id?"Save changes":"Save record";
  const old=id?(mode==="animal"?getAnimal(id):null):null;
  document.getElementById("formFields").innerHTML=fields[mode].map(([key,label,type,required,options])=>{
    const value=old?.[key]??(key==="rescueDate"||key==="date"||key==="given"?dateOffset(0):"");
    let control="";
    if(type==="select") control=`<select name="${key}" ${required?"required":""}>${options.map(o=>`<option ${value===o?"selected":""}>${o}</option>`).join("")}</select>`;
    else if(type==="animal"||type==="adoptable-animal"){const candidates=data.animals.filter(a=>type!=="adoptable-animal"||a.status!=="Adopted");control=`<select name="${key}" required><option value="">Choose an animal</option>${candidates.map(a=>`<option value="${a.id}" ${Number(value)===a.id?"selected":""}>${escapeHtml(a.name)} (${escapeHtml(a.species)})</option>`).join("")}</select>`;}
    else if(type==="textarea")control=`<textarea name="${key}" placeholder="Add helpful details...">${escapeHtml(value)}</textarea>`;
    else control=`<input name="${key}" type="${type}" value="${escapeHtml(value)}" ${required?"required":""} ${key==="age"?'placeholder="e.g. 2 years"':""}>`;
    return `<div class="field ${type==="textarea"?"full":""}"><label for="field-${key}">${label}${required?" *":""}</label>${control.replace(`name="${key}"`,`name="${key}" id="field-${key}"`)}</div>`;
  }).join("");
  document.getElementById("modalBackdrop").classList.remove("hidden");
  setTimeout(()=>document.querySelector("#formFields input, #formFields select")?.focus(),50);
}
function closeForm(){document.getElementById("modalBackdrop").classList.add("hidden");document.getElementById("recordForm").reset();editingId=null;}
function nextId(items){return items.reduce((max,item)=>Math.max(max,Number(item.id)||0),0)+1;}
document.addEventListener("click",e=>{
  const nav=e.target.closest("[data-page]");if(nav){goToPage(nav.dataset.page);return;}
  const link=e.target.closest("[data-page-link]");if(link){goToPage(link.dataset.pageLink);return;}
  const action=e.target.closest("[data-action]");
  if(action){
    const act=action.dataset.action;
    if(act==="add-animal")openForm("animal");
    if(act==="add-vaccine")openForm("vaccine");
    if(act==="add-medical")openForm("medical");
    if(act==="add-adoption")openForm("adoption");
    if(act==="add-staff")openForm("staff");
    return;
  }
  const edit=e.target.closest("[data-edit-animal]");
  if(edit){openForm("animal",Number(edit.dataset.editAnimal));return;}
  const medical=e.target.closest("[data-view-medical]");
  if(medical){goToPage("medical");return;}
  const del=e.target.closest("[data-delete-animal]");
  if(del){
    const id=Number(del.dataset.deleteAnimal), a=getAnimal(id);
    if(!a)return;
    if(confirm(`Delete ${a.name} and all its linked records?`)){
      fetch(`${API}/animals${id}`,{method:"DELETE"})
        .then(res=>{
          if(!res.ok)throw new Error("Delete failed");
          return Promise.all([fetchAnimals(),fetchMedical(),fetchVaccinations(),fetchAdoptions()]);
        })
        .then(()=>showToast("Animal record deleted."))
        .catch(err=>{console.log(err);showToast("Could not delete animal.");});
    }
    return;
  }
});
document.getElementById("recordForm").addEventListener("submit",async e=>{
  e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget).entries());
  // if(formMode==="animal"){
  //   if(editingId){const index=data.animals.findIndex(a=>a.id===editingId);data.animals[index]={...data.animals[index],...values};}
  //   else{data.animals.push({id:nextId(data.animals),...values,emoji:values.species==="Cat"?"🐈":values.species==="Dog"?"🐕":"🐇"});}
  //   saveData();closeForm();renderAll();showToast(editingId?"Animal details updated.":"Animal registered successfully.");
  // }
if(formMode==="animal"){

    const isEdit = Boolean(editingId);
    const url = isEdit
        ? `${API}/animals${editingId}`
        : `${API}/animals`;

    await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: values.name,
            species: values.species,
            breed: values.breed,
            age: values.age,
            gender: values.gender,
            status: values.status,
            rescueDate: values.rescueDate,
            location: values.location,
            notes: values.notes
        })
    });

    closeForm();
    fetchAnimals();

    showToast(isEdit
        ? "Animal details updated."
        : "Animal registered successfully.");
}// else if(formMode==="vaccine"){
//     data.vaccines.push({id:nextId(data.vaccines),...values,animalId:Number(values.animalId)});saveData();closeForm();renderAll();showToast("Vaccination record added.");
//  
else if(formMode==="vaccine"){

    await fetch(
        `${API}/vaccinations`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                animalId: values.animalId,
                name: values.name,
                given: values.given,
                due: values.due
            })
        }
    );

    closeForm();

    await fetchVaccinations();
    renderAll();

    showToast(
        "Vaccination added"
    );
}
// } else if(formMode==="medical"){
  //   data.medical.push({id:nextId(data.medical),...values,animalId:Number(values.animalId)});saveData();closeForm();renderAll();showToast("Medical record added.");
  // }
  else if(formMode==="medical"){

    await fetch(
        `${API}/medical`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                animalId: values.animalId,
                date: values.date,
                condition: values.condition,
                treatment: values.treatment,
                medication: values.medication,
                vet: values.vet
            })
        }
    );

    closeForm();

    await fetchMedical();
    renderAll();

    showToast(
        "Medical record added"
    );}
// } else if(formMode==="adoption"){
//     const id=Number(values.animalId),animal=getAnimal(id);
//     data.adoptions.push({id:nextId(data.adoptions),...values,animalId:id});if(animal)animal.status="Adopted";
//     saveData();closeForm();renderAll();showToast("Adoption recorded. Animal status updated.");
//   }
// else if(action === "add-staff"){

//     formMode = "staff";

//     modalTitle.textContent =
//     "Add Staff";

//     formFields.innerHTML = `

//     <div class="field">

//         <label>Name</label>

//         <input
//             name="full_name"
//             required
//         >

//     </div>

//     <div class="field">

//         <label>Role</label>

//         <input
//             name="role"
//             required
//         >

//     </div>

//     <div class="field">

//         <label>Phone</label>

//         <input
//             name="phone"
//         >

//     </div>

//     <div class="field">

//         <label>Email</label>

//         <input
//             name="email"
//         >

//     </div>

//     <div class="field">

//         <label>Join Date</label>

//         <input
//             type="date"
//             name="join_date"
//         >

//     </div>

//     <div class="field">

//         <label>Status</label>

//         <select name="status">
//             <option>
//                 Active
//             </option>

//             <option>
//                 On Leave
//             </option>
//         </select>

//     </div>

//     <div class="field full">

//         <label>Responsibility</label>

//         <textarea
//             name="responsibility"
//         ></textarea>

//     </div>

//     `;
// }
else if(formMode==="adoption"){

    await fetch(
        `${API}/adoptions`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                animalId: values.animalId,
                adopter: values.adopter,
                phone: values.phone,
                date: values.date
            })
        }
    );

    closeForm();

    await fetchAnimals();
    await fetchAdoptions();
    renderAll();

    showToast(
        "Adoption recorded"
    );
}else if(formMode==="staff"){

    await fetch(
        `${API}/staff`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                full_name:
                values.full_name,

                role:
                values.role,

                phone:
                values.phone,

                email:
                values.email,

                join_date:
                values.join_date,

                status:
                values.status,

                responsibility:
                values.responsibility
            })
        }
    );

    closeForm();

    await fetchStaff();

    showToast(
        "Staff Added Successfully"
    );
}
});
document.getElementById("closeModal").addEventListener("click",closeForm);
document.getElementById("cancelModal").addEventListener("click",closeForm);
document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeForm();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeForm();});
document.getElementById("animalSearch").addEventListener("input",renderAnimals);
document.getElementById("statusFilter").addEventListener("change",renderAnimals);
document.getElementById("speciesFilter").addEventListener("change",renderAnimals);
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("exportCsv").addEventListener("click",()=>{
  const headers=["ID","Name","Species","Breed","Age","Gender","Status","Rescue Date","Location","Notes"];
  const rows=data.animals.map(a=>[a.id,a.name,a.species,a.breed,a.age,a.gender,a.status,a.rescueDate,a.location,a.notes]);
  const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="Karma-animals.csv";a.click();URL.revokeObjectURL(url);showToast("CSV export downloaded.");
});
async function initializeApp(){

    await fetchAnimals();

    await fetchMedical();

    await fetchVaccinations();

    await fetchAdoptions();
    await fetchStaff();

    renderAll();
}

initializeApp();