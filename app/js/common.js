
"use strict";
jQuery(document).ready(function ($) {
	$('input,textarea').focus(function(){
		$(this).data('placeholder',$(this).attr('placeholder'))
		$(this).attr('placeholder','');
	});
	$('input,textarea').blur(function(){
		$(this).attr('placeholder',$(this).data('placeholder'));
	});
	$('.dropdown').click(function() {
		$(this).find('.dropdown-menu').toggleClass('show');
	});
	$('.dropdown-menu').children().click(function() {
		var text = $(this).text();
		$('.dropdown-toggle').html(text);
	});

	$('.down-col').click( function(){
		if (+$('.col-tovar').val() > 1) {
			removeTovar();
		}	
	})
	$('.up-col').click( function(){
		if (+$('.col-tovar').val() >= 1) {
			addTovar();
		}	
	})
	$('.mini-img').click( function() {
		$('.big-img').attr('src', $(this).attr('src'))
		
	})
	$('#slsl').carousel({
		interval: false
	});
	function removeTovar() {
		$col = +$('.col-tovar').val();
		$('.col-tovar').val(--$col);
	}
	function addTovar() {
		$col = +$('.col-tovar').val();
		$('.col-tovar').val(++$col);
	}
	
});