$ = require 'jquery'

do fill = (item = 'Them most creative minds in Art') ->
	$('.tagline').append "#{item}"
fill