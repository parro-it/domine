import parseTag from './parse-tag';
export * from './operations';
// import pairs from 'object-pairs';
import zipmap from 'zipmap';

function handleClassName(copyArg, vdom) {
  if ('className' in copyArg) {
    let classes = copyArg.className;

    if (typeof classes === 'string') {
      classes = zipmap(classes.split(/\s/).map(k => [k, true]));
    } else if (Array.isArray(classes)) {
      classes = zipmap(classes.map(k => [k, true]));
    } else if (typeof classes !== 'object') {
      throw new TypeError('Unsupported className type');
    }

    const targetClasses = vdom.properties.className || (vdom.properties.className = {});

    Object.assign(targetClasses, classes);

    delete copyArg.className;
  }
}

function handleStyle(copyArg, vdom) {
  if ('style' in copyArg) {
    let style = copyArg.style;
    const styles = [];
    if (!Array.isArray(style)) {
      style = [style];
    }
    const toStyleObject = r => {
      const pair = r.split(':');
      return { [pair[0].trim()]: pair[1].trim() };
    };

    for (let s of style) {
      if (typeof s === 'string') {
        styles.push(
          Object.assign(...s.match(/\w+\s*:\s*\w+/g)
            .map(toStyleObject))
        );
      } else {
        styles.push(s);
      }
    }


    vdom.properties.style = Object.assign(vdom.properties.style || {}, ...styles);
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
  let vdom = {
    __vdom: true,
    tagName: null,
    properties: {},
    children: []
  };

  if (typeof tagName === 'string') {
    vdom.tagName = parseTag(tagName, vdom.properties);
  } else if ( isVdom(tagName) ) {
    vdom = JSON.parse(JSON.stringify(tagName));
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


export const props = widget('');
