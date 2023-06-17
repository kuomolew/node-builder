GULP TASKS

gulp - default task - gulp build with watchers to src

gulp start - add slides and shareds from template to src according to structure.json (slides+shared command).

gulp slides - add slides from template to 'src/slides' according to structure.json.

gulp delete_slides - delete from 'src/slides' slides which are absent at strucrure.

gulp shared - add shareds from template to 'src/shared', add structure and settings.

gulp structure - add structure from the root to 'src/shared/js/structure.json'.

gulp settings - add settings from the root to 'src/shared/js/settings.json'.

gulp build - builds dev project (buildStyles + buildHtml + buildJs + buildImg + buildFonts commands)

gulp buildStyles - builds styles
gulp buildHtml - builds HTML
gulp buildJs - builds js
gulp buildImg - builds images
gulp buildFonts - builds fonts

####################################################################

NAVIGATION FUNCTIONS

navi.slides() - get all slides from the structure

navi.currentSlide() - get current slide

navi.next() - go to next slide if some

navi.prev() - go to previous slide if some

navi.goTo('slide') - go to specific slide

////////////////////////////////////////////////////////
TO DO
update goTo function to reach another iva at veeva mode
add chapters functionality
