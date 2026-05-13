<?php
function areoi_render_block_tab_pane( $attributes, $content )
{
	$class 			= 	trim(
		areoi_get_class_name_str( array(
			'tab-pane',
			'fade',
			( !empty( $attributes['active'] ) ? 'show active' : '' ),
			( !empty( $attributes['className'] ) ? $attributes['className'] : '' ),
		) )
		. ' ' .
		areoi_get_display_class_str( $attributes, 'block' )
	);

	$labelledby = !empty( $attributes['labelledby'] )
		? ' aria-labelledby="' . esc_attr( $attributes['labelledby'] ) . '"'
		: '';

	$output = '
		<div ' . areoi_return_id( $attributes ) . ' class="' . areoi_format_block_id( $attributes['block_id'] ) . ' ' . $class . '" role="tabpanel"' . $labelledby . ' tabindex="0">
			' . $content . '
		</div>
	';

	return $output;
}
