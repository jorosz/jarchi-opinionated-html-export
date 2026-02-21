// Shared export utilities for jArchi HTML export scripts
// Requires: _, marked (set as globals by calling script), jArchi globals ($, readFully, $.model, Java.type)

// Markdown options — module-level constant, marked is a global set before this module is loaded
const _mdRenderer = new marked.Renderer();
_mdRenderer.heading = function (text, _level) {
  return '<p>' + text + '</p>\n';
};
const mdOptions = {
  gfm: true,
  breaks: false,
  smartypants: true,
  renderer: _mdRenderer
};

// Converts a raw SVG string into embeddable inner content for a <symbol>.
// The <svg> root carries presentation attributes (stroke, fill, font-size, etc.)
// that child elements inherit. We preserve them on a wrapping <g> so that
// elements without explicit values (e.g. connection lines) still render correctly.
function svgToSymbolInner(svgString) {
  const svgTagMatch = svgString.match(/<svg([\s\S]*?)>/);
  const attrs = svgTagMatch
    ? svgTagMatch[1]
        .replace(/\s+xmlns(?::\w+)?="[^"]*"/g, '')
        .replace(/\s+(?:viewBox|width|height|version)="[^"]*"/g, '')
    : '';
  const body = svgString
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/<svg[\s\S]*?>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
  return '<g' + attrs + '>\n' + body + '\n</g>';
}

// Converts a hyphenated or camelCase type string to space-separated proper case,
// e.g. "flow-relationship" → "Flow Relationship"
function properCase(str) {
  return str
    .replace(/\w*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
    .replace(/-/g, ' ');
}

// Reads the panzoom vendor script from resources/ and returns it as an inline <script> tag
function loadScripts(rootDir) {
  const panzoom = readFully(rootDir + 'resources/panzoom.min.js', 'UTF-8');
  const scriptTag = '<script>\n' + panzoom + '\n</script>';
  return { scriptTag };
}

// Reads all CSS (icon font, Picnic framework, main.css), concatenates them, and returns
// a combined inline <style> tag plus the absolute file path for dev/debug use
function loadStyles(rootDir) {
  const File = Java.type('java.io.File');
  const cssFile = new File(rootDir + 'css/main.css');
  const cssAbsolutePath = 'file://' + cssFile.getAbsolutePath();
  const myCSS = readFully(rootDir + 'css/main.css', 'UTF-8');
  const icon = readFully(rootDir + 'resources/icon.css', 'UTF-8');
  const picnic = readFully(rootDir + 'resources/picnic-custom.css', 'UTF-8');
  const allStyles = [icon, picnic, myCSS].join('\n\n');
  const styleTag = '<style>\n' + allStyles + '\n</style>';
  return { icon, picnic, allStyles, styleTag, cssAbsolutePath };
}

// Reads, compiles, and wraps a template so labels are always in context
function loadTemplate(rootDir, labels, name) {
  var tpl = _.template(readFully(rootDir + 'templates/' + name, 'UTF-8'));
  return function(data) {
    return tpl(_.extend({}, data, { labels: labels }));
  };
}


// Traverses folders using jArchi's built-in find and returns a flat sorted array of view objects.
function collectViews(folders) {
  const views = [];
  _(folders).each((f) => $(f).find('view').each((v) => views.push(v)));
  return _.sortBy(views, (v) => v.name);
}

// Takes a flat array of jArchi view objects and extracts all data needed for rendering.
function collectViewData(views) {
  return _(views).map((v) => {
    const svgString = $.model.renderViewAsSVGString(v, { embedFonts: false });
    const viewBoxMatch = svgString.match(/viewBox="([^"]*)"/);
    const svgViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';
    const vbParts = svgViewBox.split(/\s+/);
    const svgWidth = parseFloat(vbParts[2]) || 100;
    const svgHeight = parseFloat(vbParts[3]) || 100;
    const svgInner = svgToSymbolInner(svgString);

    let viewData = {
      viewId: v.id,
      viewName: _.escape(v.name),
      svgViewBox: svgViewBox,
      svgWidth: svgWidth,
      svgHeight: svgHeight,
      svgInner: svgInner,
      documentation: marked.parse(v.documentation || '', mdOptions),
      functions: [],
      components: [],
      apps_html: '',
      flows: [],
      flows_html: '',
      checked: ''
    };

    $(v)
      .find('application-function')
      .each(function (fun) {
        let ec = $(fun.concept);
        let appComponent = ec.inRels('realization-relationship').sourceEnds().filter('application-component').first();
        let fObj = {
          name: _.escape(fun.name),
          id: fun.id,
          applicationName: appComponent ? appComponent.name : 'N/A',
          applicationID: appComponent ? appComponent.id : 'default',
          documentation: marked.parse(fun.documentation || '', mdOptions)
        };
        viewData.functions.push(fObj);
        console.log(fun + ' => ' + fObj.applicationName + ' ' + fObj.applicationID);
      });

    $(v)
      .find('application-component')
      .each((app) => {
        let appC = app.concept;
        console.log(app + ' ' + app.id + ' ' + appC.id);
        let aObj = {
          appName: app.name,
          appDescription: marked.parse(app.documentation || '', mdOptions),
          appID: appC.id,
          functions: _.where(viewData.functions || [], { applicationID: appC.id }),
          functions_html: ''
        };
        viewData.components.push(aObj);
      });

    $(v)
      .find('flow-relationship')
      .each((r) => {
        let fwObj = {
          relationshipName: _.escape(r.name),
          relationshipType: properCase(r.type),
          relationshipSource: _.escape(r.source.name),
          relationshipTarget: _.escape(r.target.name),
          relationshipDocumentationText: _.escape(r.documentation).replace(/\n/g, '<br>'),
          relationshipDocumentationMarkdown: marked.parse(r.documentation || '', mdOptions)
        };
        viewData.flows.push(fwObj);
      });

    return viewData;
  });
}

// Renders flows_html and apps_html on each view data object using the provided compiled templates.
// Must be called after collectViewData and before the view templates are rendered.
function renderViewCollection(viewCollection, { tplRelationship, tplFunction, tplFunctionApp }) {
  _(viewCollection).each((v) => {
    v.flows_html = _.chain(v.flows || [])
      .sortBy((f) => f.relationshipName)
      .map((f) => (f.relationshipName ? tplRelationship(f) || '' : ''))
      .join('\n')
      .value();

    v.apps_html = _.chain(v.components || [])
      .sortBy((a) => a.appName)
      .map((app) => {
        app.functions_html = _.chain(app.functions || [])
          .sortBy((f) => f.name)
          .map((fun) => tplFunction(fun) || '')
          .join('')
          .value();
        return tplFunctionApp(app) || '';
      })
      .join('')
      .value();
  });
}

module.exports = { mdOptions, loadTemplate, loadStyles, loadScripts, collectViews, collectViewData, renderViewCollection };
