// ===============================
// PROJECT & EXPERIENCE HANDLING
// ===============================

function addProject() {
  const container = document.getElementById("projectsContainer");
  const firstProject = container.querySelector(".project-entry");
  const clone = firstProject.cloneNode(true);

  clone.querySelectorAll("input, textarea").forEach(input => input.value = "");

  const removeBtn = clone.querySelector(".remove-btn");
  if (removeBtn) {
    removeBtn.onclick = function () {
      removeProject(removeBtn);
    };
  }

  container.appendChild(clone);
}

function removeProject(button) {
  const projectToRemove = button.closest(".project-entry");
  if (projectToRemove) {
    projectToRemove.remove();
  }
}

function addExperience() {
  const container = document.getElementById("experienceContainer");
  const firstExperience = container.querySelector(".experience-entry");
  const clone = firstExperience.cloneNode(true);

  clone.querySelectorAll("input, textarea").forEach(input => input.value = "");

  const removeBtn = clone.querySelector(".remove-btn");
  if (removeBtn) {
    removeBtn.onclick = function () {
      removeExperience(removeBtn);
    };
  }

  container.appendChild(clone);
}

function removeExperience(button) {
  const entryToRemove = button.closest(".experience-entry");
  if (entryToRemove) {
    entryToRemove.remove();
  }
}

// ===============================
// VALIDATION
// ===============================

function validateRequiredFields() {
  const requiredFields = [
    "name", "email", "phone",
    "college", "degree", "duration1", "cgpa",
    "languages", "tools", "courseWork"
  ];

  for (const id of requiredFields) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      alert(`Please fill the required field: ${el.placeholder}`);
      el.focus();
      return false;
    }
  }
  return true;
}

// ===============================
// BUILD SECTIONS
// ===============================

function buildProjectsHTML() {
  const projectElements = document.querySelectorAll(".project-entry");
  let projectHTML = "";

  projectElements.forEach(entry => {
    const title = entry.querySelector(".projectTitle").value.trim();
    const descText = entry.querySelector(".projectPoints").value.trim();
    const stackText = entry.querySelector(".techStack").value.trim();

    if (title || descText || stackText) {
      const git = entry.querySelector(".projectGit").value.trim();
      const live = entry.querySelector(".projectLink").value.trim();
      const date = entry.querySelector(".projectDate").value.trim();
      const desc = listify(descText);

      projectHTML += `
        <p><strong>${title || "(No Title)"}</strong> |
        ${formatLink(git, "GitHub")} |
        ${formatLink(live, "Live")} |
        ${date}</p>
        <ul>${desc}</ul>
        <p><em>Tech Stack:</em> ${stackText}</p>
      `;
    }
  });

  return projectHTML;
}

function buildExperienceHTML() {
  const experienceElements = document.querySelectorAll(".experience-entry");
  let experienceHTML = "";

  experienceElements.forEach(entry => {
    const role = entry.querySelector(".jobRole").value.trim();
    const org = entry.querySelector(".jobOrg").value.trim();
    const duration = entry.querySelector(".jobDuration").value.trim();
    const descText = entry.querySelector(".jobDesc").value.trim();
    const desc = listify(descText);

    if (role || org || desc) {
      experienceHTML += `
        <p><strong>${role || "(No Role)"}</strong> | ${org || "(No Organization)"} | ${duration}</p>
        <ul>${desc}</ul>
      `;
    }
  });

  return experienceHTML;
}

// ===============================
// TEMPLATE BUILDER
// ===============================

