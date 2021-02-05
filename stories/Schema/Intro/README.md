# JSON Schema Form

** Note: This is in beta and is subject to change! **

<!-- STORY -->

```jsx
import { Form, SchemaFields, FormState } from 'informed';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'First name',
      'ui:control': 'input',
      'informed:props': {
        validate: v => (v == null ? 'Required' : undefined)
      }
    },
    age: {
      type: 'number',
      title: 'First name',
      'ui:control': 'input',
      'input:props': {
        type: 'number'
      }
    },
    bio: {
      type: 'string',
      title: 'Bio',
      'ui:control': 'textarea'
    },
    authorize: {
      type: 'string',
      title: 'Authorize',
      'ui:control': 'checkbox'
    },
    color: {
      type: 'string',
      title: 'Color',
      'ui:control': 'select',
      oneOf: [
        {
          const: '',
          title: '- Select -',
          'input:props': {
            disabled: true
          }
        },
        { const: 'red', title: 'Red' },
        { const: 'black', title: 'Black' },
        { const: 'white', title: 'White' }
      ]
    },
    model: {
      type: 'string',
      title: 'Model',
      'ui:control': 'radio',
      oneOf: [
        { const: 'ms', title: 'Model S' },
        { const: 'm3', title: 'Model 3' },
        { const: 'mx', title: 'Model X' },
        { const: 'my', title: 'Model Y' }
      ],
      default: null,
      'informed:props': {
        initialValue: 'm3'
      }
    },
    cars: {
      type: 'array',
      title: 'Cars',
      'ui:control': 'select',
      'input:props': {
        multiple: true,
        style: { height: '100px', width: '200px' }
      },
      items: {
        oneOf: [
          { const: 'tesla', title: 'Tesla' },
          { const: 'volvo', title: 'Volvo' },
          { const: 'audi', title: 'Audi' },
          { const: 'jeep', title: 'Jeep' }
        ]
      },
      'informed:props': {
        initialValue: ['jeep', 'tesla']
      }
    }
  }
};

const Schema = () => (
  <Form schema={schema}>
    <SchemaFields />
    <button type="submit">Submit</button>
    <FormState />
  </Form>
);
```
