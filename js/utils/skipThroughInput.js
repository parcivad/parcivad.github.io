/**
 * JQuery reacting to keyboard to skip through login
 */
$(".skipThrough").on('keydown', 'input', function (event) {
    if (event.which === 13) {
        event.preventDefault();
        let $this = $(event.target);
        let index = parseFloat($this.attr('data-index'));
        $('[data-index="' + (index + 1) + '"]').focus().click();
    }
});