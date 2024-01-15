# Roles & Permissions

```mermaid
---
title: Viewer requests to view form
---
flowchart TD
  db[(Database)]

  A[Start] --> B["Loads page {/forms}"]
  B --> L{Is user in same org as forms being loaded?}
  L --> N[No] --> O[Deny request]
  L --> M[Yes]
  M --> F{Does user role have viewForm permissions?}
  F --> J[No] --> K[Deny request]
  F --> G[Yes] --> H[Grant request]
```

Access pattern

```raw
function isUserAuthenticated() {
  return request.auth != null
}

function isUserInResourceOrg() {
  let userOrg = get(/databases/$(database)/documents/users/$(request.auth.uid)).userDoc.data.org;
  return userOrg == resource.data.org;
}

function doesUserRoleHaveViewFormPermissions() {
  let userRole = get(/databases/$(database)/documents/users/$(request.auth.uid)).userDoc.data.role;
  let rolePermissions = get(/databases/$(database)/documents/$(userRole)).data.permissions
  return "viewer" in rolePermissions;
}

match /forms/{formId} {
  allow read: if isUserAuthenticated() && isUserInResourceOrg() && doesUserRoleHaveViewFormPermissions();
  allow write: if null;
}
```
