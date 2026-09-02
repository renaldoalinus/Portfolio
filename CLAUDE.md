# Renaldo — Portfolio

Personal portfolio site. Astro, static output, deployed as a plain `dist/` build.

## Git identity — do not get this wrong

This machine has several GitHub identities on it. Only one of them has anything
to do with this project.

**The only valid remote:**

```
git@github-personal:renaldoalinus/Portfolio.git
```

**The only valid commit author:**

```
Renaldo <renaldo.alin.us@gmail.com>
```

Set locally in this repo, deliberately overriding the global config.

### Never use these here

- **`renaldo.alin@cloover.co`** — work address, set as the *global* git author.
  Never author a commit in this repo with it.
- **`renaldo.alin@gmail.com`** — a dead address Renaldo lost access to years ago.
  It was wrongly set as this repo's author until 2026-08-30 and stamped the first
  16 commits. Never reintroduce it.
- **`gh` CLI** — logged in as `renaldoalin-cloover`, the *work* GitHub account.
  Do not use `gh` in this repo for anything. Plain `git` over SSH only, which
  authenticates with `~/.ssh/id_ed25519_personal`.

Before any commit or push, verify:

```sh
git remote -v          # must be renaldoalinus/Portfolio
git config user.email  # must be renaldo.alin.us@gmail.com
```

## Scope — stay inside this project

This machine also runs Claude sessions on Cloover company work. That work is a
separate repo with a separate remote and is never in scope here.

**Do not read or write anything outside `/Users/renaldo/orca/Portfolio-structure`
without asking first.** That includes other directories under `~/orca`, home
directory dotfiles, and any Cloover repo or workspace.

Two known exceptions, both of which still warrant saying so out loud when they
come up:

- **`/Users/renaldo/orca/Portfolio/`** holds the repo's actual `.git`
  database, so the folder has to keep existing — but it is not a place to
  work. Its HEAD is deliberately detached so that `main` stays free for this
  directory. Do not check a branch out there or commit in it.
- **`.git/config`** lives in that other directory because worktrees share one
  `.git`. Repo-local git config therefore affects both working copies.

Scratch files go in the session scratchpad, never in the project or /tmp.

## Branches

One branch: `main`. Renaldo works on this alone — there is no review step and
no parallel development, so a branching model would be ceremony with no payoff.
Commit to `main`, push, done. (An earlier `template`/`structure` split existed
and was collapsed on 2026-09-02; both are deleted, locally and on the remote.)

## Deploying

Static build, no server-side anything.

- Build: `npm run build` → `dist/`
- Host: connect the repo, build command `npm run build`, output directory `dist`

Set `site` in `astro.config.mjs` once the domain is decided — needed for
canonical URLs, OG tags and the sitemap.

## Known issue

`public/work/` holds ~115MB of unoptimized case-study images (84 files, worst is
a single 14MB PNG). Because they live in `public/`, Astro serves them untouched.
Moving them into `src/assets/` so they go through the image pipeline would cut
the site to roughly 25–30MB. See `src/pages/shots.astro` for the pattern.
