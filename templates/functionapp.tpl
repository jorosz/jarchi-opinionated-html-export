<h4>{{appName}}</h4>


<% if (appDescription) { %>
	<div class="indented">{{appDescription}}</div>
<% } %>


<% if (functions.length) { %>
	<table class="full fixed functions-table indented">
	<thead>
		<tr>
		<th class="third">Név
		<th class="two-third">Leírás
		<tbody>
			{{functions_html}}
	</table>
<% } %>


