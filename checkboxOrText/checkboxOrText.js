// To apply this to a div give it the class checkboxOrText e.g. <div class="someClass anotherClass checkboxOrText">,,,</div>
if (typeof(initCheckbox) === "undefined") {
  var initCheckbox = function() {
    console.log('Initializing page-specific behavior for input tags...');
	var selector = $('div.checkboxOrText input');
	selector.focus(function() {
		if (this.type === "text") {
			selector.filter("input[type='checkbox']").each(function () {
				$(this).prop('checked', false);
			});
		}
		if (this.type === "checkbox") {
			selector.filter("input[type='text']").each(function () {
				$(this).val('');
			});
		}
    });
  }
  initCheckbox();
} else {
  console.log("Encountered definition for checkbox logic function which has already been parsed. Skipping...");
}