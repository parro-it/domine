import parseTag from './parse-tag';

function handleClassName(copyArg, vdom) {
  if ('className' in copyArg) {
    let classes = copyArg.className;
    if (typeof classes === 'string') {
      classes = classes.split(/\s/);
    } else if (typeof classes === 'object' && !Array.isArray(classes)) {
      classes = Object.keys(classes).filter(className => classes[className]);
    }
    const targetClasses = vdom.properties.className || (vdom.properties.className = []);
    for (let singleClass of classes) {
      if (targetClasses.indexOf(singleClass) === -1) {
        targetClasses.push(singleClass);
      }
    }
    delete copyArg.className;
  }
}

function handleStyle(copyArg, vdom) {
  if ('style' in copyArg) {
    let style = copyArg.style;
    if (typeof style === 'string') {
      style = Object.assign(...style.match(/\w+\s*:\s*\w+/g)
        .map( r => {
          const pair = r.split(':');
          return { [pair[0].trim()]: pair[1].trim() };
        }));
    }

    vdom.properties.style = Object.assign(vdom.properties.style || {}, style);
    delete copyArg.style;
  }
}

function isVdom(obj) {
  return typeof obj === 'object' && obj.__vdom === true;
}

function evaluateArg(arg, vdom) {
  if ( arg === null || arg === undefined ) {
    vdom.children.push('');
  } else if (Array.isArray(arg)) {
    arg.forEach(a => evaluateArg(a, vdom));
  } else if ( isVdom(arg) ) {
    vdom.children.push(arg);
  } else if (typeof arg === 'object') {
    const copyArg = Object.assign({}, arg);
    handleClassName(copyArg, vdom);
    handleStyle(copyArg, vdom);
    Object.assign(vdom.properties, copyArg);
  } else if ( ['string', 'number', 'boolean'].indexOf(typeof arg) !== -1 ) {
    vdom.children.push(arg.toString());
  }
}

export default function domine(tagName, ...args) {
  const vdom = {
    __vdom: true,
    tagName: null,
    properties: {},
    children: []
  };

  if (typeof tagName === 'string') {
    vdom.tagName = parseTag(tagName, vdom.properties);
  } else if ( isVdom(tagName) ) {
    Object.assign(vdom, tagName);
  } else {
    throw new TypeError('tagName must be a string or vdom object.');
  }

  evaluateArg(args, vdom);

  return vdom;
}

export function widget(...args) {
  const vdom = domine(...args);
  return (...otherArgs) => {
    return domine(vdom, otherArgs);
  };
}


