# An Opinionated Single-page HTML Export for jArchi and Archi

\*Customized version of the fantastic HTML export tool for jArchi. This is a
major rewrite that produces a very opinionated export of a very opinionated
Archimate model into a single HTML page.

It can be used to export models that highlight applications, application flows
(interfaces) and application functions in order to support a high level
conceptual application design.

The scripts exports all views from the selected folder alongside the views
diagram, and generates documentation for each view.

Copyright (c) 2026 J Orosz

-

Based on https://github.com/archi-contribs/jarchi-single-page-html-export,
Copyright (c) 2020 Phillip Beauvoir & Jean-Baptiste Sarrodie

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

### Other notable changes:

- single page view (no tabs)
- TODO: all tree and navigation with show/hide logic simplified to a single navigation using anchors
  to allow printing and export. also support for a single view should be added
- the original script implements a hiding logic where each concept in a table row is listed once and
  the shown or hidden depending on view. my version produces the tables for each view, potentially
  duplicating the content. it results in a cleaner code in my opinion at the cost of a slightly
  bigger HTML result.
- removed markdown trigger (it's on and that's it)
- all views from all sub folders get included. however, the tree view does not
  show folders, only the views are being listed, folders are being skipped. This
  is for user simplicity.
- changed the logic of managing views: the tabs are gone and everything gets
  rendered on one page
- From the relationships only Flow relationships are exported - we use these to
  represent interfaces

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
