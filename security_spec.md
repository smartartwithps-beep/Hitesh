# Security Specification - SmokeFree Counter

## 1. Data Invariants
- A User profile must contain `displayName`, `quitDate`, `cigarettesPerDay`, and `updatedAt`.
- `updatedAt` must always be the server timestamp.
- Usernames must be between 1 and 50 characters.
- Cigarettes per day must be a non-negative integer.
- Users can only read and write their own profile document.
- All users can list the user collection to see the leaderboard (public fields only).

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Attempt to create a document with a different UID in the path than the auth UID. (Expected: DENIED)
2. **Field Injection**: Attempt to add a `role: 'admin'` field to the user profile. (Expected: DENIED)
3. **Type Poisoning**: Sending a string for `cigarettesPerDay`. (Expected: DENIED)
4. **Invalid Timestamp**: Sending a client-side timestamp for `updatedAt` instead of server value. (Expected: DENIED)
5. **ID Poisoning**: Using a 1MB string as a document ID. (Expected: DENIED)
6. **Bypass Validation**: Attempting to update `displayName` without providing `updatedAt`. (Expected: DENIED)
7. **Negative Values**: Setting `cigarettesPerDay` to -5. (Expected: DENIED)
8. **Empty Name**: Setting `displayName` to an empty string. (Expected: DENIED)
9. **Unauthorized List**: Attempting to list users without being signed in. (Expected: DENIED)
10. **Unauthorized Get**: Attempting to get another user's profile directly. (Expected: DENIED)
11. **Shadow Update**: Updating a field not in the allowed list for user updates. (Expected: DENIED)
12. **Unverified Email**: Attempting to write with `email_verified: false`. (Expected: DENIED)
