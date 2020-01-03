import { mount } from '@vue/test-utils';
import { QueryBuilderConfig, RuleSet } from '@/types';
import QueryBuilder from '@/QueryBuilder.vue';
import QueryBuilderGroup from '@/QueryBuilderGroup.vue';
import Number from '../components/Number.vue';
import Input from '../components/Input.vue';

describe('Testing drag\'n\'drop related features', () => {
  const config: QueryBuilderConfig = {
    operators: [
      {
        name: 'and',
        identifier: 'AND',
      },
      {
        name: 'or',
        identifier: 'OR',
      },
    ],
    rules: [
      {
        identifier: 'txt',
        name: 'Text Selection',
        component: Input,
        initialValue: 'foo',
      },
      {
        identifier: 'num',
        name: 'Number Selection',
        component: Number,
        initialValue: 10,
      },
    ],
  };

  const value: RuleSet = {
    operatorIdentifier: 'OR',
    children: [{
      operatorIdentifier: 'AND',
      children: [{
        identifier: 'txt',
        value: 'A',
      }, {
        identifier: 'txt',
        value: 'B',
      }, {
        identifier: 'txt',
        value: 'C',
      }, {
        operatorIdentifier: 'AND',
        children: [{
          identifier: 'txt',
          value: 'c',
        }, {
          identifier: 'txt',
          value: 'd',
        }, {
          operatorIdentifier: 'AND',
          children: [{
            identifier: 'txt',
            value: 'a',
          }, {
            identifier: 'txt',
            value: 'b',
          }],
        }],
      }],
    }, {
      operatorIdentifier: 'AND',
      children: [{
        identifier: 'txt',
        value: 'X',
      }, {
        identifier: 'txt',
        value: 'Y',
      }, {
        identifier: 'txt',
        value: 'Z',
      }, {
        operatorIdentifier: 'AND',
        children: [{
          identifier: 'txt',
          value: '',
        }, {
          operatorIdentifier: 'AND',
          children: [{
            identifier: 'txt',
            value: '',
          }, {
            operatorIdentifier: 'AND',
            children: [{
              operatorIdentifier: 'AND',
              children: [{
                identifier: 'txt',
                value: '',
              }, {
                identifier: 'num',
                value: 10,
              }],
            }],
          }],
        }],
      }],
    }],
  };

  it('asserts nothing happens if colors are not configured', () => {
    const app = mount(QueryBuilder, {
      propsData: {
        value,
        config,
      },
    });

    const groups = app.findAll(QueryBuilderGroup);
    expect(groups).toHaveLength(9);

    groups.wrappers
      .forEach((w) => {
        expect(w.vm.$props).toHaveProperty('depth');
        const el = (w.find('.query-builder-group__group-children')).element as HTMLDivElement;
        expect(el.style.borderColor).toBeFalsy();
      });
  });

  it('checks border colors are applied properly', () => {
    const colors = [
      'hsl(88, 50%, 55%)',
      'hsl(187, 100%, 45%)',
      'hsl(15, 100%, 55%)',
    ];
    const newConfig: QueryBuilderConfig = { ...config, colors };

    const app = mount(QueryBuilder, {
      propsData: {
        value,
        config: newConfig,
      },
    });

    const groups = app.findAll(QueryBuilderGroup);
    expect(groups).toHaveLength(9);

    groups.wrappers
      .forEach((w) => {
        expect(w.vm.$props).toHaveProperty('depth');
        const el = (w.find('.query-builder-group__group-children')).element as HTMLDivElement;
        const targetIdx = w.vm.$props.depth % w.vm.$props.config.colors.length;
        expect(el.style).toHaveProperty('borderColor', colors[targetIdx]);
      });
  });
});
