let moduleRoot = '../es6';
if (process.env.TEST_RELEASE) {
  moduleRoot = '../dist';
}

const domine = require(moduleRoot);

describe('domine', () => {
  it('works', async () => {
    const result = await domine();
    result.should.be.equal(42);
  });
});