function buildResumeTemplate(projectHTML, experienceHTML) {
  const positionsHTML = listify(get("positions"));
  const achievementsHTML = listify(get("achievements"));
  const certificationsHTML = listify(get("certifications"));

  return `
    <div style="font-family: 'Georgia', serif; max-width: 800px; margin: auto; color: black;">
      <h1 style="text-align: center;">${get("name")}</h1>
      <p style="text-align: center;">
        ${get("phone")} | ${get("email")} |
        ${getLink("linkedin", "LinkedIn")} |
        ${getLink("github", "GitHub")} |
        ${getLink("leetcode", "LeetCode")}
      </p>

      <hr />

      <h2>Education</h2>
      <p><strong>${get("college")}</strong><br />
      <em>${get("degree")}</em><br />
      ${get("duration1")} | CGPA: ${get("cgpa")}</p>

      ${get("school12") ? `<p><strong>${get("school12")}</strong><br />${get("duration12")} | Percentage: ${get("percent12")}%</p>` : ""}
      ${get("school10") ? `<p><strong>${get("school10")}</strong><br />${get("duration10")} | Percentage: ${get("percent10")}%</p>` : ""}

      ${projectHTML ? `<hr /><h2>Projects</h2>${projectHTML}` : ""}
      ${experienceHTML ? `<hr /><h2>Experience</h2>${experienceHTML}` : ""}

      <hr />
      <h2>Technical Skills</h2>
      <p><strong>Languages:</strong> ${get("languages")}</p>
      <p><strong>Tools:</strong> ${get("tools")}</p>
      <p><strong>Course Work:</strong> ${get("courseWork")}</p>

      ${positionsHTML ? `<hr /><h2>Positions of Responsibility</h2><ul>${positionsHTML}</ul>` : ""}
      ${achievementsHTML ? `<hr /><h2>Achievements</h2><ul>${achievementsHTML}</ul>` : ""}
      ${certificationsHTML ? `<hr /><h2>Certifications</h2><ul>${certificationsHTML}</ul>` : ""}
    </div>
  `;
}

// ===============================
// RENDER
// ===============================

function renderResume(template) {
  const target = document.getElementById("resumeTemplate");
  target.innerHTML = template;
  target.style.display = "block";

  document.getElementById("downloadBtn").style.display = "inline-block";
  target.scrollIntoView({ behavior: "smooth" });
}

// ===============================
// MAIN PREVIEW FUNCTION
// ===============================

function generatePreview() {
  if (!validateRequiredFields()) return;

  const projectHTML = buildProjectsHTML();
  const experienceHTML = buildExperienceHTML();
  const template = buildResumeTemplate(projectHTML, experienceHTML);

  renderResume(template);
}

// ===============================
// DOWNLOAD
// ===============================

function downloadPDF() {
  const target = document.getElementById("resumeTemplate");

  if (target.innerHTML.trim() === "") {
    alert("Please generate the preview first.");
    return;
  }

  target.style.display = "block";
  window.scrollTo(0, 0);

  target.classList.add("bw-print", "pdf-compact", "ats-optimized");

  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: "MyResume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      })
      .from(target)
      .save()
      .then(() => {
        target.classList.remove("bw-print", "pdf-compact");
      });
  }, 500);
}

function clearSavedData() {
  // Remove saved data
  localStorage.removeItem("resumeData");

  // Reset form
  document.getElementById("resumeForm").reset();

  // Hide preview
  const target = document.getElementById("resumeTemplate");
  target.innerHTML = "";
  target.style.display = "none";

  // Hide download button
  document.getElementById("downloadBtn").style.display = "none";
}

// ===============================
// UTILITIES
// ===============================

function get(id) {
  return document.getElementById(id).value || "";
}

