# o-layers [![CircleCI](https://circleci.com/gh/Financial-Times/o-layers.png?style=shield&circle-token=53572740840f94b157619c8e5b4ecd175ced733a)](https://circleci.com/gh/Financial-Times/o-layers)

This module provides a namespace for managing modules that make use of the z-axis, providing events, css classes and coding conventions that modules *must* use to interact with other modules that use the z-axis

## Terminology and concepts

### Layer
A *Layer* refers to the owned DOM, or portion of owned DOM, of any module that makes use of the z-axis.

### Layer context

A *Layer context* refers to a HTML element where every layer lying within it should only be concerned with other layers if they also lie within it. e.g. Within an interactive graphic any popups only need concern themselves with the state of other popups which also overlay the same graphic; they can safely disregard popups overlaying a different graphic. 

`document.body` is the default layer context.

### `o-layers__context` class

This class should be added to any element (other than `document.body`) which needs to behave as a layer context. All *layers* must either

* be a descendant of an element with the class `o-layers__context` and *should not* overlap any part of the page not contained within this element
* not be a descendant of any element with the class `o-layers__context` (in which case `document.body` provides the default layer context)

In general a new layer context should only be defined if you are very sure any layers it contains will never interfere (either through directly overlapping or by leaving a distracting, no longer needed UI element) with anything outside of it.

### CSS

All layer contexts (with the exception of `document.body`) *should* have the following css properties defined (`o-layers` does not provide sass for this as there is considerable variation in acceptable values)

* `position` - *must* not be `static`
* `z-index` - *must* be `0` or higher (this mitigates problems with z-index of layers in nested layer contexts)

#### Javascript helper

`oLayers#getLayerContext(el)` will return the given element's layer context.

 
## Events

The following custom events *must* be fired on a layer's closest ancestor with the class `o-layers__context` (or on `document.body` if no such element exists). The `Event.details` property must define all the properties from the list below that are truthy for the given layer

* *el* - Reference to the layer's DOM node

### `oLayers.new`

This should be fired immediately *before* any layer is added to the DOM/displayed. 

### `oLayers.close`

This should be fired immediately *after* any layer is removed from the DOM/hidden.

## Coding conventions

Any module which controls one or more layers *must* implement the following patterns:

* Listen for the event `oLayers.new` on the layer context of each of its layers and react to these events by either:

	1. closing the layer
	2. inspecting the new layer's owned DOM to determine what action should be taken.

----

## License

Copyright (c) 2016 Financial Times Ltd. All rights reserved.

This software is published under the [MIT licence](http://opensource.org/licenses/MIT).
