<article class="views" id="view-{{viewId}}">
  <h2>{{viewName}}</h2>
  <header>
    {{documentation}}
  </header>
  <h3>{{labels.diagramSection}}</h3>
  <div class="diagram-scroll">
    <div class="diagram-controls">
      <button class="zoom-btn" title="Zoom in">+</button>
      <button class="zoom-btn" title="Zoom out">&#x2212;</button>
      <button class="zoom-btn" title="Reset">&#x21BA;</button>
    </div>
    <svg class="diagram" width="{{svgWidth}}" height="{{svgHeight}}" viewBox="{{svgViewBox}}"><use href="#diagram-{{viewId}}"/></svg>
  </div>
  <h3>{{labels.appsSection}}</h3>
  {{apps_html}}

  <h3>{{labels.interfacesSection}}</h3>
  <table class="full fixed indented">
    <thead>
      <tr>
        <th class="sixth">{{labels.colName}}</th>
        <th class="sixth">{{labels.colFrom}}</th>
        <th class="sixth">{{labels.colTo}}</th>
        <th class="third">{{labels.colDescription}}</th>
      </tr>
    </thead>

    <tbody>
      {{flows_html}}
    </tbody>
  </table>
</article>
