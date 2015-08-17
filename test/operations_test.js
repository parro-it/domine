let moduleRoot = '../es6/operations';
if (process.env.TEST_RELEASE) {
  moduleRoot = '../dist';
}

const { create, clear, append, replace, assign, query } = require(moduleRoot);

describe('create', () => {
  it('is a function', () => {
    create.should.be.a('function');
  });

  it('return voperation', () => {
    create({__vdom: true}, {__vdom: true}).should.be.deep.equal({
      operation: 'create',
      fragment: [{__vdom: true}, {__vdom: true}]
    });
  });
});


describe('clear', () => {
  it('is a function', () => {
    clear.should.be.a('function');
  });

  it('return voperation', () => {
    clear('.table').should.be.deep.equal({
      operation: 'clear',
      selector: '.table'
    });
  });
});


describe('append', () => {
  it('is a function', () => {
    append.should.be.a('function');
  });

  it('return voperation', () => {
    append('.table', {__vdom: true}, {__vdom: true}).should.be.deep.equal({
      operation: 'append',
      selector: '.table',
      fragment: [{__vdom: true}, {__vdom: true}]
    });
  });
});


describe('replace', () => {
  it('is a function', () => {
    replace.should.be.a('function');
  });


  it('return voperation', () => {
    replace('.table', {__vdom: true}, {__vdom: true}).should.be.deep.equal({
      operation: 'replace',
      selector: '.table',
      fragment: [{__vdom: true}, {__vdom: true}]
    });
  });
});


describe('assign', () => {
  it('is a function', () => {
    assign.should.be.a('function');
  });

  it('return voperation', () => {
    assign('.table', {__vdom: true}).should.be.deep.equal({
      operation: 'assign',
      selector: '.table',
      element: {__vdom: true}
    });
  });
});


describe('query', () => {
  it('is a function', () => {
    query.should.be.a('function');
  });

  it('return voperation', () => {
    query('.table', ['class', 'id']).should.be.deep.equal({
      operation: 'query',
      selector: '.table',
      properties: ['class', 'id']
    });
  });
});
