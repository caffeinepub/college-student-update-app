# College Student Portal App

## Current State
Backend uses `let` (non-stable) in-memory maps for credentials, scholar numbers, and user profiles. Every canister upgrade/deployment wipes all registered users, making registration appear broken — users register successfully, but cannot log in after the next deploy because their data is gone. The frontend validation and registration flow logic are otherwise correct.

## Requested Changes (Diff)

### Add
- Stable pre/post upgrade hooks in backend to persist: credentials, scholarToUsername, usernameToScholar, userProfiles (by username), principalToUsername, usernameToPrincipal maps across upgrades

### Modify
- Convert all volatile map declarations to use stable serialization (stable arrays + fromIter/toIter pattern)
- Store userProfiles keyed by username (Text) instead of by Principal, since all anonymous callers share the same principal
- In `register`: use `put` (upsert) for principal-keyed maps to avoid trapping when same anonymous principal registers multiple times

### Remove
- Nothing

## Implementation Plan
1. Add `stable var` arrays for each map's entries
2. Add `system func preupgrade` to serialize all maps to stable arrays
3. Add `system func postupgrade` to clear stable arrays after restore
4. Change `userProfiles` to be keyed by username (Text) instead of Principal
5. Update all references to userProfiles accordingly
6. In the `register` function, skip the `accessControlState.userRoles.add(caller, #user)` call for anonymous callers (since getUserRole already returns #guest for anonymous)
