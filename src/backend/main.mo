import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Credentials = { username : Text; password : Text };
  type Role = { #student; #admin; #invalid };
  type Subject = { examDate : Text; practicalDate : ?Text; assignmentDetails : Text };

  public type UserProfile = {
    name : Text;
  };

  let credentials = Map.empty<Text, Credentials>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let subjectData = Map.empty<Text, Subject>();
  let principalToUsername = Map.empty<Principal, Text>();
  let usernameToPrincipal = Map.empty<Text, Principal>();
  var notificationsList : [Text] = [
    "📅 Physics Exam on 25 March 2026",
    "📝 Physics Assignment: Complete Chapter 5 numericals before 24 March",
    "🧪 Physics Practical on 28 March 2026",
    "📢 Holiday on 1 April — no classes",
  ];

  let defaultUsernames = Set.fromIter(["admin", "teacher", "student1", "student2", "alice", "bob"].values());

  func isDefaultUser(username : Text) : Bool {
    defaultUsernames.contains(username);
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let defaultCredentials = [
    { username = "admin"; password = "admin123" },
    { username = "teacher"; password = "teacher123" },
    { username = "student1"; password = "pass123" },
    { username = "student2"; password = "pass456" },
    { username = "alice"; password = "alice123" },
    { username = "bob"; password = "bob123" },
  ];
  for (cred in defaultCredentials.values()) {
    credentials.add(cred.username, cred);
  };

  subjectData.add("Physics", {
    examDate = "25 March 2026";
    practicalDate = ?"28 March 2026";
    assignmentDetails = "Complete Chapter 5 numericals and submit before 24 March";
  });
  subjectData.add("Chemistry", {
    examDate = "27 March 2026";
    practicalDate = ?"30 March 2026";
    assignmentDetails = "Prepare lab report for Titration experiment and submit before 26 March";
  });
  subjectData.add("Math", {
    examDate = "29 March 2026";
    practicalDate = null;
    assignmentDetails = "Solve Exercise 8.3 (Q1-Q10) and submit before 28 March";
  });

  func isCallerAuthenticated(caller : Principal) : Bool {
    principalToUsername.containsKey(caller);
  };

  public shared ({ caller }) func register(username : Text, password : Text, fullName : Text) : async { #ok; #err : Text } {
    if (credentials.containsKey(username)) {
      return #err("Username already taken");
    };
    credentials.add(username, { username; password });
    userProfiles.add(caller, { name = fullName });
    principalToUsername.add(caller, username);
    usernameToPrincipal.add(username, caller);
    accessControlState.userRoles.add(caller, #user);
    #ok;
  };

  public query ({ caller }) func getRegisteredStudents() : async [Text] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view registered students");
    };
    credentials.keys().filter(func(username) { not isDefaultUser(username) }).toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not isCallerAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not isCallerAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func login(username : Text, password : Text) : async Role {
    switch (credentials.get(username)) {
      case (null) { #invalid };
      case (?user) {
        if (user.password == password) {
          principalToUsername.add(caller, username);
          usernameToPrincipal.add(username, caller);
          if (username == "admin" or username == "teacher") {
            accessControlState.userRoles.add(caller, #admin);
            #admin;
          } else {
            accessControlState.userRoles.add(caller, #user);
            #student;
          };
        } else {
          #invalid;
        };
      };
    };
  };

  public query ({ caller }) func getAllSubjectData() : async [(Text, Subject)] {
    subjectData.entries().toArray();
  };

  public query ({ caller }) func getNotifications() : async [Text] {
    notificationsList;
  };

  public shared ({ caller }) func updatePhysics(examDate : Text, practicalDate : Text, assignmentDetails : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update subject data");
    };
    subjectData.add("Physics", { examDate; practicalDate = ?practicalDate; assignmentDetails });
  };

  public shared ({ caller }) func updateChemistry(examDate : Text, practicalDate : Text, assignmentDetails : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update subject data");
    };
    subjectData.add("Chemistry", { examDate; practicalDate = ?practicalDate; assignmentDetails });
  };

  public shared ({ caller }) func updateMath(examDate : Text, assignmentDetails : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update subject data");
    };
    subjectData.add("Math", { examDate; practicalDate = null; assignmentDetails });
  };

  public shared ({ caller }) func updateNotifications(notifications : [Text]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update notifications");
    };
    notificationsList := notifications;
  };
};
