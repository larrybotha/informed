import React from 'react';
import withDocs from '../../utils/withDocs';
import readme from './README.md';
import FormState from '../../utils/FormState';
import Ajv from 'ajv';

import { Form, SchemaFields } from '../../../src';

const initialValue = [
  {
    name: 'Joe',
    age: '26'
  },
  {
    name: 'Elon',
    age: '49'
  }
];

const schema = {
  type: 'object',
  required: ['name', 'siblings'],
  properties: {
    name: {
      type: 'string',
      title: 'First name',
      'ui:control': 'input'
    },
    siblings: {
      type: 'array',
      minItems: 2,
      'ui:control': 'array',
      'ui:before': [{ 'ui:control': 'add' }],
      'informed:props': {
        initialValue
      },
      items: {
        type: 'object',
        'ui:after': [{ 'ui:control': 'remove' }],
        required: ['name', 'age'],
        properties: {
          name: {
            type: 'string',
            title: 'Sibling name',
            'ui:control': 'input'
          },
          age: {
            type: 'number',
            title: 'Sibling age',
            minimum: 0,
            'ui:control': 'input',
            'input:props': {
              type: 'number'
            }
          },
          married: {
            type: 'string',
            title: 'Are you married?',
            enum: ['yes', 'no'],
            'ui:control': 'radio'
            // 'informed:props': {
            //   notify: ['spouse']
            // }
          },
          spouse: {
            type: 'string',
            title: 'Spouse name',
            'ui:control': 'input',
            'informed:props': {
              relevant: (values, { parentPath, get }) => {
                const married = get(values, `${parentPath}.married`);
                return married === 'yes';
              }
            }
          }
        }
      }
    }
  }
};

const Schema = () => (
  <Form
    ajv={Ajv}
    schema={schema}
    onSubmit={values => window.alert(JSON.stringify(values, null, 2))}>
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1' }}>
        <SchemaFields />
        <button type="submit">Submit</button>
      </div>
      <div style={{ flex: '1' }}>
        <FormState errors values />
      </div>
    </div>
  </Form>
);

export default withDocs(readme, Schema);
