let moduleRoot = '../es6';
if (process.env.TEST_RELEASE) {
  moduleRoot = '../dist';
}

const domine = require(moduleRoot).default;
const widget = require(moduleRoot).widget;

describe('widget', () => {
  it('return function', () => {
    const result = widget('h1');
    result.should.be.a('function');
  });

  it('mix vdom with widget one', () => {
    const w = widget('h1', {prop1: '42'});
    const result = w({prop2: '43'});
    result.should.be.deep.equal({
      __vdom: true,
      tagName: 'h1',
      properties: {
        prop1: '42',
        prop2: '43'
      },
      children: []
    });
  });

  it('widget could inherits other widgets', () => {
    const w = widget('h1', {prop1: '42'});
    const w2 = widget(w(), {prop3: '44'});
    const result = w2({prop2: '43'});
    result.should.be.deep.equal({
      __vdom: true,
      tagName: 'h1',
      properties: {
        prop1: '42',
        prop2: '43',
        prop3: '44'
      },
      children: []
    });
  });
});

describe('domine', () => {
  it('return vdom', () => {
    const result = domine('h1');
    result.__vdom.should.be.equal(true);
  });

  it('first argument if string set vdom tagName', () => {
    const result = domine('h1');
    result.tagName.should.be.equal('h1');
  });


  it('first argument if string could contains className', () => {
    const result = domine('h1.column');
    result.tagName.should.be.equal('h1');
    result.properties.className.should.be.deep.equal(['column']);
  });

  it('first argument if string could contains id', () => {
    const result = domine('h1#header');
    result.tagName.should.be.equal('h1');
    result.properties.id.should.be.equal('header');
    should.equal(result.properties.className, undefined);
  });

  it('first argument if string could contains id and class', () => {
    const result = domine('h1#header.column');
    result.tagName.should.be.equal('h1');
    result.properties.id.should.be.equal('header');
    result.properties.className.should.be.deep.equal(['column']);
  });

  it('throw if first argument is number', () => {
    should.Throw(() =>domine(42), TypeError); // eslint-disable-line new-cap
  });

  it('throw if first argument is non vdom object', () => {
    should.Throw(() =>domine({}), TypeError); // eslint-disable-line new-cap
  });

  it('throw if first argument is boolean', () => {
    should.Throw(() =>domine(true), TypeError); // eslint-disable-line new-cap
  });

  it('throw if first argument is regexp', () => {
    should.Throw(() =>domine(/.*/), TypeError); // eslint-disable-line new-cap
  });

  it('throw if first argument is date', () => {
    should.Throw(() =>domine(new Date()), TypeError); // eslint-disable-line new-cap
  });

  it('first argument if vdom set initial vdom', () => {
    const result = domine(domine('h1', {prop1: '42'}), {prop2: '43'});

    result.should.be.deep.equal({
      __vdom: true,
      tagName: 'h1',
      properties: {
        prop1: '42',
        prop2: '43'
      },
      children: []
    });
  });

  it('objects arguments set vdom properties', () => {
    const result = domine('h1', {className: 'for-test'});
    result.properties.className.should.be.deep.equal(['for-test']);
  });

  it('handle multiple classes in string', () => {
    const result = domine('h1', {className: 'for-test1 for-test2'});
    result.properties.className.should.be.deep.equal(['for-test1', 'for-test2']);
  });

  it('handle mix of class styles', () => {
    const result = domine('main.one',
      {className: {two: true}},
      {className: 'three'},
      {className: ['four', 'five']}
    );
    result.properties.className.should.be.deep.equal(
      ['one', 'two', 'three', 'four', 'five']
    );
  });

  it('handle multiple classes in array', () => {
    const result = domine('h1', {className: ['for-test1', 'for-test2']});
    result.properties.className.should.be.deep.equal(['for-test1', 'for-test2']);
  });

  it('handle multiple classes as boolean values', () => {
    const result = domine('h1', {className: {test1: true, test2: true, test3: false}});
    result.properties.className.should.be.deep.equal(['test1', 'test2']);
  });

  it('handle multiple classes in array or string', () => {
    const result = domine('h1', {
      className: ['for-test1', 'for-test2']
    }, {
      className: 'for-test3\tfor-test4'
    });
    result.properties.className.should.be.deep.equal(['for-test1', 'for-test2', 'for-test3', 'for-test4']);
  });

  it('does not duplicate classnames', () => {
    const result = domine('h1', {
      className: ['for-test1']
    }, {
      className: ['for-test1']
    });
    result.properties.className.should.be.deep.equal(['for-test1']);
  });

  it('merge className properties', () => {
    const result = domine('h1', {className: 'for-test1'}, {className: 'for-test2'});
    result.properties.className.should.be.deep.equal(['for-test1', 'for-test2']);
  });

  it('merge style properties', () => {
    const result = domine('h1', {style: {color: 'black'}}, {style: {border: 'none'}});
    result.properties.style.should.be.deep.equal({color: 'black', border: 'none' });
  });

  it('handle style properties as strings', () => {
    const result = domine('main',
      {style: {color: 'red'}},
      {style: 'background:black; border:none'},
      {style: ['display:block', 'float:left']}
    );
    result.properties.style.should.be.deep.equal({
      color: 'red',
      background: 'black',
      border: 'none',
      display: 'block',
      'float': 'left'
    });
  });

  it('handle mixed style properties', () => {
    const result = domine('h1', {style: 'color:black'}, {style: 'border:none'});
    result.properties.style.should.be.deep.equal({color: 'black', border: 'none' });
  });

  it('string arguments appended to children as string', () => {
    const result = domine('h1', 'for-test');
    result.children.should.be.deep.equal(['for-test']);
  });

  it('vdom arguments appended to children as vdom', () => {
    const result = domine('h1', 'for-test', domine('span', 'this is text'));
    result.children.should.be.deep.equal(['for-test', {
      __vdom: true,
      children: [
        'this is text'
      ],
      properties: {},
      tagName: 'span'
    }]);
  });

  it('flatten received children arguments', () => {
    const result = domine('h1', 1, [2, 3], 4);
    result.children.should.be.deep.equal(['1', '2', '3', '4']);
  });

  it('number arguments appended to children as string', () => {
    const result = domine('h1', 42.42);
    result.children.should.be.deep.equal(['42.42']);
  });

  it('boolean true arguments appended to children as string', () => {
    const result = domine('h1', true);
    result.children.should.be.deep.equal(['true']);
  });

  it('boolean false arguments appended to children as string', () => {
    const result = domine('h1', false);
    result.children.should.be.deep.equal(['false']);
  });

  it('null arguments appended to children as empty string', () => {
    const result = domine('h1', null);
    result.children.should.be.deep.equal(['']);
  });

  it('undefined arguments appended to children as empty string', () => {
    const result = domine('h1', undefined);
    result.children.should.be.deep.equal(['']);
  });
});

