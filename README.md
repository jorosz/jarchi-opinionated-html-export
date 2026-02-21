# An Opinionated Single-page HTML Export for jArchi and Archi

\*Customized version of the fantastic HTML export tool for jArchi. This is a
major rewrite that produces a very opinionated export of a very opinionated
Archimate model into a single HTML page.

It can be used to export models that highlight applications, application flows
(interfaces) and application functions in order to support a high level
conceptual application design.

The scripts exports all views from the selected folder alongside the views
diagram, and generates documentation for each view.

Another script is also provided that generates multiple HTML files, one per view.

Based on https://github.com/archi-contribs/jarchi-single-page-html-export,
Copyright (c) 2020 Phillip Beauvoir & Jean-Baptiste Sarrodie

### Scripts

**`Single-page HTML Export.ajs`** — exports all views into a single self-contained HTML file.
The output includes a collapsible sidebar with a navigation tree, per-view radio button
visibility rules (generated as inline CSS), all SVG diagrams embedded as `<symbol>` elements,
and the full application/function/flow tables for every view. The user is prompted for a save
location; the default filename is `<model name>-<YYYYMMDD>.html`.

**`Multi HTML export.ajs`** — exports one HTML file per view into a user-selected output folder.
Each file is a minimal single-view report: the diagram, its application component table, and
its flow table. There is no sidebar or navigation tree. The filename for each file is
`<model name>-<view name>.html`.

The two scripts share all data collection and rendering logic via `libs/export-common.js`.
The main difference is that the single-page script builds the navigation tree, visibility
CSS rules, and the "show all views" control on top of the shared output, while the multi-page
script simply iterates over the view collection and writes one file per entry.

### Setup

The `resources/` and `css/` vendor files are managed via npm. Run the following
once after cloning to install and copy the vendored assets:

```
npm install
```

This copies Picnic CSS, the icon font, panzoom, and other dependencies into the
`resources/` directory used by the export scripts.

### Language customisation

All user-visible strings in the exported HTML are defined in
`templates/labels.json`. Edit that file to translate the output or change any
label without touching the templates or scripts.

### Export content

The meta-model for the export is very opinionated and therefore only a selected
number of Archimate concepts are being used and exported:

- Applications and modules shall be represented as Application Component
  concepts.
- Flow relationships represent data exchanges (i.e. interfaces) amongst those
  components.
- Application Functions concepts (bound to Application Components via
  Realization Relationship) represent the functionality that will be
  represented.

The export creates a table with all applications, their realized functions and
their flows for each view.

### Features

**SVG pan and zoom** — each diagram supports pan (click and drag) and zoom
(mouse wheel or pinch). A reset button in the top-right corner of the diagram
area restores the original view. The thin strip on the left edge of the diagram
can also be scrolled to navigate large diagrams.

**Show all views** — the sidebar contains an "All views" option that reveals
every view at once. This is intended for printing or full-model export.

**Print support** — the layout reflows correctly for print. The header and
sidebar are hidden, and all views expand to their natural height so that a
browser print-to-PDF produces a complete multi-page document.

### Other notable changes:

- the single page view has *no tabs* as this is more efficient for exporting the model and this
tool will be used in that context more I believe
- the original script implements a hiding logic where each concept in a table row is listed once and
  the shown or hidden depending on view. my version produces the tables for each view, potentially
  duplicating the content. it results in a cleaner code in my opinion at the cost of a slightly
  bigger HTML result (we should be optimizing the generator not the generated content)
- CSS handling logic sanitized, it's in a separate file so it can be linted
- simplified (?) visibility rule creation
- CSS variables replaced the parameters. it's 2026 and IE is dead (finally)!
- tree and navigation with show/hide logic simplified to a single navigation using anchors
  to allow printing and export
- removed markdown checkbox (it's on and that's it. nothing markdown does that should not
  be done in terms of documenting stuff). marked has customized to ignore headers and render them as
  a bold paragraph so h1/h2/h3 will not cause a formatting problem
- all views from all sub folders get included
- the tree view does not show folders, only the views are being listed, folders are being skipped. This
  is for user simplicity. may add it back as an option at one point
- there is an option to show everything, this is meant for exporting or printing the entire set of
  views
- input radio button and tree generation templates are merged

> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
