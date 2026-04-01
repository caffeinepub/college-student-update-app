import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  // ---- Type Definitions ----

  public type Credentials = {
    username : Text;
    password : Text;
  };

  public type Role = {
    #invalid;
    #student;
    #admin;
  };

  public type Subject = {
    examDate : Text;
    practicalDate : ?Text;
    assignmentDetails : Text;
    teacherName : Text;
    teacherEmail : Text;
    progress : Nat;
    attendancePresent : Nat;
    attendanceTotal : Nat;
    marks : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type CreateUserRequest = {
    username : Text;
    password : Text;
    fullName : Text;
    scholarNumber : Text;
  };

  // ---- STABLE backing arrays (survive upgrades) ----

  stable var stableCredentials : [(Text, Credentials)] = [];
  stable var stableUsernameToScholar : [(Text, Text)] = [];
  stable var stableScholarToUsername : [(Text, Text)] = [];
  stable var stableUsernameToProfile : [(Text, UserProfile)] = [];
  stable var stableSubjectData : [(Text, Subject)] = [];
  stable var stablePrincipalToUsername : [(Principal, Text)] = [];
  stable var stableUsernameToPrincipal : [(Text, Principal)] = [];
  stable var stableNotifications : [(Text, Text)] = [];

  // ---- In-memory Maps (populated from stable arrays) ----

  let credentials = Map.empty<Text, Credentials>();
  let usernameToScholar = Map.empty<Text, Text>();
  let scholarToUsername = Map.empty<Text, Text>();
  // userProfiles keyed by USERNAME (not Principal) to avoid anonymous-principal collision
  let usernameToProfile = Map.empty<Text, UserProfile>();
  let subjectData = Map.empty<Text, Subject>();
  let accessControlState = AccessControl.initState();
  let principalToUsername = Map.empty<Principal, Text>();
  let usernameToPrincipal = Map.empty<Text, Principal>();
  let persistentCompletedAssignments = Map.empty<Principal, Set.Set<Text>>();
  let persistentNotes = Map.empty<Principal, Map.Map<Text, [Text]>>();
  let defaultUsernames = Set.fromIter(["admin", "teacher", "student1", "student2", "alice", "bob"].values());
  let persistentNotifications = Map.empty<Text, Text>();
  // Kept for upgrade compatibility (previously stable implicit field)
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinAuthorization(accessControlState);

  // ---- Restore from stable storage on upgrade ----

  for ((k, v) in stableCredentials.values()) { credentials.add(k, v) };
  for ((k, v) in stableUsernameToScholar.values()) { usernameToScholar.add(k, v) };
  for ((k, v) in stableScholarToUsername.values()) { scholarToUsername.add(k, v) };
  for ((k, v) in stableUsernameToProfile.values()) { usernameToProfile.add(k, v) };
  for ((k, v) in stableSubjectData.values()) { subjectData.add(k, v) };
  for ((k, v) in stablePrincipalToUsername.values()) { principalToUsername.add(k, v) };
  for ((k, v) in stableUsernameToPrincipal.values()) { usernameToPrincipal.add(k, v) };
  for ((k, v) in stableNotifications.values()) { persistentNotifications.add(k, v) };

  // ---- ACTOR INIT (only runs on fresh deploy, not upgrades) ----

  let defaultCredentials = [
    { username = "admin"; password = "admin123" },
    { username = "teacher"; password = "teacher123" },
    { username = "student1"; password = "pass123" },
    { username = "student2"; password = "pass456" },
    { username = "alice"; password = "alice123" },
    { username = "bob"; password = "bob123" },
  ];
  for (cred in defaultCredentials.values()) {
    if (not credentials.containsKey(cred.username)) {
      credentials.add(cred.username, cred);
    };
  };

  // Default subjects (only if not restored from stable storage)
  if (not subjectData.containsKey("Physics")) {
    subjectData.add("Physics", {
      examDate = "25 March 2026";
      practicalDate = ?"28 March 2026";
      assignmentDetails = "Complete Chapter 5 numericals and submit before 24 March";
      teacherName = "Professor Ashutosh";
      teacherEmail = "ashutosh@college.edu";
      progress = 70;
      attendancePresent = 30;
      attendanceTotal = 40;
      marks = "78/100";
    });
  };
  if (not subjectData.containsKey("Chemistry")) {
    subjectData.add("Chemistry", {
      examDate = "27 March 2026";
      practicalDate = ?"30 March 2026";
      assignmentDetails = "Prepare lab report for Titration experiment and submit before 26 March";
      teacherName = "Professor Sharma";
      teacherEmail = "sharma@college.edu";
      progress = 60;
      attendancePresent = 25;
      attendanceTotal = 40;
      marks = "82/100";
    });
  };
  if (not subjectData.containsKey("Math")) {
    subjectData.add("Math", {
      examDate = "29 March 2026";
      practicalDate = null;
      assignmentDetails = "Solve Exercise 8.3 (Q1-Q10) and submit before 28 March";
      teacherName = "Professor Godse";
      teacherEmail = "godse@college.edu";
      progress = 50;
      attendancePresent = 35;
      attendanceTotal = 40;
      marks = "90/100";
    });
  };

  let defaultNotifications = [
    "\u{1F4C5} Physics Exam on 25 March 2026",
    "\u{1F4DD} Physics Assignment: Complete Chapter 5 numericals before 24 March",
    "\u{1F9EA} Physics Practical on 28 March 2026",
    "\u{1F4E2} Holiday on 1 April — no classes",
  ];
  if (persistentNotifications.size() == 0) {
    for ((idx, notification) in defaultNotifications.enumerate()) {
      persistentNotifications.add(idx.toText(), notification);
    };
  };

  // ---- Upgrade Hooks ----

  system func preupgrade() {
    stableCredentials := credentials.entries().toArray();
    stableUsernameToScholar := usernameToScholar.entries().toArray();
    stableScholarToUsername := scholarToUsername.entries().toArray();
    stableUsernameToProfile := usernameToProfile.entries().toArray();
    stableSubjectData := subjectData.entries().toArray();
    stablePrincipalToUsername := principalToUsername.entries().toArray();
    stableUsernameToPrincipal := usernameToPrincipal.entries().toArray();
    stableNotifications := persistentNotifications.entries().toArray();
  };

  system func postupgrade() {
    stableCredentials := [];
    stableUsernameToScholar := [];
    stableScholarToUsername := [];
    stableUsernameToProfile := [];
    stableSubjectData := [];
    stablePrincipalToUsername := [];
    stableUsernameToPrincipal := [];
    stableNotifications := [];
  };

  // ---- Helper Functions ----

  func isDefaultUser(username : Text) : Bool {
    defaultUsernames.contains(username);
  };

  // ---- User Registration & Authentication ----

  // Public registration - no auth required (intentional for new user signup)
  public shared ({ caller }) func register(username : Text, password : Text, fullName : Text, scholarNumber : Text) : async { #ok; #err : Text } {
    if (scholarNumber.size() < 3 or scholarNumber.size() > 15) {
      return #err("Scholar number must be 3 to 15 alphanumeric characters; you provided " # scholarNumber.size().toText() # " characters");
    };
    if (credentials.containsKey(username)) {
      return #err("Username already taken");
    };
    if (scholarNumber != "" and scholarToUsername.containsKey(scholarNumber)) {
      return #err("Scholar number already registered");
    };
    credentials.add(username, { username; password });
    // Store profile by username (not by principal) to avoid anonymous-principal collision
    usernameToProfile.add(username, { name = fullName });
    // Map principal <-> username only for non-anonymous callers
    if (not caller.isAnonymous()) {
      principalToUsername.add(caller, username);
      usernameToPrincipal.add(username, caller);
      accessControlState.userRoles.add(caller, #user);
    };
    if (scholarNumber != "") {
      usernameToScholar.add(username, scholarNumber);
      scholarToUsername.add(scholarNumber, username);
    };
    #ok;
  };

  public shared ({ caller }) func login(username : Text, password : Text) : async Role {
    switch (credentials.get(username)) {
      case (null) { #invalid };
      case (?storedCredentials) {
        if (storedCredentials.password == password) {
          if (not caller.isAnonymous()) {
            principalToUsername.add(caller, username);
            usernameToPrincipal.add(username, caller);
          };
          if (username == "admin" or username == "teacher") {
            if (not caller.isAnonymous()) {
              accessControlState.userRoles.add(caller, #admin);
            };
            #admin;
          } else {
            if (not caller.isAnonymous()) {
              accessControlState.userRoles.add(caller, #user);
            };
            #student;
          };
        } else {
          #invalid;
        };
      };
    };
  };

  public shared ({ caller }) func loginByScholarNumber(scholarNumber : Text, password : Text) : async Role {
    switch (scholarToUsername.get(scholarNumber)) {
      case (null) { #invalid };
      case (?username) {
        switch (credentials.get(username)) {
          case (null) { #invalid };
          case (?user) {
            if (user.password == password) {
              if (not caller.isAnonymous()) {
                principalToUsername.add(caller, username);
                usernameToPrincipal.add(username, caller);
                accessControlState.userRoles.add(caller, #user);
              };
              #student;
            } else {
              #invalid;
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getScholarNumber(username : Text) : async ?Text {
    // Allow access for any caller (anonymous or not) since we use username-based auth
    usernameToScholar.get(username);
  };

  // ---- User Profiles ----

  public query ({ caller }) func getRegisteredStudents() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view registered students");
    };
    credentials.keys().filter(func(username) { not isDefaultUser(username) }).toArray();
  };

  // Get profile by username (used after login when we know the username)
  public query func getCallerUserProfileByUsername(username : Text) : async ?UserProfile {
    usernameToProfile.get(username);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Try by principal first, fall back to null
    if (caller.isAnonymous()) { return null };
    switch (principalToUsername.get(caller)) {
      case (null) { null };
      case (?username) { usernameToProfile.get(username) };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (principalToUsername.get(user)) {
      case (null) { null };
      case (?username) { usernameToProfile.get(username) };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Allow saving profile by principal lookup or by anonymous (store by caller if not anonymous)
    if (not caller.isAnonymous()) {
      switch (principalToUsername.get(caller)) {
        case (?username) { usernameToProfile.add(username, profile) };
        case (null) {};
      };
    };
  };

  // ---- Subject Management ----

  public query ({ caller }) func getAllSubjectData() : async [(Text, Subject)] {
    subjectData.entries().toArray();
  };

  public query ({ caller }) func getNotifications() : async [Text] {
    persistentNotifications.values().toArray();
  };

  public shared ({ caller }) func updateSubjectExtended(subjectName : Text, teacherName : Text, teacherEmail : Text, progress : Nat, attendanceTotal : Nat, marks : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update subject data");
    };
    subjectData.add(subjectName, {
      examDate = "01 April 2026";
      practicalDate = null;
      assignmentDetails = "Updated details";
      teacherName;
      teacherEmail;
      progress;
      attendancePresent = 0;
      attendanceTotal;
      marks;
    });
  };

  public shared ({ caller }) func updatePhysics(examDate : Text, practicalDate : Text, assignmentDetails : Text, teacherName : Text, teacherEmail : Text, progress : Nat, attendancePresent : Nat, attendanceTotal : Nat, marks : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update subject data");
    };
    subjectData.add("Physics", { examDate; practicalDate = ?practicalDate; assignmentDetails; teacherName; teacherEmail; progress; attendancePresent; attendanceTotal; marks });
  };

  public shared ({ caller }) func updateChemistry(examDate : Text, practicalDate : Text, assignmentDetails : Text, teacherName : Text, teacherEmail : Text, progress : Nat, attendancePresent : Nat, attendanceTotal : Nat, marks : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update subject data");
    };
    subjectData.add("Chemistry", { examDate; practicalDate = ?practicalDate; assignmentDetails; teacherName; teacherEmail; progress; attendancePresent; attendanceTotal; marks });
  };

  public shared ({ caller }) func updateMath(examDate : Text, assignmentDetails : Text, teacherName : Text, teacherEmail : Text, progress : Nat, attendancePresent : Nat, attendanceTotal : Nat, marks : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update subject data");
    };
    subjectData.add("Math", { examDate; practicalDate = null; assignmentDetails; teacherName; teacherEmail; progress; attendancePresent; attendanceTotal; marks });
  };

  // ---- Assignment Completion Tracking ----

  public query ({ caller }) func getCompletedAssignments() : async [Text] {
    switch (persistentCompletedAssignments.get(caller)) {
      case (null) { [] };
      case (?completedSubjects) { completedSubjects.toArray() };
    };
  };

  public shared ({ caller }) func markAssignmentComplete(subjectName : Text) : async () {
    if (subjectName == "" or not subjectData.containsKey(subjectName)) {
      Runtime.trap("Invalid subject name");
    };
    let existing = switch (persistentCompletedAssignments.get(caller)) {
      case (null) { Set.empty<Text>() };
      case (?subjects) { subjects };
    };
    existing.add(subjectName);
    persistentCompletedAssignments.add(caller, existing);
  };

  // ---- Notes Management ----

  public shared ({ caller }) func addNote(subjectName : Text, note : Text) : async () {
    if (subjectName == "" or not subjectData.containsKey(subjectName)) {
      Runtime.trap("Invalid subject name");
    };
    let userNotes = switch (persistentNotes.get(caller)) {
      case (null) { Map.empty<Text, [Text]>() };
      case (?notes) { notes };
    };
    let existingNotes = switch (userNotes.get(subjectName)) {
      case (null) { [note] };
      case (?existing) { existing.concat([note]) };
    };
    userNotes.add(subjectName, existingNotes);
    persistentNotes.add(caller, userNotes);
  };

  public shared ({ caller }) func addAdminNote(subjectName : Text, note : Text, targetUser : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add notes for other users");
    };
    let userNotes = switch (persistentNotes.get(targetUser)) {
      case (null) { Map.empty<Text, [Text]>() };
      case (?notes) { notes };
    };
    let existingNotes = switch (userNotes.get(subjectName)) {
      case (null) { [note] };
      case (?existing) { existing.concat([note]) };
    };
    userNotes.add(subjectName, existingNotes);
    persistentNotes.add(targetUser, userNotes);
  };

  public query ({ caller }) func getNotes(subjectName : Text) : async [Text] {
    switch (persistentNotes.get(caller)) {
      case (null) { [] };
      case (?userNotes) {
        switch (userNotes.get(subjectName)) {
          case (null) { [] };
          case (?notes) { notes };
        };
      };
    };
  };

  public shared ({ caller }) func updateNotifications(notifications : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update notifications");
    };
    for ((idx, notification) in notifications.enumerate()) {
      persistentNotifications.add(idx.toText(), notification);
    };
  };

  public shared ({ caller }) func resetAllCourseData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reset course data");
    };
    // Reset to defaults
    subjectData.add("Physics", {
      examDate = "25 March 2026";
      practicalDate = ?"28 March 2026";
      assignmentDetails = "Complete Chapter 5 numericals and submit before 24 March";
      teacherName = "Professor Ashutosh";
      teacherEmail = "ashutosh@college.edu";
      progress = 70;
      attendancePresent = 30;
      attendanceTotal = 40;
      marks = "78/100";
    });
  };

};
