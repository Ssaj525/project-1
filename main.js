// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDiQ_0hjckFkZ_ax68N7qf3r-P8L5wSW50",
    authDomain: "attendance-management-943e0.firebaseapp.com",
    projectId: "attendance-management-943e0",
    storageBucket: "attendance-management-943e0.appspot.com",
    messagingSenderId: "778976624645",
    appId: "1:778976624645:web:7849da12d53e1781d29c6c",
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  let currentUser = null;
  let currentUserYear = null;
  let currentPage = 1;
  let studentsPerPage = 10;
  let currentGroup = "";
  let currentSubject = "Operating system";
  let currentSemester = "";
  let logo = localStorage.getItem("userAvatar") || "./imgs/avatar (1).png";
  
  // Check authentication state
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      showMainPage();
    } else {
      showLogin();
    }
  });
  
  function showLogin() {
    const content = document.getElementById("content");
    content.innerHTML = `
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <form id="loginForm">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 py-2 px-2 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <button type="submit" class="w-full mt-3 bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">Login</button>
      </form>
      <p class="mt-4 text-center">
        Don't have an account? <a href="#" onclick="showSignup()" class="text-blue-700">Sign up</a>
      </p>
    `;
    document.getElementById("bottom-nav").style.display = "none";
  
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          currentUser = userCredential.user;
          showMainPage();
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });
  }
  
  function showMainPage() {
    if (!currentUser) {
      showLogin();
      return;
    }
  
    db.collection("users").doc(currentUser.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          currentRole = userData.role;
          if (currentRole === "cr") {
            showDashboard();
          } else if (currentRole === "admin") {
            showAdmin();
          } else {
            console.log("User role is not recognized.");
          }
        } else {
          console.log("No such user document exists.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }
  
  function showSignup() {
    const content = document.getElementById("content");
    content.innerHTML = `
          <h1 class="text-2xl font-bold mb-4">Signup</h1>
          <form id="signupForm">
              <div class="mb-4">
                  <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              </div>
              <div class="mb-4">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              </div>
              <div class="mb-4">
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" id="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 py-2 px-2 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              </div>
              <div class="mb-4">
                  <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                  <select id="role" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option value="">Select Role</option>
                      <option value="cr">CR/VCR</option>
                      <option value="admin">Admin</option>
                  </select>
              </div>
              <div class="mb-4">
                  <label for="group" class="block text-sm font-medium text-gray-700">Group</label>
                  <select id="group" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option value="">Select Group</option>
                      <option value="BCA">BCA</option>
                      <option value="BSC">BSC</option>
                      <option value="BBA">BBA</option>
                  </select>
              </div>
              <div class="mb-4">
                  <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
                  <select id="year" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option value="">Select Year</option>
                  </select>
              </div>
              <div class="mb-4">
                  <label for="semester" class="block text-sm font-medium text-gray-700">Semester</label>
                  <select id="semester" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option value="">Select Semester</option>
                  </select>
              </div>
              <div id="secretCodeDiv" class="mb-4 hidden">
                  <label for="secretCode" class="block text-sm font-medium text-gray-700">Admin Secret Code</label>
                  <input type="password" id="secretCode" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 py-2 px-2 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              </div>
              <button type="submit" class="w-full mt-3 bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">Sign Up</button>
          </form>
          <p id="errorMessage" class="text-red-600 mt-2 hidden">Invalid Secret Code</p>
          <p class="mt-4 text-center">
              Already have an account? <a href="#" onclick="showLogin()" class="text-blue-700">Login</a>
          </p>
      `;
  
    const groupSelect = document.getElementById("group");
    const yearSelect = document.getElementById("year");
    const semesterSelect = document.getElementById("semester");
    const roleSelect = document.getElementById("role");
    const secretCodeDiv = document.getElementById("secretCodeDiv");
  
    groupSelect.addEventListener("change", () => {
      // Call the functions to populate Year and Semester when the group changes
      populateYearSelect();  // Populates the Year dropdown
      populateSemesterSelect();  // Populates the Semester dropdown
    });
  
    roleSelect.addEventListener("change", function () {
      if (this.value === "admin") {
        secretCodeDiv.classList.remove("hidden");
      } else {
        secretCodeDiv.classList.add("hidden");
      }
    });
  
    document.getElementById("signupForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;
      const group = document.getElementById("group").value;
      const year = document.getElementById("year").value;
      const semester = document.getElementById("semester").value;
      const secretCode = document.getElementById("secretCode").value;
  
      if (role === "admin" && secretCode !== "17062005") {
        document.getElementById("errorMessage").classList.remove("hidden");
        return;
      }
  
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          currentUser = userCredential.user;
          return db.collection("users").doc(currentUser.uid).set({
            name: name,
            email: email,
            role: role,
            group: group,
            year: year,
            semester: semester,
          });
        })
        .then(() => {
          if (role === "admin") {
            showAdmin();
          } else {
            showDashboard();
          }
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });
  }
  function populateYearSelect() {
    const yearSelect = document.getElementById("year");
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    
    // Loop through 1st to 4th year
    for (let year = 1; year <= 3; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = `${year}${getOrdinalSuffix(year)} Year`;
      yearSelect.appendChild(option);
    }
  }
  
  function populateSemesterSelect() {
    const semesterSelect = document.getElementById("semester");
    semesterSelect.innerHTML = '<option value="">Select Semester</option>';
    
    // Loop through 1st to 8th semester
    for (let semester = 1; semester <= 6; semester++) {
      const option = document.createElement("option");
      option.value = semester;
      option.textContent = `${semester}${getOrdinalSuffix(semester)} Semester`;
      semesterSelect.appendChild(option);
    }
  }
  
  function getOrdinalSuffix(number) {
    const j = number % 10,
          k = number % 100;
    if (j == 1 && k != 11) {
      return "st";
    }
    if (j == 2 && k != 12) {
      return "nd";
    }
    if (j == 3 && k != 13) {
      return "rd";
    }
    return "th";
  }
  function showDashboard() {
    if (!currentUser) {
      showLogin();
      return;
    }
  
    db.collection("users").doc(currentUser.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          currentGroup = userData.group;
          currentSemester = userData.semester;
          currentUserYear = userData.year;
          const content = document.getElementById("content");
          content.innerHTML = `
            <div class="head flex items-center justify-between px-1">
              <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
              <div id="avatarContainer" class="changeAvatarBtn w-12 h-12 overflow-hidden rounded-full object-cover mb-4 flex items-center justify-center">
                <img id="mainAvatar" src="${logo}" class="w-full h-full object-cover" alt="Profile">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg shadow border-solid border-gray-300 border-2">
                <h2 class="text-lg font-semibold mb-2">Group Information</h2>
                <p><strong>Group:</strong> <span id="groupInfo">${userData.group} ${userData.year}${getOrdinalSuffix(userData.year)} year</span></p>
                <div class="flex items-center gap-5">
                  <p><strong>Date:</strong> <span id="currentDate">${new Date().toLocaleDateString()}</span></p>
                  <p><strong>Day:</strong> <span id="dayInfo">${new Date().toLocaleString("en-us", { weekday: "long" })}</span></p>
                </div>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border-solid border-orange-400 border-2">
                <h2 class="text-xl font-semibold mb-4">Attendance Overview</h2>
                <p id="presentCount" class="text-4xl font-bold text-blue-600">-/-</p>
                <p class="text-gray-600">Students present today</p>
                <p id="absentCount" class="text-4xl font-bold mt-2 text-red-500">-/-</p>
                <p class="text-gray-600">Students absent today</p>
              </div>
            </div>
          `;
          fetchAttendanceData(userData.group, currentSubject);
          document.getElementById("bottom-nav").style.display = "flex";
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
  
  function fetchAttendanceData(group, subject) {
    db.collection("attendance")
      .where("group", "==", group)
      .where("subject", "==", subject)
      .orderBy("date", "desc")
      .limit(1)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const attendanceData = querySnapshot.docs[0].data();
          const attendanceRecords = attendanceData.attendance;
  
          let totalEntries = 0;
          let totalPresent = 0;
          let totalAbsent = 0;
  
          for (const key in attendanceRecords) {
            if (attendanceRecords.hasOwnProperty(key)) {
              const record = attendanceRecords[key];
              totalEntries += 1;
              if (record.present === 1) {
                totalPresent += 1;
              }
              if (record.absent === 1) {
                totalAbsent += 1;
              }
            }
          }
  
          const presentCountElement = document.getElementById("presentCount");
          const absentCountElement = document.getElementById("absentCount");
  
          presentCountElement.textContent = `${totalPresent}/${totalEntries}`;
          absentCountElement.textContent = `${totalAbsent}/${totalEntries}`;
        } else {
          console.log("No attendance records found for the specified group and subject.");
          document.getElementById("presentCount").textContent = "-/0";
          document.getElementById("absentCount").textContent = "-/0";
        }
      })
      .catch((error) => {
        console.log("Error fetching attendance data:", error);
      });
  }
  
  function showMarkAttendance() {
    if (!currentUser) {
      showLogin();
      return;
    }
  
    const content = document.getElementById("content");
    content.innerHTML = `
    <h1 class="text-3xl font-bold mb-6">Mark Attendance</h1>
    <form id="attendanceForm">
        <div class="mb-6">
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <select id="subjectSelect" class="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <!-- Dynamic subjects will be populated here based on user's group and semester -->
            </select>
        </div>

        <div class="mb-6">
            <h2 class="text-xl font-semibold">Students</h2>
            <div id="attendanceTable" class="overflow-x-auto mb-6">
                <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead class="ltr:text-left rtl:text-right">
                        <tr>
                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Roll Number</th>
                            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Attendance</th>
                        </tr>
                    </thead>
                    <tbody id="studentTable" class="divide-y divide-gray-200">
                        <!-- Dynamic list of students will be rendered here -->
                    </tbody>
                </table>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <button id="prevButton" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                    Previous
                </button>
                <span id="pageInfo"></span>
                <button id="nextButton" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>

        <button id="saveAttendance" class="mt-6 bg-black text-white font-bold py-2 px-4 rounded">Submit Attendance</button>
        <div class="p-4"></div>
    </form>

    <button id="addStudentBtn" class="fixed bottom-20 right-4 bg-blue-500 text-white rounded-full p-2 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
    </button>

    <div id="addStudentModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-white p-8 w-80 rounded-lg shadow-lg">
            <h3 class="text-xl font-semibold mb-4">Add New Student</h3>
            <form id="addStudentForm">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mb-4">
                    <label for="roll" class="block text-sm font-medium text-gray-700">Roll No</label>
                    <input type="text" id="roll" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mb-4">
                    <label for="semester" class="block text-sm font-medium text-gray-700">Semester</label>
                    <select id="semester" required class="mt-1 py-2 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option value="">Select Semester</option>
                        <option value="1">1st Sem</option>
                        <option value="2">2nd Sem</option>
                        <option value="3">3rd Sem</option>
                        <option value="4">4th Sem</option>
                        <option value="5">5th Sem</option>
                        <option value="6">6th Sem</option>
                    </select>
                </div>
                <button type="submit" class="w-full mt-2 bg-black text-white font-bold py-2 px-4 rounded">
                    Add Student
                </button>
            </form>
            <button id="closeModal" class="mt-4 text-sm text-gray-600">Cancel</button>
        </div>
    </div>
`;
  
    const subjectSelect = document.getElementById("subjectSelect");
    const studentTable = document.getElementById("studentTable");
    const pageInfo = document.getElementById("pageInfo");
    const addStudentModal = document.getElementById("addStudentModal");
    const addStudentBtn = document.getElementById("addStudentBtn");
    const closeModalBtn = document.getElementById("closeModal");
    const addStudentForm = document.getElementById("addStudentForm");
    const saveAttendanceBtn = document.getElementById("saveAttendance");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
  
    // Populate subject select based on the CR's semester
    db.collection("subjects")
      .where("group", "==", currentGroup)
      .where("semester", "==", currentSemester)
      .get()
      .then((querySnapshot) => {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        querySnapshot.forEach((doc) => {
          const subjectData = doc.data();
          const option = document.createElement("option");
          option.value = subjectData.name;
          option.textContent = subjectData.name;
          subjectSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  
    // Fetch and display students
    fetchStudents(currentGroup, currentSemester);
  
    // Event listeners
     // Event listeners
  addStudentBtn.addEventListener("click", () =>
    addStudentModal.classList.remove("hidden")
  );
  closeModalBtn.addEventListener("click", () =>
    addStudentModal.classList.add("hidden")
  );
  addStudentForm.addEventListener("submit", addStudent);
    saveAttendanceBtn.addEventListener("click", saveAttendance);
    prevButton.addEventListener("click", () => changePage(-1));
    nextButton.addEventListener("click", () => changePage(1));
  }
  async function addStudent(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const rollNumber = document.getElementById("roll").value;
    const semester = document.getElementById("semester").value;
    const year = currentUserYear;
  
    try {
      await db.collection("students").add({
        name: name,
        rollNumber: rollNumber,
        group: currentGroup,
        semester: semester,
        year: year
      });
  
      alert("Student added successfully!");
      document.getElementById("addStudentModal").classList.add("hidden");
      document.getElementById("addStudentForm").reset();
      fetchStudents(currentGroup, currentSemester);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  }
  
  function fetchStudents(group, semester) {
    db.collection("students")
      .where("group", "==", group)
      .where("semester", "==", semester)
      .get()
      .then((querySnapshot) => {
        const students = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        displayStudents(students);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }
  
  function displayStudents(students) {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const currentStudents = students.slice(startIndex, endIndex);
  
    const studentTable = document.getElementById("studentTable");
    studentTable.innerHTML = "";
  
    currentStudents.forEach((student) => {
      studentTable.innerHTML += `
        <tr data-student-id="${student.id}">
          <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
          <td class="px-6 py-4 whitespace-nowrap">${student.rollNumber}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button type="button" onclick="markAttendance('${student.id}', 'present')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2">Present</button>
            <button type="button" onclick="markAttendance('${student.id}', 'absent')" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Absent</button>
          </td>
        </tr>`;
    });
  
    updatePagination(students.length);
  }
  
  function updatePagination(totalStudents) {
    const totalPages = Math.ceil(totalStudents / studentsPerPage);
    const pageInfo = document.getElementById("pageInfo");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
  
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }
  
  function changePage(direction) {
    currentPage += direction;
    fetchStudents(currentGroup, currentSemester);
  }
  
  function markAttendance(studentId, status) {
    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    const presentButton = row.querySelector("button:first-child");
    const absentButton = row.querySelector("button:last-child");
  
    if (status === "present") {
      presentButton.classList.add("bg-green-600");
      presentButton.disabled = true;
      absentButton.classList.remove("bg-red-600");
      absentButton.disabled = false;
    } else {
      absentButton.classList.add("bg-red-600");
      absentButton.disabled = true;
      presentButton.classList.remove("bg-green-600");
      presentButton.disabled = false;
    }
  
    row.dataset.attendance = status;
  }
  
  async function saveAttendance(event) {
    event.preventDefault();
    const selectedSubject = document.getElementById("subjectSelect").value;
    const attendanceData = {};
  
    const studentRows = document.querySelectorAll("#studentTable tr");
    studentRows.forEach((row) => {
      const studentId = row.dataset.studentId;
      const status = row.dataset.attendance;
      if (status) {
        attendanceData[studentId] = {
          present: status === "present" ? 1 : 0,
          absent: status === "absent" ? 1 : 0,
        };
      }
    });
  
    if (Object.keys(attendanceData).length === 0) {
      alert("Please mark attendance for at least one student before submitting.");
      return;
    }
  
    try {
      // Fetch existing attendance records
      const attendanceQuery = await db
        .collection("attendance")
        .where("subject", "==", selectedSubject)
        .where("group", "==", currentGroup)
        .where("semester", "==", currentSemester)
        .get();
  
      if (attendanceQuery.empty) {
        // No existing attendance record, create a new one
        await db.collection("attendance").add({
          subject: selectedSubject,
          group: currentGroup,
          semester: currentSemester,
          date: new Date(),
          attendance: attendanceData,
        });
        alert("Attendance marked successfully!");
      } else {
        // Update the existing attendance record
        const docRef = attendanceQuery.docs[0].ref;
        const existingAttendanceData = attendanceQuery.docs[0].data().attendance;
  
        // Update the existing attendance data with the new data
        Object.keys(attendanceData).forEach((studentId) => {
          existingAttendanceData[studentId] = attendanceData[studentId];
        });
  
        await docRef.update({
          attendance: existingAttendanceData,
          date: new Date(), // Update the date
        });
        alert("Attendance updated successfully!");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Error marking attendance. Please try again.");
    }
  }
  

  function showAnalytics() {
    if (!currentUser) {
      showLogin();
      return;
    }
  
    const content = document.getElementById("content");
    content.innerHTML = `
      <div class="max-w-4xl mx-auto overflow-hidden">
        <h1 class="text-3xl font-bold mb-6">Analytics</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Student Attendance</h2>
            <div class="mb-4">
              <label for="rollNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Roll Number</label>
              <input type="text" id="rollNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
            <button onclick="fetchStudentAttendance()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Get Attendance
            </button>
            <div id="attendanceChart" class="mt-4 hidden">
              <canvas id="pieChart"></canvas>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Overall Class Attendance</h2>
            <div class="bg-gray-800 rounded-xl p-6 space-y-4">
              <canvas id="overallAttendanceChart"></canvas>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md md:col-span-2">
            <h2 class="text-xl font-semibold mb-4">Date-specific Attendance</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input type="date" id="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              </div>
              <div>
                <label for="dateSubject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                <select id="dateSubject" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                  <option value="">Select Subject</option>
                </select>
              </div>
            </div>
            <button onclick="fetchDateAttendance()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Get Attendance
            </button>
            <div id="dateAttendance" class="mt-4"></div>
          </div>
        </div>
      </div>
    `;
    document.getElementById("bottom-nav").style.display = "flex";
  
    fetchSubjects();
    fetchOverallAttendance();
  }
  
  function fetchSubjects() {
    db.collection("subjects")
      .where("group", "==", currentGroup)
      .where("semester", "==", currentSemester)
      .get()
      .then((querySnapshot) => {
        const dateSubjectSelect = document.getElementById("dateSubject");
        dateSubjectSelect.innerHTML = '<option value="">Select Subject</option>';
        
        querySnapshot.forEach((doc) => {
          const subject = doc.data();
          const option = document.createElement("option");
          option.value = subject.name;
          option.textContent = subject.name;
          dateSubjectSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }
  
 let chartInstance = null; // Global variable to store the chart instance

function fetchStudentAttendance() {
  const rollNumber = document.getElementById("rollNumber").value;
  if (!rollNumber) {
    alert("Please enter a roll number");
    return;
  }

  db.collection("students")
    .where("rollNumber", "==", rollNumber)
    .where("group", "==", currentGroup)
    .where("semester", "==", currentSemester)
    .limit(1)
    .get()
    .then((studentSnapshot) => {
      if (studentSnapshot.empty) {
        alert("No student found with this roll number in your class");
        return null; // Return null if no student found
      }

      const studentId = studentSnapshot.docs[0].id; // Get the studentId

      return db.collection("attendance")
        .where("group", "==", currentGroup)
        .where("semester", "==", currentSemester)
        .get()
        .then((attendanceSnapshot) => ({ attendanceSnapshot, studentId })); // Pass both attendanceSnapshot and studentId
    })
    .then((result) => {
      // Handle if the result is null (when no student is found)
      if (!result) {
        return;
      }

      const { attendanceSnapshot, studentId } = result;

      if (attendanceSnapshot.empty) {
        alert("No attendance records found for this student");
        return;
      }

      let presentCount = 0;
      let totalClasses = 0;

      attendanceSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.attendance && data.attendance[studentId]) {
          totalClasses++;
          if (data.attendance[studentId].present === 1) {
            presentCount++;
          }
        }
      });

      const attendancePercentage = (presentCount / totalClasses) * 100;

      // Destroy the previous chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = document.getElementById("pieChart").getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Present", "Absent"],
          datasets: [
            {
              data: [presentCount, totalClasses - presentCount],
              backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: `Attendance for Roll Number: ${rollNumber}`,
            },
          },
        },
      });

      document.getElementById("attendanceChart").classList.remove("hidden");
    })
    .catch((error) => {
      console.error("Error fetching student attendance:", error);
    });
}

  
  function fetchOverallAttendance() {
    db.collection("attendance")
      .where("group", "==", currentGroup)
      .where("semester", "==", currentSemester)
      .get()
      .then((attendanceSnapshot) => {
        const subjects = {};
        const studentCounts = {};
  
        attendanceSnapshot.forEach((doc) => {
          const data = doc.data();
          if (!subjects[data.subject]) {
            subjects[data.subject] = { total: 0, present: 0 };
          }
          subjects[data.subject].total += Object.keys(data.attendance).length;
          const presentCount = Object.values(data.attendance).filter(
            (status) => status.present === 1
          ).length;
          subjects[data.subject].present += presentCount;
  
          if (!studentCounts[data.subject]) {
            studentCounts[data.subject] = new Set();
          }
          Object.keys(data.attendance).forEach((studentId) => {
            studentCounts[data.subject].add(studentId);
          });
        });
  
        const subjectLabels = Object.keys(subjects);
        const attendanceData = subjectLabels.map((subject) => {
          const totalStudents = studentCounts[subject].size;
          return (subjects[subject].present / subjects[subject].total) * 100;
        });
  
        const ctx = document.getElementById("overallAttendanceChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: subjectLabels,
            datasets: [
              {
                label: "Attendance Percentage",
                data: attendanceData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "Attendance Percentage",
                },
              },
            },
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: "Overall Class Attendance by Subject",
              },
            },
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching overall attendance:", error);
      });
  }
  
  async function fetchDateAttendance() {
    const date = document.getElementById("date").value;
    const subject = document.getElementById("dateSubject").value;
  
    if (!date || !subject) {
      alert("Please select both date and subject");
      return;
    }
  
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
  
    try {
      const querySnapshot = await db.collection("attendance")
        .where("group", "==", currentGroup)
        .where("semester", "==", currentSemester)
        .where("subject", "==", subject)
        .where("date", ">=", startDate)
        .where("date", "<=", endDate)
        .limit(1)
        .get();
  
      if (querySnapshot.empty) {
        alert("No attendance records found for this date and subject.");
        return;
      }
  
      const attendanceData = querySnapshot.docs[0].data(); // Assuming there's only one record for this date
      const studentIds = Object.keys(attendanceData.attendance);
  
      // Fetch student data for the listed students in attendance
      const studentsData = {};
      const studentsSnapshot = await db.collection("students").where("__name__", "in", studentIds).get();
      studentsSnapshot.forEach((doc) => {
        studentsData[doc.id] = doc.data();
      });
  
      const content = document.getElementById("content");
      content.innerHTML = `
        <div class="max-w-4xl mx-auto overflow-hidden">
          <h1 class="text-3xl font-bold mb-6">Date-specific Attendance</h1>
          <h2 class="text-xl font-semibold mb-4">
            ${attendanceData.subject} - ${new Date(attendanceData.date.toDate()).toLocaleDateString()}
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${Object.entries(attendanceData.attendance)
                  .map(([studentId, status]) => `
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">${studentsData[studentId]?.name || "Unknown"}</td>
                      <td class="px-6 py-4 whitespace-nowrap">${studentsData[studentId]?.rollNumber || "Unknown"}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          status.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }">
                          ${status.present ? "Present" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
          <button onclick="showAnalytics()" class="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Go Back to Analytics
          </button>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching date-specific attendance:", error);
    }
  }
  
  
  function showSettings() {
    if (!currentUser) {
      showLogin();
      return;
    }
  
    db.collection("users")
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          const content = document.getElementById("content");
          content.innerHTML = `
                  <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-1 mb-8">
                      <h1 class="text-3xl font-bold mb-6">Profile</h1>
                      <div class="p-6 space-y-6">
                          <div class="flex flex-col items-center">
                              <img class="h-24 w-24 rounded-full" src="${logo}" alt="Profile">
                              <h2 class="mt-4 text-xl font-semibold">${userData.name}</h2>
                              <p class="text-gray-500">${userData.email}</p>
                              <button id="editProfileBtn" onclick="showEditProfile()" class="mt-4 px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                                  Edit profile
                              </button>
                          </div>
  
                          <div class="space-y-4">
                              <h3 class="text-gray-500 text-sm font-medium">Settings</h3>
                              <div class="flex justify-between items-center">
                                  <div class="flex items-center space-x-3">
                                      <div class="bg-gray-100 p-2 rounded-full">
                                          <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                          </svg>
                                      </div>
                                      <span class="text-sm font-medium">Personal Info</span>
                                  </div>
                                  <svg class="h-5 w-5 text-gray-400"  fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                  </svg>
                              </div>
                              <div class="flex justify-between items-center">
                                  <div class="flex items-center space-x-3">
                                      <div class="bg-gray-100 p-2 rounded-full">
                                          <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                          </svg>
                                      </div>
                                      <span class="text-sm font-medium">Support</span>
                                  </div>
                                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                  </svg>
                              </div>
                          </div>
  
                          <div class="space-y-4">
                              <h3 class="text-gray-500 text-sm font-medium">Preferences</h3>
                              <div class="flex justify-between items-center">
                                  <div class="flex items-center space-x-3" >
                                      <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                      </svg>
                                      <span class="text-sm font-medium" >Dark Mode</span>
                                  </div>
                                  <label class="flex items-center cursor-pointer">
                                      <div class="relative">
                                          <input type="checkbox" id="darkModeToggle" class="sr-only">
                                          <div class="block w-10 h-6 bg-gray-400 rounded-full"></div>
                                          <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                      </div>
                                  </label>
                              </div>
  
                              <div class="flex justify-between items-center">
                                  <div class="flex items-center space-x-3">
                                      <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                      <span class="text-sm font-medium">Admin Code</span>
                                  </div>
                                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                  </svg>
                              </div>
                          </div>
  
                          <div class="py-2">
                              <button id="logoutBtn" class="flex items-center space-x-2 text-red-500 font-medium">
                                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                                  </svg>
                                  <span>Logout</span>
                              </button>
                          </div>
                      </div>
                  </div>
              `;
          document.getElementById("bottom-nav").style.display = "flex";
  
          document
            .getElementById("darkModeToggle")
            .addEventListener("change", function () {
              this.parentElement
                .querySelector(".block")
                .classList.toggle("bg-green-400");
              this.parentElement
                .querySelector(".dot")
                .classList.toggle("translate-x-4");
              // Add logic here to actually toggle dark mode
            });
  
          // Function to toggle the dark theme
          function toggleDarkTheme() {
            const body = document.getElementById("content");
            body.classList.toggle("dark"); // Toggle the 'dark' class
  
            // Save the current theme preference to localStorage
            if (body.classList.contains("dark")) {
              localStorage.setItem("theme", "dark");
            } else {
              localStorage.setItem("theme", "light");
            }
          }
  
          // Function to set the theme based on localStorage
          function setTheme() {
            const savedTheme = localStorage.getItem("theme");
            const body = document.getElementById("content");
            if (savedTheme === "dark") {
              body.classList.add("dark"); // Apply dark theme
            }
          }
  
          // Set the theme when the page loads
          window.onload = setTheme;
  
          // Add event listener to the toggle button
          document
            .getElementById("darkModeToggle")
            .addEventListener("click", toggleDarkTheme);
          document.getElementById("logoutBtn").addEventListener("click", () => {
            auth
              .signOut()
              .then(() => {
                currentUser = null;
                showLogin();
              })
              .catch((error) => {
                alert("Error logging out: " + error.message);
              });
          });
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
  function updateProfile(event) {
    event.preventDefault();
    const newName = document.getElementById("name").value;
  
    db.collection("users").doc(currentUser.uid).update({
      name: newName
    })
    .then(() => {
      alert("Profile updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    });
  }
  
  function changePassword(event) {
    event.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
  
    const user = auth.currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
  
    user.reauthenticateWithCredential(credential)
      .then(() => {
        return user.updatePassword(newPassword);
      })
      .then(() => {
        alert("Password changed successfully!");
        document.getElementById("passwordForm").reset();
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        alert("Error changing password. Please check your current password and try again.");
      });
  }
  
  function showAdmin() {
    if (!currentUser) {
      showLogin();
      return;
    }
  
    const content = document.getElementById("content");
    content.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="head flex items-center justify-between px-1 mb-8">
          <h1 class="text-3xl font-bold">Dashboard</h1>
          <div class="avatar w-12 h-12 overflow-hidden rounded-full object-cover flex items-center justify-center">
            <img src="${logo}" class="w-full h-full object-cover" alt="Admin avatar">
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md border-solid border-purple-400 border-2">
            <h2 class="text-xl font-semibold mb-4">Users</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200" id="userTableBody">
                  <!-- User data will be populated here -->
                </tbody>
              </table>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md border-solid border-green-400 border-2">
            <h2 class="text-xl font-semibold mb-4">Manage Collection</h2>
            <div class="mb-4">
              <label for="yearSelect" class="block text-sm font-medium text-gray-700">Select Year</label>
              <select id="yearSelect" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="semesterUpdate" class="block text-sm font-medium text-gray-700">Update Semester</label>
              <select id="semesterUpdate" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">Select Semester</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
              </select>
            </div>
            <button id="updateSemesterBtn" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Update Semester
            </button>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md border-solid border-orange-400 border-2">
            <h2 class="text-xl font-semibold mb-4">Subject Management</h2>
            <form id="subjectForm">
              <div class="mb-4">
                <label for="subjectName" class="block text-sm font-medium text-gray-700">Subject Name</label>
                <input type="text" id="subjectName" name="subjectName" required class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              </div>
              <div class="mb-4">
                <label for="subjectGroup" class="block text-sm font-medium text-gray-700">Group</label>
                <select id="subjectGroup" name="subjectGroup" required class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Select Group</option>
                  <option value="BCA">BCA</option>
                  <option value="BSC">BSC</option>
                  <option value="BBA">BBA</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="subjectSemester" class="block text-sm font-medium text-gray-700">Semester</label>
                <select id="subjectSemester" name="subjectSemester" required class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                </select>
              </div>
              <button type="submit" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                Add Subject
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    document.getElementById("bottom-nav").style.display = "flex";
  
    loadDashboardData();
    setupEventListeners();
  }
  function showEditProfile() {
    db.collection("users")
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          const content = document.getElementById("content");
          content.innerHTML = `  
                  <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8">
                      <div class="p-6 space-y-6">
                          <div class="flex items-center justify-between">
                              <h2 class="text-2xl font-semibold">Edit Profile</h2>
                              <button id="saveBtn" class="text-blue-500 font-medium">Save</button>
                          </div>
                          <div id="avatarContainer" class="flex flex-col items-center">
                              <img id="mainAvatar" class="h-24 w-24 rounded-full" src="./imgs/avatar (1).png" alt="Profile">
                              <button class="changeAvatarBtn mt-4 text-blue-500 font-medium">Change Photo</button>
                          </div>
                          <!-- Modal -->
                      <div id="avatarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
                          <div class="bg-white rounded-lg shadow-lg w-80">
                              <div class="flex justify-between items-center p-4 border-b">
                                  <h2 class="text-lg font-semibold">Select Your Avatar</h2>
                                  <span class="cursor-pointer close text-gray-500" id="closeModal">&times;</span>
                              </div>
                              <div class="px-6 py-4 grid grid-cols-3 gap-4">
                                  <img src="./imgs/avatar (1).png" alt="Avatar 1" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (1).png">
                                  <img src="./imgs/avatar (2).png" alt="Avatar 2" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (2).png">
                                  <img src="./imgs/avatar (3).png" alt="Avatar 3" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (3).png">
                                  <img src="./imgs/avatar (4).png" alt="Avatar 1" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (4).png">
                                  <img src="./imgs/avatar (5).png" alt="Avatar 5" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (5).png">
                                  <img src="./imgs/avatar (6).png" alt="Avatar 3" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (6).png">
                                  <img src="./imgs/avatar (6).png" alt="Avatar 6" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (6).png">
                                  <img src="./imgs/avatar (7).png" alt="Avatar 7" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (7).png">
                                  <img src="./imgs/avatar (8).png" alt="Avatar 8" class="avatar w-16 h-16 rounded-full cursor-pointer" data-avatar="./imgs/avatar (8).png">
                              </div>
                          </div>
                      </div>
                          <div class="space-y-4">
                              <div class="flex flex-col space-y-1">
                                  <label for="name" class="text-sm font-medium text-gray-700">Name</label>
                                  <input type="text" id="name" name="name" value="${userData.name}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                              </div>
                              <div class="flex flex-col space-y-1">
                                  <label for="email" class="text-sm font-medium text-gray-700">Email</label>
                                  <input type="email" id="email" name="email" value="${userData.email}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                              </div>
                              <div class="flex flex-col space-y-1">
                                  <label for="group" class="text-sm font-medium text-gray-700">Group</label>
                                  <input type="text" id="group" name="group" value="${userData.group}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" readonly>
                              </div>
                              <div class="flex flex-col space-y-1">
                                  <label for="semester" class="text-sm font-medium text-gray-700">Semester</label>
                                  <input type="text" id="semester" name="semester" value="${userData.semester}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" readonly>
                              </div>
                          </div>
                      </div>
                  </div>`;
          document.getElementById("bottom-nav").style.display = "flex";
  
          const changeAvatarBtn = document.querySelector(".changeAvatarBtn");
          const modal = document.getElementById("avatarModal");
          const closeBtn = document.getElementById("closeModal");
          const mainAvatar = document.getElementById("mainAvatar");
  
          // Load the avatar from local storage on page load
          const storedAvatar = localStorage.getItem("userAvatar");
          if (storedAvatar) {
            mainAvatar.src = storedAvatar;
          }
  
          // Show modal when the button is clicked
          changeAvatarBtn.onclick = function () {
            modal.classList.remove("hidden");
          };
  
          // Close modal when the close button is clicked
          closeBtn.onclick = function () {
            modal.classList.add("hidden");
          };
  
          // Close modal when clicking outside of the modal
          window.onclick = function (event) {
            if (event.target === modal) {
              modal.classList.add("hidden");
            }
          };
  
          // Handle avatar selection
          const avatars = document.querySelectorAll(".avatar");
          avatars.forEach((avatar) => {
            avatar.onclick = function () {
              const selectedAvatar = this.getAttribute("data-avatar");
              mainAvatar.src = selectedAvatar; // Update the main avatar
              localStorage.setItem("userAvatar", selectedAvatar); // Store the selected avatar in local storage
              modal.classList.add("hidden"); // Close the modal
            };
          });
          document.getElementById("saveBtn").addEventListener("click", () => {
            const updatedData = {
              name: document.getElementById("name").value,
              email: document.getElementById("email").value,
            };
  
            db.collection("users")
              .doc(currentUser.uid)
              .update(updatedData)
              .then(() => {
                alert("Profile updated successfully!");
                showSettings();
              })
              .catch((error) => {
                console.error("Error updating profile:", error);
              });
          });
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
  function setupEventListeners() {
    document.getElementById("updateSemesterBtn").addEventListener("click", updateSemester);
    document.getElementById("subjectForm").addEventListener("submit", addSubject);
  }
  
  function updateSemester() {
    const selectedYear = document.getElementById("yearSelect").value;
    const newSemester = document.getElementById("semesterUpdate").value;
  
    if (!selectedYear || !newSemester) {
      alert("Please select both year and semester");
      return;
    }
  
    db.collection("students")
      .where("year", "==", selectedYear)
      .get()
      .then((querySnapshot) => {
        const batch = db.batch();
        querySnapshot.forEach((doc) => {
          batch.update(doc.ref, { semester: newSemester });
        });
        return batch.commit();
      })
      .then(() => {
        alert(`Semester updated successfully for ${selectedYear} year students`);
        // Update users with the same year
        return db.collection("users")
          .where("year", "==", selectedYear)
          .get();
      })
      .then((userQuerySnapshot) => {
        const userBatch = db.batch();
        userQuerySnapshot.forEach((doc) => {
          userBatch.update(doc.ref, { semester: newSemester });
        });
        return userBatch.commit();
      })
      .then(() => {
        console.log("Users updated successfully");
      })
      .catch((error) => {
        console.error("Error updating semester:", error);
        alert("Error updating semester. Please try again.");
      });
  }
  
  function addSubject(event) {
    event.preventDefault();
    const subjectName = document.getElementById("subjectName").value;
    const subjectGroup = document.getElementById("subjectGroup").value;
    const subjectSemester = document.getElementById("subjectSemester").value;
  
    db.collection("subjects").add({
      name: subjectName,
      group: subjectGroup,
      semester: subjectSemester
    })
    .then(() => {
      alert("Subject added successfully!");
      document.getElementById("subjectForm").reset();
    })
    .catch((error) => {
      console.error("Error adding subject:", error);
      alert("Error adding subject. Please try again.");
    });
  }
  
  function loadDashboardData() {
    db.collection("users").get()
      .then((querySnapshot) => {
        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = "";
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          userTableBody.innerHTML += `
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">${userData.name}</td>
              <td class="px-6 py-4 whitespace-nowrap">${userData.role || "User"}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editUser('${doc.id}')" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                <button onclick="deleteUser('${doc.id}')" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          `;
        });
      })
      .catch((error) => {
        console.error("Error loading users: ", error);
      });
  }
  
  function editUser(userId) {
    db.collection("users").doc(userId).get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          const content = document.getElementById("content");
          content.innerHTML = `
            <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-bold mb-4">Edit User</h2>
              <form id="editUserForm">
                <div class="mb-4">
                  <label for="editName" class="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="editName" name="name" value="${userData.name}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mb-4">
                  <label for="editEmail" class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="editEmail" name="email" value="${userData.email}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                </div>
                <div class="mb-4">
                  <label for="editRole" class="block text-sm font-medium text-gray-700">Role</label>
                  <select id="editRole" name="role" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="cr" ${userData.role === 'cr' ? 'selected' : ''}>CR/VCR</option>
                    <option value="admin" ${userData.role === 'admin' ? 'selected' : ''}>Admin</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label for="editGroup" class="block text-sm font-medium text-gray-700">Group</label>
                  <select id="editGroup" name="group" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="BCA" ${userData.group === 'BCA' ? 'selected' : ''}>BCA</option>
                    <option value="BSC" ${userData.group === 'BSC' ? 'selected' : ''}>BSC</option>
                    <option value="BBA" ${userData.group === 'BBA' ? 'selected' : ''}>BBA</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label for="editYear" class="block text-sm font-medium text-gray-700">Year</label>
                  <select id="editYear" name="year" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="1" ${userData.year === '1' ? 'selected' : ''}>1st Year</option>
                    <option value="2" ${userData.year === '2' ? 'selected' : ''}>2nd Year</option>
                    <option value="3" ${userData.year === '3' ? 'selected' : ''}>3rd Year</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label for="editSemester" class="block text-sm font-medium text-gray-700">Semester</label>
                  <select id="editSemester" name="semester" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="1" ${userData.semester === '1' ? 'selected' : ''}>1st Semester</option>
                    <option value="2" ${userData.semester === '2' ? 'selected' : ''}>2nd Semester</option>
                    <option value="3" ${userData.semester === '3' ? 'selected' : ''}>3rd Semester</option>
                    <option value="4" ${userData.semester === '4' ? 'selected' : ''}>4th Semester</option>
                    <option value="5" ${userData.semester === '5' ? 'selected' : ''}>5th Semester</option>
                    <option value="6" ${userData.semester === '6' ? 'selected' : ''}>6th Semester</option>
                  </select>
                </div>
                <div class="flex justify-between">
                  <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Update User
                  </button>
                  <button type="button" onclick="showAdmin()" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          `;
  
          document.getElementById("editUserForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const updatedUserData = {
              name: document.getElementById("editName").value,
              email: document.getElementById("editEmail").value,
              role: document.getElementById("editRole").value,
              group: document.getElementById("editGroup").value,
              year: document.getElementById("editYear").value,
              semester: document.getElementById("editSemester").value
            };
  
            db.collection("users").doc(userId).update(updatedUserData)
              .then(() => {
                alert("User updated successfully!");
                showAdmin();
              })
              .catch((error) => {
                console.error("Error updating user:", error);
                alert("Error updating user. Please try again.");
              });
          });
        } else {
          console.log("No such user!");
        }
      })
      .catch((error) => {
        console.log("Error getting user:", error);
      });
  }
  
  
  function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
      db.collection("users").doc(userId).delete()
        .then(() => {
          console.log("User successfully deleted");
          loadDashboardData();
        })
        .catch((error) => {
          console.error("Error removing user: ", error);
        });
    }
  }
  
  // Helper function
  function getOrdinalSuffix(number) {
    const j = number % 10,
      k = number % 100;
    if (j == 1 && k != 11) {
      return "st";
    }
    if (j == 2 && k != 12) {
      return "nd";
    }
    if (j == 3 && k != 13) {
      return "rd";
    }
    return "th";
  }
  
  // Initial page load
  if (currentUser) {
    showMainPage();
  } else {
    showLogin();
  }