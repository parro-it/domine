// taken from https://github.com/Raynos/virtual-hyperscript/blob/master/parse-tag.js

const classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
const notClassId = /^\.|#/;

export default function parseTag(tag, props) {
  if (!tag) {
    return 'div';
  }

  let noId = !('id' in props);

  let tagParts = tag.split(classIdSplit);
  let tagName = null;

  if (notClassId.test(tagParts[1])) {
    tagName = 'div';
  }

  let classes;
  let type;
  for (let part of tagParts) {
    if (!part) {
      continue;
    }

    type = part.charAt(0);

    if (!tagName) {
      tagName = part;
    } else if (type === '.') {
      classes = classes || [];
      classes.push(part.substring(1, part.length));
    } else if (type === '#' && noId) {
      props.id = part.substring(1, part.length);
    }
  }

  if (classes) {
    if (props.className) {
      classes.push(props.className);
    }

    props.className = classes.join(' ');
  }

  return tagName ? tagName.toLowerCase() : 'div';
}
