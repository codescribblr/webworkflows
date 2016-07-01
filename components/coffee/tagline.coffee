$ = require 'jquery'

do fill = (item = 'The most creative minds in Art Production') ->
	$('.tagline').append "#{item}"
fill