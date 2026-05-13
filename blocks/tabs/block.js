import * as areoi from '../_components/Core.js';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import meta from './block.json';

const ALLOWED_BLOCKS = [ 'areoi/nav-and-tab', 'areoi/div' ];
const BLOCKS_TEMPLATE = [
    [
        'areoi/nav-and-tab', {
            style: 'nav-tabs'
        }, [
            ['areoi/nav-and-tab-item', {
                url: '#tab-1-pane',
                text: 'Tab 1',
                active: true
            } ],
            ['areoi/nav-and-tab-item', {
                url: '#tab-2-pane',
                text: 'Tab 2',
                active: false
            } ]
        ]
    ],
    ['areoi/div', {
        className: 'tab-content'
    }, [
        ['areoi/tab-pane', {
            anchor: 'tab-1-pane',
            labelledby: 'tab-1-pane-tab',
            active: true
        }, [
            ['core/paragraph', {
                content: 'Tab 1 Content'
            } ]
        ] ],
        ['areoi/tab-pane', {
            anchor: 'tab-2-pane',
            labelledby: 'tab-2-pane-tab',
            active: false
        }, [
            ['core/paragraph', {
                content: 'Tab 2 Content'
            } ]
        ] ]
    ] ]
];

const blockIcon = <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10z"/></svg>;

areoi.blocks.registerBlockType( meta, {
    icon: blockIcon,
    edit: props => {
        const {
            attributes,
            setAttributes,
            clientId
        } = props;

        const { block_id } = attributes;
        if ( !block_id ) {
            setAttributes( { block_id: clientId } );
        }

        const { insertBlock, updateBlockAttributes } = useDispatch('core/block-editor');
        const blocks = useSelect((select) =>
            select('core/block-editor').getBlocks(clientId)
        );

        useEffect(() => {
            const navAndTabBlock = blocks.find(
                (block) => block.name === 'areoi/nav-and-tab'
            );
            if (!navAndTabBlock) {
                return;
            }

            const isTabContent = (block) =>
                block.name === 'areoi/div' &&
                ((block.attributes.className || '').split(/\s+/).indexOf('tab-content') !== -1);

            let tabContentBlock = blocks.find(isTabContent);

            // If no tab-content wrapper exists, create one alongside the nav.
            if (!tabContentBlock) {
                insertBlock(
                    wp.blocks.createBlock('areoi/div', { className: 'tab-content' }),
                    undefined,
                    clientId
                );
                // Bail until the next tick — the new wrapper will be picked up
                // by the next render and we'll populate its panes then.
                return;
            }

            const navItems = navAndTabBlock.innerBlocks;

            navItems.forEach((navItem, index) => {
                if (navItem.attributes.url) {
                    return;
                }

                const uniqueId = `tab-${Date.now()}-${index}-pane`;
                const generatedUrl = `#${uniqueId}`;
                const isActive = !!navItem.attributes.active;

                updateBlockAttributes(navItem.clientId, { url: generatedUrl });

                const paneExists = tabContentBlock.innerBlocks.some(
                    (block) =>
                        block.name === 'areoi/tab-pane' &&
                        block.attributes.anchor === uniqueId
                );

                if (!paneExists) {
                    insertBlock(
                        wp.blocks.createBlock('areoi/tab-pane', {
                            anchor: uniqueId,
                            labelledby: `${uniqueId}-tab`,
                            active: isActive,
                        }),
                        undefined,
                        tabContentBlock.clientId
                    );
                }
            });
        }, [blocks]);

        const classes = [
            'tabs',
        ];

        const blockProps = areoi.editor.useBlockProps( {
            className: areoi.helper.GetClassName( classes ),
            style: { cssText: areoi.helper.GetStyles( attributes ) }
        } );

        function onChange( key, value ) {
            setAttributes( { [key]: value } );
        }

        const tabDevice = ( tab ) => {
            var append = ( tab.name == 'xs' ? '' : '-' + tab.name );

            return (
                <>
                    { areoi.DisplayVisibility( areoi, attributes, onChange, tab ) }
                </>
            );
        };

        return (
            <>
                { areoi.DisplayPreview( areoi, attributes, onChange, 'tabs' ) }

                { !attributes.preview &&
                    <div { ...blockProps } data-anchor={ attributes.anchor ? ' : #' + attributes.anchor : '' }>
                        <areoi.editor.InspectorControls key="setting">

                            { areoi.ResponsiveTabPanel( tabDevice, meta, props ) }

                        </areoi.editor.InspectorControls>

                        <areoi.editor.InnerBlocks template={ BLOCKS_TEMPLATE } allowedBlocks={ ALLOWED_BLOCKS } />
                    </div>
                }
            </>
        );
    },
    save: () => {
        return (
            <areoi.editor.InnerBlocks.Content/>
        );
    },
} );
