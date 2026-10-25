# Assignment 02: team development and evidence guide

## Team and Jira issues

- Member 1: Muhammad Sheharyar Shafique (21F-9649), Jira CSRBS-7 and CSRBS-8
- Member 2: Shaheryar (21F-9648), Jira CSRBS-9 and CSRBS-11
- Jira project: https://cfd-team-v7zzd0yx.atlassian.net/jira/software/projects/CSRBS

## Member 1: existing pull requests

- [CSRBS-7 registration PR #1](https://github.com/sheharyar-shafique/SPM-Assignment-No.2/pull/1)
- [CSRBS-8 login PR #2](https://github.com/sheharyar-shafique/SPM-Assignment-No.2/pull/2)

These are waiting for an independent teammate review. Do **not** mark their Jira stories Done or merge them until approved.

## Member 2: actual implementation work

After accepting the GitHub collaborator invitation, Shaheryar should clone the repository, run `npm install`, and create each branch from up-to-date `main`:

```bash
git clone https://github.com/sheharyar-shafique/SPM-Assignment-No.2.git
cd SPM-Assignment-No.2
npm install
git switch main
git pull origin main
git fetch origin
git switch --track origin/CSRBS-9-search-rooms
```

**CSRBS-9**: Implement `GET /api/rooms` filters for optional date, time and minimum capacity. Exclude rooms unavailable in the selected time slot by checking the `reservations` table. Add tests for filters and overlapping reservations. Build the room search page. Commit with names such as `CSRBS-9 Add room availability filtering`, push branch, and open a PR whose title includes the Jira key.

**CSRBS-11**: A remote branch already exists. Start with `git fetch origin` then `git switch --track origin/CSRBS-11-room-details` in a fresh clone (or `git switch CSRBS-11-room-details` if checked out before). Implement `GET /api/rooms/:id` to return room location, capacity and facilities, a sensible 404 for missing rooms, a details page, and tests. Commit and open a separate Jira-keyed PR.

## Cross-review

1. Shaheryar has been requested as reviewer on [PR #1](https://github.com/sheharyar-shafique/SPM-Assignment-No.2/pull/1) and [PR #2](https://github.com/sheharyar-shafique/SPM-Assignment-No.2/pull/2). Sign in as `shaheryarmalik-dev`, inspect **Files changed**, run tests, then submit his own **Review changes** assessment; comments should reflect his own inspection.
2. Member 1 reviews Shaheryar's PRs after he implements his own branches.
3. Address requested changes on each feature branch and obtain approval before merge.
4. Verify tests pass, merge approved PRs, then change Jira story statuses to Done.

## Current status

- Collaborator `shaheryarmalik-dev`: verified **Write** permission.
- CSRBS-9 and CSRBS-11: remote feature branches created, waiting for Shaheryar's actual code commits.
- PR #1 and PR #2: automated tests passed; review requested, not merged.
- CSRBS-7 and CSRBS-8: In Progress; CSRBS-9 and CSRBS-11: To Do until work begins.

## Jira GitHub integration

The native Jira Development panel needs the GitHub for Atlassian app installed and configured separately from the ChatGPT GitHub connection. After configuring, open CSRBS-7 and CSRBS-8 and check that linked commits, branches and PRs are displayed.

## Evidence screenshots (save original screens)

1. Jira list with all three Epics and 8 issue keys
2. Repository README and both members' collaborator access
3. Jira GitHub integration connected
4. Active Sprint 1, issue keys, assignees and points
5. Github branch list with Jira-linked branch names
6. Jira Development panel showing linked GitHub commits
7. Jira Development panel showing linked PRs and approvals
8. Final Jira Sprint board showing truthful completed/incomplete statuses

Do not fabricate reviews, teammate commits, screenshots or Done statuses.