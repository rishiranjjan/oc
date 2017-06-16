'use strict';

const expect = require('chai').expect;
const injectr = require('injectr');
const path = require('path');
const _ = require('lodash');

describe('utils : require-template', () => {
  const globals = {
    __dirname: '.'
  };

  const deps = {
    path: {
      join(a, b, c, template) {
        return path.join(a, b, c, template);
      },
      resolve(a, b, template) {
        const dir = path.join(
          path.resolve(),
          'node_modules/oc-template-handlebars/node_modules',
          template
        );
        return dir;
      }
    }
  };

  const requireTemplate = injectr(
    '../../src/utils/require-template.js',
    deps,
    globals
  );

  it('should return the template found if its of the correct type', () => {
    const template = requireTemplate('oc-template-jade');
    const templateAPIs = _.keys(template);

    expect(
      _.includes(
        templateAPIs,
        'getInfo',
        'getCompiledTemplate',
        'compile',
        'render'
      )
    ).to.be.true;
  });

  it("should throw an error if the template found hasn't the right format", () => {
    try {
      requireTemplate('handlebars');
    } catch (e) {
      expect(e.message).to.equal(
        'Error requiring oc-template: "handlebars" is not a valid oc-template'
      );
    }
  });
});

const requireTemplate = require('../../src/utils/require-template');

describe('requireTemplate', () => {
  it('expect type of `requireTemplate` to be function', () => {
    expect(typeof requireTemplate).to.equal('function');
  });

  describe('valid', () => {
    const scenarios = [
      { name: 'oc-template-handlebars' },
      { name: 'oc-template-jade' }
    ];

    scenarios.forEach(({ name }) => {
      it(name, () => {
        const template = requireTemplate(name);

        [
          'compile',
          'getCompiledTemplate',
          'getInfo',
          'render'
        ].forEach(method => {
          expect(template).to.have.property(method);
        });
      });
    });
  });

  describe('not valid', () => {
    const scenarios = [{ name: 'lodash' }, { name: 'oc-invalid-template' }];

    scenarios.forEach(({ name }) => {
      it(name, () => {
        const sut = () => {
          requireTemplate(name);
        };

        expect(sut).to.throw();
      });
    });
  });
});
