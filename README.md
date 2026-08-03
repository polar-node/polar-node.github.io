# polar-node.github.io

Source code for my personal tech blog — **[polar-node // runbooks](https://polar-node.github.io)**.

Linux systems administration, Zabbix, Proxmox, Bacula, and infrastructure automation — documented as I actually build and break things, not rehashed from docs.

## Stack

- [Hugo](https://gohugo.io/) — static site generator
- [Mainroad](https://github.com/Vimux/Mainroad) — theme (as a git submodule)
- Hosted on GitHub Pages, deployed via GitHub Actions on every push to `main`

## Local development

```bash
git clone --recurse-submodules git@github.com:polar-node/polar-node.github.io.git
cd polar-node.github.io
hugo server -D
```

Open `http://localhost:1313`.

## Structure

```
content/posts/    # blog posts (markdown)
content/about/    # about page
layouts/          # site-specific overrides of theme partials/templates
static/           # custom CSS, JS, images
hugo.toml         # site configuration
```

## License

Site content (posts, writing) is mine. Theme is Mainroad's own license (GPL-2.0). Code snippets within posts may carry their own licenses as noted in the relevant project repos.
