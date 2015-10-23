import _ from 'lodash';
import faker from 'faker';
import React, {Component} from 'react';
import {isDOMComponent} from 'react-addons-test-utils';
import stardust from 'stardust';
import META from 'src/utils/Meta';

const getSDClassName = componentName => `sd-${_.kebabCase(componentName)}`;

/**
 * This test ensures all Stardust components conform to our guidelines.
 */
describe('Conformance', () => {
  /* eslint-disable no-console */
  console.info('Conformance-test renders all components with no props, warnings may occur.');
  /* eslint-enable no-console */
  _.each(stardust, (SDComponent, name) => {
    const classes = faker.fake('{{hacker.noun}} {{hacker.noun}} {{hacker.noun}}');
    const sdClass = getSDClassName(name);
    const firstChild = _.first(render(<SDComponent />).children());

    describe(name, () => {
      it('extends Component', () => {
        expect(SDComponent.prototype).to.eql(Component.prototype);
      });

      it(`constructor name is "${name}" (matches component name)`, () => {
        SDComponent.prototype.constructor.name.should.equal(name);
      });

      it(`has the "${sdClass}" element as its first child (no wrapper elements)`, () => {
        expect(firstChild.props.className).to.contain(sdClass);
      });

      describe('_meta', () => {
        const _meta = _.get(SDComponent, '_meta');
        it('is a static object prop', () => {
          expect(_meta).to.be.an('object');
        });

        describe('library', () => {
          it('is defined', () => {
            expect(_meta).to.have.any.keys('library');
          });
          it('is a META.library', () => {
            expect(_.values(META.library)).to.include(_meta.library);
          });
        });
        describe('name', () => {
          it('is defined', () => {
            expect(_meta).to.have.any.keys('name');
          });
          it('matches the component name', () => {
            expect(_meta.name).to.equal(name);
          });
        });
        if (_.has(_meta, 'parent')) {
          describe('parent', () => {
            it('is a stardust component name', () => {
              expect(_.keys(stardust)).to.contain(_meta.parent);
            });
          });
        }
        describe('type', () => {
          it('is defined', () => {
            expect(_meta).to.have.any.keys('type');
          });
          it('is a META.type', () => {
            expect(_.values(META.type)).to.include(_meta.type);
          });
        });
      });

      describe('props', () => {
        it('spreads props', () => {
          const props = {};
          _.times(2, () => {
            // single word props
            props[faker.hacker.noun()] = faker.hacker.noun();
            // camelCased props
            props[_.camelCase(faker.hacker.phrase())] = faker.hacker.phrase();
            // kebab-cased props
            props[_.kebabCase(faker.hacker.phrase())] = faker.hacker.phrase();
          });

          // create element with random props
          const componentWithProps = <SDComponent {...props} />;

          const hasSpreadProps = render(componentWithProps)
            .children()
            .some(element => _.every([element.props], props));

          hasSpreadProps.should.equal(true);
        });

        describe('className', () => {
          it(`has props.className after "${sdClass}"`, () => {
            const renderedClasses = render(<SDComponent className={classes} />)
              .findClass(sdClass)
              .props.className;
            const sdClassIndex = renderedClasses.indexOf(sdClass);
            const classesIndex = renderedClasses.indexOf(classes);
            expect(sdClassIndex).to.be.below(classesIndex);
          });

          // Determine if this SDComponent is composed of DOM components (div, span, etc)
          // or if it is composed of other components (<Modal />, <textarea />, etc)
          //
          // Components composed of DOM components will have their "sd-*" class listed first:
          //
          //   <Modal /> => <div className='sd-modal...
          //   The "sd-modal" class is first.
          //
          // Components composed of Components will have their "sd-*" classes in an unknown position:
          //
          //   <Confirm /> => <Modal /> => <div className='sd-modal sd-confirm...
          //   The "sd-confirm" class is inherited by Modal, after the "sd-modal" class
          //   It is not practical to assume the position of the "sd-*" for composite components.
          //   There may be intermediate classes such as "ui" and other composite component classes.

          if (isDOMComponent(firstChild)) {
            it(`has "${sdClass}" as the first class`, () => {
              render(<SDComponent />)
                .findClass(sdClass)
                .getAttribute('class')
                .indexOf(sdClass).should.equal(0);
            });
          }

          if (META.isModule(SDComponent) && !META.isChild(SDComponent)) {
            describe('settings', () => {
              it('is defined in propTypes', () => {
                SDComponent.propTypes.settings.should.be.a('function');
              });
              it('is not spread', () => {
                const props = {settings: {}};
                render(<SDComponent {...props} />)
                  .children()
                  .some(element => _.has(element.props, 'settings'))
                  .should.equal(false);
              });
            });
          }
        });
      });
    });
  });
});
