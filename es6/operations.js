/**
 *    create and return a [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)
 *    from a list of domine vdom
 */
export function create(...vdoms) {
  return {
    operation: 'create',
    fragment: vdoms
  };
}

/**
 *    remove all children from nodes
 *    that matches given selector
 */
export function clear(selector) {
  return {
    operation: 'clear',
    selector
  };
}

/**
 *    creates a [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)
 *    from vdom, and append it to children of all nodes
 *    that matches given selector
 */
export function append(selector, ...vdoms) {
  return {
    operation: 'append',
    selector,
    fragment: vdoms
  };
}

/**
 *    creates a [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)
 *    from vdom, and replace with it children of all nodes
 *    that matches given selector
 */
export function replace(selector, ...vdoms) {
  return {
    operation: 'replace',
    selector,
    fragment: vdoms
  };
}

/**
 *    creates a [DOM Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
 *    from vdom, and copy it over nodes that matches given selector
 */
export function assign(selector, vdom) {
  return {
    operation: 'assign',
    selector,
    element: vdom
  };
}


/**
 *    Return an array containing requested properties
 *    from each nodes that matches given selector
 */
export function query(selector, properties) {
  return {
    operation: 'query',
    selector, properties
  };
}
