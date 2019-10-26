# MDNB: Markdown Notebooks

Live at https://mdnb.bloomqu.ist/

## Features

### Full Markdown Support

MDNB uses [Marked](https://github.com/markedjs/marked/) to parse your Markdown, so any standard Markdown is supported.

Additionally, there is support for [GFM Task Lists](https://github.blog/2013-01-09-task-lists-in-gfm-issues-pulls-comments/):

- [ ] Something to do
- [x] Something done

GFM tables:

colA | colB
--- | ---
0.123 | 0.456

### Inserted image support

Adding screenshots or other images on your clipboard to your notebook can be done by just pasting them into the active notebook:

![Pasted image](https://i.imgur.com/XjSgIvG.gif)

Or by dragging and dropping them in:

![Drag n dropped image](https://i.imgur.com/STUUsDw.gif)

### Pages

A notebook can consist of multiple pages. You can create pages, delete pages, and reorder pages by dragging and dropping:

![Page stuff](https://i.imgur.com/jw8KkSf.gif)

### Resizable Panes

The sidebar, editor, and renderer are all resizable:

![Resizable panes](https://i.imgur.com/vtMtSiM.gif)

## Development

To install dependencies, run `yarn`.

Then, run `yarn start` to start the app on port 3000.

To test GitHub login, you'll need to supply a client ID and secret from GitHub.com in the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables. On Mac and Linux:

`GITHUB_CLIENT_ID=your-client-id GITHUB_CLIENT_SECRET=your-client-secret yarn start`

To run the Cypress integration tests, do `yarn run cypress:open`.

To run the unit tests, do `yarn run test`.
