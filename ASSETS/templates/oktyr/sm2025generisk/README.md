# Styling

## Main layout

The SPXWindow container is styled as a flexbox, aligned to the bottom-left corner (align-items: flex-end and justify-content: flex-start) and absolutely positioned on the page. It creates a responsive arrangement.

## Graphics section

The #gfx flexbox is column-oriented (flex-direction: column) with a border on its left side, styled using var(--theme-accent-width) and var(--theme-brandColor). 

The opacity is set to 0, so it's initially invisible. And will be animated into visibility. 

Positioned at 5% above the bottom viewport height (bottom: 5vh) and with transform-origin: bottom left, this indicates an anchor point for animations or transformations.

## Content boxes

#box1: Larger text (3vw size), bold font ('BOLD'), and padded for spacing. This makes it stand out visually as a prominent element.

#box3 and #box4: Smaller text (2vw size), a regular font ("REGU"), and also padded. These provide details with their padding ensuring legibility.

## Details

The #details container is row-oriented (flex-direction: row). This organizes its children (#box3 and #box4) horizontally, creating a consistent layout.

## Text elements

The #text2 and #text3 elements are padded to ensure proper spacing relative to their containing boxes. The #number element was added to the left of name field on the first row of the bottom-left overlay. It will dynamically resize its width and keep the padding between it and the name element.