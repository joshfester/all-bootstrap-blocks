<?php
function areoi_render_block_nav_and_tab_item( $attributes, $content )
{
	$url 		= !empty( $attributes['url'] ) ? $attributes['url'] : '';
	$is_tab 	= ( $url !== '' && strpos( $url, '#' ) === 0 );

	$class 			= 	trim(
		areoi_get_class_name_str( array(
			'nav-link',
			( !empty( $attributes['className'] ) ? $attributes['className'] : '' ),
			( !empty( $attributes['active'] ) ? 'active' : '' ),
			( !empty( $attributes['disabled'] ) ? 'disabled' : '' ),
		) )
		. ' ' .
		areoi_get_display_class_str( $attributes, 'flex' )
	);

	$block_class = areoi_format_block_id( $attributes['block_id'] );
	$text 		 = !empty( $attributes['text'] ) ? wp_kses_post( $attributes['text'] ) : '';

	if ( $is_tab ) {
		$controls 	= ltrim( $url, '#' );
		$button_id 	= esc_attr( $controls . '-tab' );
		$selected 	= !empty( $attributes['active'] ) ? 'true' : 'false';

		$button = '<button id="' . $button_id . '"';
		$button .= ' class="' . $block_class . ' ' . $class . '"';
		$button .= ' type="button"';
		$button .= ' data-bs-toggle="tab"';
		$button .= ' data-bs-target="' . esc_attr( $url ) . '"';
		$button .= ' role="tab"';
		$button .= ' aria-controls="' . esc_attr( $controls ) . '"';
		$button .= ' aria-selected="' . $selected . '"';
		if ( !empty( $attributes['url_title'] ) ) {
			$button .= ' title="' . esc_attr( $attributes['url_title'] ) . '"';
		}
		if ( !empty( $attributes['disabled'] ) ) {
			$button .= ' disabled';
		}
		$button .= '>' . $text . '</button>';

		$inner = $button;
	} else {
		$anchor_open = '<a ' . areoi_return_id( $attributes ) . ' class="' . $block_class . ' ' . $class . '"';
		if ( $url !== '' ) {
			$anchor_open .= ' href="' . esc_url( $url ) . '"';
		}
		if ( !empty( $attributes['url_title'] ) ) {
			$anchor_open .= ' title="' . esc_attr( $attributes['url_title'] ) . '"';
		}
		if ( !empty( $attributes['rel'] ) ) {
			$anchor_open .= ' rel="' . esc_attr( $attributes['rel'] ) . '"';
		}
		if ( !empty( $attributes['linkTarget'] ) ) {
			$anchor_open .= ' target="' . esc_attr( $attributes['linkTarget'] ) . '"';
		}
		$anchor_open .= '>';

		$inner = $anchor_open . $text . '</a>';
	}

	$output = '
		<li class="nav-item" role="presentation">
			' . $inner . '
		</li>
	';

	return $output;
}
