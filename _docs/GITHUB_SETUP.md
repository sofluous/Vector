# Create a GitHub repository and push an existing project

Instructions for Windows PowerShell, including the VS Code integrated terminal. Reviewed 2026-10-28.

## This project's setup

The GitHub repository was created manually through the website. Do not create it again. Local configuration checked when writing this guide:

| Setting | Value |
| --- | --- |
| Local folder | `C:\Users\svwhu\_PROJECTS\_CODE\_Vectors` |
| Local branch | `main` |
| Remote name | `origin` |
| Remote URL | `https://github.com/sofluous/Vector.git` |

Repository creation is user-confirmed; these notes do not establish whether a push has succeeded. For this project, start at **Inspect the local repository**, then **Commit and push**. The creation sections are preserved for future projects.

## Understand the separate steps

| Action | Tool | What it does |
| --- | --- | --- |
| Initialize locally | `git init` | Creates local Git history storage; does not create anything on GitHub |
| Create on GitHub | Website or `gh repo create` | Creates the hosted repository |
| Configure remote | `git remote add` or `git remote set-url` | Stores the address locally; does not create the hosted repository or upload files |
| Commit | `git commit` | Records staged changes in local history |
| Push | `git push` | Uploads local commits to the remote |

`git` manages version history. GitHub CLI (`gh`) manages GitHub features from the terminal. Installing Git does not automatically install `gh`.

## Inspect the local repository

Open PowerShell, or use **Terminal > New Terminal** in VS Code:

```powershell
cd C:\Users\svwhu\_PROJECTS\_CODE\_Vectors
git status
git branch --show-current
git remote -v
```

For a different project, change the folder, account, repository name, and branch in the examples. Run commands one step at a time; check the output before continuing. This project already has Git initialized, so no `git init` is needed.

## Option A: Create through the GitHub website

Use this only when the hosted repository does not exist yet.

1. Sign in at [GitHub's new repository page](https://github.com/new).
2. Choose the owner and repository name. For this project, these are `sofluous` and `Vector`.
3. Choose Private or Public. Private is a suitable starting point while this project's reference-image rights remain unresolved.
4. Leave README, .gitignore, and license initialization unchecked. Starting empty avoids adding a separate initial history to an existing local project; these files can be added locally later.
5. Click **Create repository**, then copy its HTTPS URL.

Continue with **Configure the remote**. GitHub documents this workflow in [Adding locally hosted code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## Option B: Create from the terminal with GitHub CLI

This is an alternative to Option A, not an additional step. Skip repository creation for the current project because it already exists.

### Install and authenticate

Check whether GitHub CLI is available:

```powershell
gh --version
```

If PowerShell does not recognize `gh`, install it:

```powershell
winget install --id GitHub.cli --source winget
```

Close and reopen the terminal application afterward. For an integrated terminal, restart VS Code so it receives the updated PATH, then retry `gh --version`. See the [official Windows installation instructions](https://github.com/cli/cli/blob/trunk/docs/install_windows.md).

Sign in and configure Git to use GitHub CLI authentication:

```powershell
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
gh auth status
```

Follow the device-code/browser prompts and confirm the intended account. Authentication is a one-time setup per environment unless credentials expire or the account changes. This terminal workflow uses a browser for sign-in; repository creation itself runs through the CLI. See [gh auth login](https://cli.github.com/manual/gh_auth_login) and [gh auth setup-git](https://cli.github.com/manual/gh_auth_setup-git).

### Create the hosted repository

For a future project whose GitHub repository does not yet exist, replace `YOUR-REPOSITORY` with its intended name:

```powershell
gh repo create sofluous/YOUR-REPOSITORY --private
```

Use `--public` instead if that is your intended visibility. This command creates the hosted repository without cloning, uploading commits, or configuring a local remote. Follow with **Configure the remote** and **Commit and push**. Keeping these operations separate makes their effects easier to understand. See [gh repo create](https://cli.github.com/manual/gh_repo_create).

## Configure the remote

Inspect first:

```powershell
git remote -v
```

If `origin` already has the correct URL, leave it as is. That is the current configuration for Vectors.

If no `origin` exists, add it:

```powershell
git remote add origin https://github.com/sofluous/Vector.git
```

If `origin` exists but its URL is wrong, change it instead of adding another:

```powershell
git remote set-url origin https://github.com/sofluous/Vector.git
git remote -v
```

For another project, substitute its URL. These commands edit local connection settings, not the hosted repository. See [Managing remote repositories](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories).

## Commit and push

Review the working changes and stage the files you intend to include:

```powershell
git status
git diff
git add .
git diff --cached --stat
git diff --cached
```

`git add .` stages all new, changed, and deleted files under the current folder, except ignored files. Run it from the project root after checking the file list; use `git add path/to/file` for selective staging. Do not include credentials, local environment secrets, or unwanted generated files.

Record the staged changes, choosing a message that describes them:

```powershell
git commit -m "Document GitHub repository setup and publishing"
```

If Git reports **nothing to commit**, existing commits can still be pushed. Uncommitted changes are not included in a push.

Push the existing `main` branch and establish its upstream:

```powershell
git push -u origin main
```

`origin` names the remote. `main` names the branch. `-u` sets the tracking relationship so future pushes can use just `git push`. If your branch has another name, use the result of `git branch --show-current` instead of `main`.

Verify:

```powershell
git status -sb
git branch -vv
```

Confirm the branch tracks `origin/main` and the push completed without an error, then refresh the repository's GitHub page to inspect the uploaded files. Having an `origin` entry alone is not evidence of a successful push.

## Everyday workflow

After making changes:

```powershell
git status
git diff
git add .
git diff --cached --stat
git commit -m "Describe the change"
git push
```

For changes made elsewhere, start with a clean working tree, run `git fetch origin`, then inspect `git status -sb`. If the branch is only behind, `git pull --ff-only` updates it without creating a merge commit. If histories diverged, inspect before choosing a merge or rebase.

## Common problems

| Message or symptom | Meaning and next step |
| --- | --- |
| `gh` is not recognized | Install GitHub CLI and restart the terminal host/VS Code to refresh PATH |
| `remote origin already exists` | Inspect `git remote -v`; keep the correct URL or use `git remote set-url` |
| `Repository not found` | Check the owner/name, whether the repository exists, and whether the signed-in account has access; private repositories can also produce this error |
| Repository already exists during `gh repo create` | Skip creation; connect the existing repository and push |
| `nothing to commit` | There are no staged changes to record; existing commits can still be pushed |
| `src refspec main does not match any` | Check the current branch and whether at least one commit exists with `git branch --show-current` and `git log -1` |
| Push rejected as non-fast-forward | The remote has history you do not have, possibly from a website-created README. Fetch and inspect it before integrating; do not force-push over unknown commits |
| Sign-in or permission failure | Check `gh auth status`, sign in to the correct account, and run `gh auth setup-git`; GitHub account passwords are not used as HTTPS Git passwords |

These instructions were reviewed against official documentation and this project's local configuration. No repository was created, no credentials were changed, and no commit or push was performed while writing this guide.
