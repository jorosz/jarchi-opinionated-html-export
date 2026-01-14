<article class="views hidden {{id}}">
  <h2>{{name}}</h2>
  <header>
    {{documentation}}
  </header>
  <h3>Ábra</h3>
  <img src="data:image/png;base64,{{diagram}}">
  <h3>Alkalmazások és Funkciók</h2>
  {{apps_html}}

  <h3>Interfészek</h2>
  <table class="full fixed">
    <thead>
      <tr>
        <th class="sixth">Név</th>
        <th class="sixth">Honnan</th>
        <th class="sixth">Hová</th>
        <th class="third">Leírás</th>
      </tr>
    </thead>

    <tbody>
      {{flows_html}}
    </tbody>
  </table>
</article>
