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

## Branches

- `template` — where the current site lives, and where work happens.
- `main` — stale, still on the pre-rebuild version. Needs `template` merged in
  before the site goes live.

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
