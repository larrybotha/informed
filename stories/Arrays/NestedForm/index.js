import React from 'react';
import withDocs from '../../utils/withDocs';
import readme from './README.md';
import FormState from '../../utils/FormState';
import { Form, Text, ArrayField } from '../../../src';

const initialValues = {
  friends: [
    {
      name: 'Joe',
      age: '20'
    },
    {
      name: 'Jane',
      age: '20'
    }
  ]
};

// const friends = Array.from(Array(50)).map(e => {
//   return { name: 'Joe', age: 1 };
// });

// const initialValues = {
//   friends
// };

const NestedForm = () => (
  <div>
    <Form initialValues={initialValues}>
      {({ formApi, formState }) => {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, marginRight: '2rem' }}>
              <ArrayField field="friends">
                {({ add, addWithInitialValue, reset }) => {
                  return (
                    <React.Fragment>
                      <button
                        onClick={() => {
                          reset();
                        }}
                        type="button">
                        Reset
                      </button>
                      <button
                        onClick={() => {
                          add();
                        }}
                        type="button">
                        Add
                      </button>

                      <button
                        onClick={() => {
                          addWithInitialValue({ name: 'test' });
                        }}>
                        Add with initialValue
                      </button>

                      {/* <button
                        onClick={() => {
                          formApi.setValue('friends[0].name', 'Test');
                        }}
                        type="button">
                        set friends[0].name to test
                      </button> */}

                      {/* <button
                        onClick={() => {
                          formApi.setInitialValue('friends', [
                            {
                              name: 'Boo',
                              age: '30'
                            },
                            {
                              name: 'Bar',
                              age: '50'
                            }
                          ]);
                        }}
                        type="button">
                        Set new initial values
                      </button> */}

                      <ArrayField.Items>
                        {({ remove, field, reset, values, setValue }) => (
                          <label>
                            <h5>{field}</h5>
                            <Text field={`${field}.name`} />
                            <Text field={`${field}.age`} />
                            {/* <Text field={`${field}.a`} />
                            <Text field={`${field}.b`} />
                            <Text field={`${field}.c`} />
                            <Text field={`${field}.d`} />
                            <Text field={`${field}.e`} />
                            <Text field={`${field}.f`} />
                            <Text field={`${field}.g`} />
                            <Text field={`${field}.h`} />
                            <Text field={`${field}.i`} />
                            <Text field={`${field}.j`} />
                            <Text field={`${field}.k`} />
                            <Text field={`${field}.l`} />
                            <Text field={`${field}.m`} /> */}

                            <button type="button" onClick={reset}>
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => setValue('name', 'Elon')}>
                              Set Name to "Elon"
                            </button>
                            <button type="button" onClick={remove}>
                              Remove
                            </button>
                            <pre>
                              <code>{JSON.stringify(values, null, 2)}</code>
                            </pre>
                          </label>
                        )}
                      </ArrayField.Items>
                    </React.Fragment>
                  );
                }}
              </ArrayField>
            </div>
            <div style={{ flex: 2, minWidth: '300px' }}>
              <FormState />
            </div>
          </div>
        );
      }}
    </Form>
  </div>
);

export default withDocs(readme, NestedForm);