function getLink(id, label = "") {
  const url = document.getElementById(id).value.trim();
  if (!url) return "";
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function formatLink(url, label = "") {
  if (!url) return "";
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function listify(text) {
  if (!text) return "";
  return text
    .split("*")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => `<li>${item}</li>`)
    .join("");
}

// ===============================
// RESUME OPTIMIZATION ENGINE
// ===============================

function analyzeBulletStrength() {
  const bullet = document.getElementById("bulletInput").value.trim().toLowerCase();

  if (!bullet) {
    alert("Enter a bullet point first.");
    return;
  }

  const weakVerbs = [
    "worked",
    "did",
    "made",
    "helped",
    "handled",
    "created",
    "responsible"
  ];

  const techKeywords = [
    "java", "spring", "react", "node", "express",
    "sql", "mysql", "mongodb", "api", "rest",
    "docker", "aws", "azure", "python",
    "javascript", "html", "css"
  ];

  let suggestions = [];

  // 1️⃣ Weak Verb Detection
  weakVerbs.forEach(verb => {
    if (bullet.includes(verb)) {
      suggestions.push(`Replace weak verb "${verb}" with stronger action verb like implemented, engineered, optimized.`);
    }
  });

  // 2️⃣ Metrics Detection
  const hasNumber = /\d/.test(bullet);
  if (!hasNumber) {
    suggestions.push("Add measurable impact (%, numbers, performance improvement, users, time reduction).");
  }

  // 3️⃣ Tech Stack Detection
  const hasTech = techKeywords.some(keyword => bullet.includes(keyword));
  if (!hasTech) {
    suggestions.push("Mention specific technologies used (e.g., Java, Spring, React, SQL, AWS).");
  }

  // Final Evaluation
  if (suggestions.length === 0) {
    suggestions.push("Strong bullet point. Well written!");
  }

  document.getElementById("aiResult").innerHTML = `
    <strong>Bullet Feedback:</strong><br><br>
    ${suggestions.map(s => `• ${s}`).join("<br>")}
  `;
}

// ===============================
// LOCAL STORAGE
// ===============================

// STEP 1 — Add Save Function
function saveFormData() {
  const form = document.getElementById("resumeForm");
  const formData = {};

  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach(input => {
    formData[input.id || input.className] = input.value;
  });

  localStorage.setItem("resumeData", JSON.stringify(formData));
}

// STEP 2 — Add Load Function
function loadFormData() {
  const savedData = localStorage.getItem("resumeData");

  if (!savedData) return;

  const formData = JSON.parse(savedData);
  const form = document.getElementById("resumeForm");
  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach(input => {
    const key = input.id || input.className;
    if (formData[key] !== undefined) {
      input.value = formData[key];
    }
  });
}

// STEP 3 — Auto-Save On Input
document.getElementById("resumeForm").addEventListener("input", saveFormData);

// STEP 4 — Load On Page Start
window.addEventListener("DOMContentLoaded", loadFormData);

// ===============================
// JOB DESCRIPTION ANALYZER
// ===============================

function analyzeResume() {
  const jdText = document.getElementById("jobDescription").value.toLowerCase();

  if (!jdText.trim()) {
    alert("Please paste a Job Description first.");
    return;
  }

  const savedData = JSON.parse(localStorage.getItem("resumeData"));

  if (!savedData) {
    alert("No resume data found. Please build your resume first.");
    return;
  }

  // ---- Build Resume Text From Saved Data ----
  const resumeText = (
    (savedData.languages || "") + " " +
    (savedData.tools || "") + " " +
    (savedData.courseWork || "") + " " +
    (savedData.projectPoints || "") + " " +
    (savedData.jobDesc || "")
  ).toLowerCase();

  // ---- Stop Words to Ignore ----
  const stopWords = [
    "with", "from", "have", "will", "this", "that",
    "your", "their", "about", "into", "using",
    "good", "strong", "team", "role", "year",
    "work", "able", "must", "should"
  ];

  // ---- Extract Clean Keywords from JD ----
  const jdWords = jdText
    .split(/\W+/)
    .filter(word =>
      word.length > 3 &&
      !stopWords.includes(word)
    );

  const uniqueKeywords = [...new Set(jdWords)];

  if (uniqueKeywords.length === 0) {
    document.getElementById("analysisResult").innerHTML =
      "Not enough meaningful keywords found in Job Description.";
    return;
  }

  let matched = [];
  let missing = [];

  uniqueKeywords.forEach(word => {
    if (resumeText.includes(word)) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  });

  const matchPercent = Math.round(
    (matched.length / uniqueKeywords.length) * 100
  );

  let color = "orange";
  if (matchPercent >= 70) color = "green";
  else if (matchPercent <= 40) color = "red";

  document.getElementById("analysisResult").innerHTML = `
    <div style="color:${color}; font-size:18px;">
      Match Percentage: ${matchPercent}%
    </div>
    <br>
    <strong>Matched Keywords (${matched.length}):</strong><br>
    ${matched.slice(0, 15).join(", ") || "None"}
    <br><br>
    <strong>Missing Keywords (${missing.length}):</strong><br>
    ${missing.slice(0, 15).join(", ") || "None"}
  `;
}

// ===============================
// AUTO SAVE JOB DESCRIPTION
// ===============================

function autoSaveJD() {
  const jd = document.getElementById("jobDescription").value;
  localStorage.setItem("savedJobDescription", jd);
}

function loadSavedJD() {
  const savedJD = localStorage.getItem("savedJobDescription");
  if (savedJD) {
    document.getElementById("jobDescription").value = savedJD;
  }
}

function clearJD() {
  localStorage.removeItem("savedJobDescription");
  document.getElementById("jobDescription").value = "";
  document.getElementById("analysisResult").innerHTML = "";
}