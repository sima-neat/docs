# Docs CI failure notifications

`workflows/ci-failure-notification.yml` calls the organization's shared
`sima-neat/.github/.github/workflows/vulcan-notify-slack.yml@main` workflow.
It posts actionable failures from **Vulcan SysDoc** and **Release Announcement
Pages** to Slack channel **C0BPFND35TN**, then appends automatic failure analysis
as a reply in the same thread. Evidence collection and analysis use the exact
source run ID and attempt number.

The listener covers pushes and manual runs on `main`, `develop`, and
`vulcan-dev-sysdoc`. Successful, cancelled, and pull request runs do not alert.
The complete source workflow is monitored, including configuration, build,
publication, and deployment failures. Changes to source workflow display names
must also update the listener's `workflows` list.

## Organization setup

1. Have IT provision the organization Actions secret `SLACK_BOT_TOKEN` and grant
   `sima-neat/docs` access to it. The Slack bot needs `chat:write` permission.
2. Invite that bot to channel `C0BPFND35TN`.
3. Ensure this repository can call the shared workflows and use the organization's
   `[self-hosted, bridge]` runner. Analysis uses the existing Codex ChatGPT login
   on that runner; no OpenAI API key is passed by this repository.
4. Merge the listener into the default branch, `main`. GitHub only registers
   `workflow_run` listeners from the default branch.

The channel is versioned in the caller workflow; no channel variable is needed.
Only the Slack secret is explicitly forwarded to the shared workflow.

## Verification after provisioning

On the next eligible failed source run, verify the listener posts the failed jobs
and run link to `C0BPFND35TN`, followed by a diagnosis in the parent message's
thread. Check that the diagnosis refers to the correct run attempt. The initial
notification is independent of analysis completion; an unavailable bridge may
leave analysis queued. Rerunning the listener creates another parent/reply pair.

Local workflow linting checks syntax and expressions, but does not verify Slack
credentials, channel membership, shared-workflow access, or bridge availability.
